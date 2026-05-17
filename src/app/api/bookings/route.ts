import { NextResponse } from "next/server";
import { bookingCreateSchema } from "@/lib/schema";
import { supabaseAnon } from "@/lib/supabase";
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

  const { data: booked, error: bookingError } = await supabaseAnon
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

  const { data: villaData } = await supabaseAnon.from("villas").select("name").eq("id", villaId).single();
  const villaName = (villaData as any)?.name ?? "Villa";

  const { data: booking, error } = await (supabaseAnon as any)
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
      villa_price: values.villa_price,
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
    await (supabaseAnon as any).from("booking_addons").insert(
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
