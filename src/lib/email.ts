export async function sendBookingNotification({
  subject,
  recipient,
  html
}: {
  subject: string;
  recipient: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: `booking@${new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://saliguri-harau.vercel.app").host}`,
      to: recipient,
      subject,
      html
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Resend error:", error);
  }

  return response.ok;
}

export function bookingEmailHtml({ bookingCode, guestName, villaName, checkIn, checkOut, totalAmount, siteUrl }: {
  bookingCode: string;
  guestName: string;
  villaName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  siteUrl: string;
}) {
  return `<div style="font-family: system-ui, sans-serif; color:#111;"><h2>Terima kasih, ${guestName}</h2><p>Booking Anda berhasil dibuat dengan kode <strong>${bookingCode}</strong>.</p><p>Villa: ${villaName}</p><p>Check-in: ${checkIn}</p><p>Check-out: ${checkOut}</p><p>Total: Rp ${totalAmount.toLocaleString("id-ID")}</p><p>Admin akan segera menghubungi Anda melalui WhatsApp untuk konfirmasi.</p><p><a href="${siteUrl}/booking/success?code=${bookingCode}">Lihat detail booking</a></p></div>`;
}
