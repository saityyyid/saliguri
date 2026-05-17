import { NextResponse } from "next/server";
import { verifyAdminSession, createAdminClient } from "@/lib/adminAuth";
import { statusUpdateSchema } from "@/lib/schema";
import { sendBookingNotification, bookingEmailHtml } from "@/lib/email";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = statusUpdateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.errors.map((item) => item.message).join(", ") }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*, villas(name, slug)")
    .eq("id", params.id)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json({ error: "Booking tidak ditemukan." }, { status: 404 });
  }

    const newStatus = (result as any).data.status;
    const newPaymentStatus = (result as any).data.payment_status ?? (booking as any).payment_status;

    const { data, error } = await (supabase as any)
      .from("bookings")
      .update({ status: newStatus, payment_status: newPaymentStatus, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Gagal memperbarui status." }, { status: 500 });
  }

  const b = booking as any;
  if (process.env.RESEND_API_KEY && b.guest_email) {
    const html = bookingEmailHtml({
      bookingCode: b.booking_code,
      guestName: b.guest_name,
      villaName: b.villas.name,
      checkIn: b.check_in,
      checkOut: b.check_out,
      totalAmount: b.grand_total,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://saliguri-harau.vercel.app"
    });
    await sendBookingNotification({ subject: `Update Booking ${b.booking_code}`, recipient: b.guest_email, html });
  }

  return NextResponse.json({ booking: data });
}
