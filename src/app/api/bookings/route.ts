import { NextResponse } from "next/server";
import { bookingCreateSchema } from "@/lib/schema";
import { createAdminClient } from "@/lib/adminAuth";
import { sendBookingNotification, bookingEmailHtml } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json();
  const parse = bookingCreateSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json({ error: parse.error.errors.map((item) => item.message).join(", ") }, { status: 400 });
  }

  const values = parse.data;
  const villaId = Number(values.villa_id);
  const start = values.check_in;
  const end = values.check_out;

  const supabase = createAdminClient();
  const { data: booked, error: bookingError } = await supabase
    .from("bookings")
    .select("id")
    .eq("villa_id", villaId)
    .neq("status", "cancelled")
    .or(`and(check_in.lt.${end},check_out.gt.${start})`);

  if (bookingError) {
    return NextResponse.json({ error: bookingError.message }, { status: 500 });
  }

  if ((booked?.length ?? 0) > 0) {
    return NextResponse.json({ error: "Villa tidak tersedia pada tanggal tersebut." }, { status: 400 });
  }

  const code = `SAL${Date.now()}`;
  const paymentStatus = values.payment_proof_url ? "dp_paid" : "unpaid";

  const { data: villaData } = await supabase
    .from("villas")
    .select("name, price_per_night, base_capacity, max_capacity, extrabed_limit")
    .eq("id", villaId)
    .single();
  const villaName = (villaData as any)?.name ?? "Villa";
  const villaPrice = (villaData as any)?.price_per_night ?? values.villa_price;
  const baseCapacity = (villaData as any)?.base_capacity ?? 0;
  const maxCapacity = (villaData as any)?.max_capacity ?? 0;
  const extrabedLimit = (villaData as any)?.extrabed_limit ?? 0;
  const calculatedExtraBed = Math.max(0, values.guest_count - baseCapacity);
  if (calculatedExtraBed > extrabedLimit) {
    return NextResponse.json({ error: `Maksimal ${maxCapacity} orang dengan ${extrabedLimit} extra bed.` }, { status: 400 });
  }
  const extraBedPrice = 100000;
  const extraBedTotal = calculatedExtraBed * extraBedPrice;
  const expectedGrandTotal = villaPrice * values.nights + values.addon_total + extraBedTotal;
  if (values.grand_total !== expectedGrandTotal) {
    return NextResponse.json({ error: "Total pembayaran tidak valid. Silakan periksa ringkasan Anda." }, { status: 400 });
  }
  const expectedDp = Math.round(expectedGrandTotal * 0.5);
  if (values.dp_amount !== expectedDp) {
    return NextResponse.json({ error: "DP minimal harus 50% dari total pembayaran." }, { status: 400 });
  }

  const { data: booking, error } = await (supabase as any)
    .from("bookings")
    .insert({
      booking_code: code,
      villa_id: villaId,
      guest_name: values.guest_name,
      guest_phone: values.guest_phone,
      guest_email: values.guest_email || null,
      check_in: values.check_in,
      check_out: values.check_out,
      nights: values.nights,
      guest_count: values.guest_count,
      extrabed_count: calculatedExtraBed,
      villa_price: villaPrice,
      addon_total: values.addon_total,
      grand_total: values.grand_total,
      dp_amount: values.dp_amount,
      status: "pending",
      payment_proof_url: values.payment_proof_url || null,
      payment_status: paymentStatus,
      notes: values.notes || null
    })
    .select()
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: error?.message || "Gagal menyimpan booking." }, { status: 500 });
  }

  if (values.addons?.length) {
    await (supabase as any).from("booking_addons").insert(
      values.addons.map((addon) => ({
        booking_id: booking.id,
        addon_name: addon.addon_name,
        quantity: addon.quantity,
        price_per_unit: addon.price_per_unit,
        total_price: addon.total_price
      }))
    );
  }

  const html = bookingEmailHtml({
    bookingCode: code,
    guestName: values.guest_name,
    villaName,
    checkIn: values.check_in,
    checkOut: values.check_out,
    totalAmount: values.grand_total,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://saliguri-harau.vercel.app"
  });

  if (process.env.RESEND_API_KEY) {
    await sendBookingNotification({ subject: `Booking Baru ${code}` , recipient: process.env.ADMIN_EMAIL ?? "admin@saliguri.com", html });
    if (values.guest_email) {
      await sendBookingNotification({ subject: `Konfirmasi Booking ${code}`, recipient: values.guest_email, html });
    }
  }

  return NextResponse.json({ booking_code: code, booking });
}
