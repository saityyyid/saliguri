"use client";

import { useState } from "react";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CekBookingPage() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setBooking(null);
    const query = new URLSearchParams({ code, phone }).toString();
    const res = await fetch(`/api/bookings/verify?${query}`);
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Booking tidak ditemukan.");
      return;
    }
    setBooking(data.booking);
  };

  return (
    <main className="container py-10">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-semibold text-slate-900">Cek Status Booking</h1>
          <p className="mt-3 text-slate-700">Masukkan kode booking dan nomor WhatsApp untuk melihat status reservasi Anda.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Kode Booking</span>
              <input value={code} onChange={(event) => setCode(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="SAL12345" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Nomor WhatsApp</span>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="081368008800" />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" variant="primary" disabled={loading}>{loading ? "Memeriksa…" : "Cek Status"}</Button>
            </div>
          </form>
          {error && <p className="mt-6 rounded-3xl bg-danger/10 p-4 text-sm text-danger">{error}</p>}
          {booking && (
            <div className="mt-6 rounded-[32px] border border-slate-200 bg-slate-50 p-6">
              <p className="font-semibold text-slate-900">Kode: {booking.booking_code}</p>
              <p className="mt-2 text-slate-700">Nama: {booking.guest_name}</p>
              <p className="mt-2 text-slate-700">Villa ID: {booking.villa_id}</p>
              <p className="mt-2 text-slate-700">Check-in: {formatDate(booking.check_in)}</p>
              <p className="mt-2 text-slate-700">Check-out: {formatDate(booking.check_out)}</p>
              <p className="mt-2 text-slate-700">Total: {formatRupiah(booking.grand_total)}</p>
              <p className="mt-2 text-slate-700">Status: {booking.status}</p>
            </div>
          )}
        </div>
        <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">Butuh bantuan?</h2>
          <p className="mt-3 text-slate-700">Jika kesulitan mengecek status, hubungi admin Saliguri Harau Cottage melalui WhatsApp.</p>
          <a href="https://wa.me/6281368008800?text=Halo%20Saliguri%2C%20saya%20butuh%20bantuan%20cek%20booking." className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-[#24450f]">
            Chat Admin WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
