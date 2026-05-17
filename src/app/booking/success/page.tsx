import Link from "next/link";
import { getSupabaseAnon } from "@/lib/supabase";
import { formatDate, formatRupiah, getWhatsAppLink } from "@/lib/utils";
import type { Booking } from "@/types";

export const dynamic = "force-dynamic";

async function getBooking(code: string | null) {
  const supabaseAnon = getSupabaseAnon();
  if (!code) return null;
  const { data, error } = await supabaseAnon
    .from("bookings")
    .select("*, villas(*)")
    .eq("booking_code", code)
    .single();

  if (error || !data) return null;
  return data as Booking & { villas: { name: string; slug: string } };
}

export default async function SuccessPage({ searchParams }: { searchParams: { code?: string } }) {
  const booking = await getBooking(searchParams.code ?? null);

  if (!booking) {
    return (
      <main className="container py-20">
        <div className="rounded-[40px] border border-slate-200 bg-white p-10 text-center shadow-soft">
          <h1 className="text-3xl font-semibold text-slate-900">Booking tidak ditemukan</h1>
          <p className="mt-4 text-slate-700">Pastikan kode booking sudah benar atau cek kembali dari halaman status booking.</p>
          <Link href="/cek-booking" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-white">Cek Status Booking</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-10">
      <div className="rounded-[40px] border border-slate-200 bg-white p-10 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Terima kasih! Booking Anda berhasil.</h1>
        <p className="mt-3 text-slate-700">Admin akan menghubungi Anda melalui WhatsApp untuk konfirmasi lebih lanjut.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Kode Booking</p>
            <p className="mt-3 text-2xl font-semibold text-primary">{booking.booking_code}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Status</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900 capitalize">{booking.status}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Villa</p>
            <p className="mt-3 text-xl font-semibold text-slate-900">{booking.villas.name}</p>
            <p className="mt-2 text-slate-700">Check-in {formatDate(booking.check_in)}</p>
            <p className="text-slate-700">Check-out {formatDate(booking.check_out)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total Pembayaran</p>
            <p className="mt-3 text-xl font-semibold text-slate-900">{formatRupiah(booking.grand_total)}</p>
            <p className="mt-2 text-slate-700">DP 50%: {formatRupiah(booking.dp_amount)}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={getWhatsAppLink(`Halo Saliguri, saya ingin konfirmasi booking dengan kode ${booking.booking_code}`)} className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-[#24450f]">
            Chat Admin WhatsApp
          </a>
          <Link href="/cek-booking" className="inline-flex items-center justify-center rounded-full border border-primary bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-slate-100">
            Cek Status Booking
          </Link>
        </div>
      </div>
    </main>
  );
}
