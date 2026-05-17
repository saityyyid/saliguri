"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Booking, Villa } from "@/types";
import { formatDate, formatRupiah } from "@/lib/utils";

export function BookingsTable({ bookings, villas }: { bookings: Booking[]; villas: Villa[] }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [villaFilter, setVillaFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return bookings.filter((booking) => {
      if (statusFilter !== "all" && booking.status !== statusFilter) return false;
      if (villaFilter !== "all" && booking.villa_id.toString() !== villaFilter) return false;
      if (search && ![booking.booking_code, booking.guest_name, booking.guest_phone].some((value) => value.toLowerCase().includes(search.toLowerCase()))) return false;
      if (startDate && booking.check_in < startDate) return false;
      if (endDate && booking.check_out > endDate) return false;
      return true;
    });
  }, [bookings, endDate, search, startDate, statusFilter, villaFilter]);

  const handleStatus = async (id: string, status: string) => {
    setMessage(null);
    const response = await fetch(`/api/admin/bookings/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Gagal memperbarui status.");
      return;
    }
    setMessage(`Status booking ${status} berhasil diperbarui.`);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {message && <div className="rounded-3xl bg-primary/10 p-4 text-sm text-primary">{message}</div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2">
          <span className="text-sm text-slate-600">Status</span>
          <select className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Semua</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-600">Villa</span>
          <select className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" value={villaFilter} onChange={(event) => setVillaFilter(event.target.value)}>
            <option value="all">Semua</option>
            {villas.map((villa) => (
              <option key={villa.id} value={villa.id.toString()}>{villa.name}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-600">Tanggal Mulai</span>
          <input type="date" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-600">Tanggal Akhir</span>
          <input type="date" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </label>
      </div>
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Pencarian</p>
            <h2 className="text-2xl font-semibold text-slate-900">Daftar Booking</h2>
          </div>
          <input placeholder="Cari nama, telepon, kode" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 sm:w-80" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Villa</th>
                <th className="px-4 py-3">Check-in</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-4 font-semibold text-slate-900">{booking.booking_code}</td>
                  <td className="px-4 py-4">{booking.guest_name}</td>
                  <td className="px-4 py-4">{villas.find((villa) => villa.id === booking.villa_id)?.name ?? "-"}</td>
                  <td className="px-4 py-4">{formatDate(booking.check_in)}</td>
                  <td className="px-4 py-4">{formatRupiah(booking.grand_total)}</td>
                  <td className="px-4 py-4 capitalize">{booking.status}</td>
                  <td className="px-4 py-4 space-x-2">
                    {booking.status === "pending" && <Button variant="secondary" onClick={() => handleStatus(booking.id, "confirmed")}>Konfirmasi</Button>}
                    {booking.status !== "cancelled" && <Button variant="danger" onClick={() => handleStatus(booking.id, "cancelled")}>Batalkan</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
