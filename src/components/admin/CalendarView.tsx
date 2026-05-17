"use client";

import { useMemo, useState } from "react";
import { addDays, endOfMonth, format, isBefore, isSameDay, isToday, startOfMonth, startOfWeek } from "date-fns";
import { Button } from "@/components/ui/Button";
import type { Villa, Booking, BlockedDate } from "@/types";

export function CalendarView({ villas, bookings, blockedDates }: { villas: Villa[]; bookings: Booking[]; blockedDates: BlockedDate[] }) {
  const [selectedVillaId, setSelectedVillaId] = useState<number>(villas[0]?.id ?? 0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const villaBookings = bookings.filter((booking) => booking.villa_id === selectedVillaId);
  const villaBlocked = blockedDates.filter((block) => block.villa_id === selectedVillaId);

  const today = new Date();
  const monthStart = startOfMonth(today);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfMonth(monthStart);
  const days = useMemo(() => {
    const result = [] as { date: Date; status: string }[];
    let current = startDate;
    while (current <= endDate || result.length < 35) {
      const dateStr = format(current, "yyyy-MM-dd");
      const booked = villaBookings.some((booking) => booking.check_in <= dateStr && booking.check_out > dateStr && booking.status !== "cancelled");
      const blocked = villaBlocked.some((block) => block.block_date === dateStr);
      const status = blocked ? "blocked" : booked ? "booked" : isBefore(current, today) ? "past" : "available";
      result.push({ date: current, status });
      current = addDays(current, 1);
    }
    return result;
  }, [startDate, endDate, today, villaBookings, villaBlocked]);

  const chosen = days.find((day) => format(day.date, "yyyy-MM-dd") === selectedDate);
  const targetBooking = chosen && villaBookings.find((booking) => booking.check_in <= selectedDate && booking.check_out > selectedDate);
  const targetBlock = chosen && villaBlocked.find((block) => block.block_date === selectedDate);

  const legend = [
    { label: "Tersedia", className: "bg-green-500/15 text-green-800" },
    { label: "Dipesan", className: "bg-red-500/15 text-red-800" },
    { label: "Blocked", className: "bg-orange-500/15 text-orange-800" },
    { label: "Lewat", className: "bg-slate-200 text-slate-700" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Kalender Villa</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{format(today, "LLLL yyyy")}</h2>
        </div>
        <label className="space-y-2">
          <span className="text-sm text-slate-600">Pilih Villa</span>
          <select className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" value={selectedVillaId} onChange={(event) => setSelectedVillaId(Number(event.target.value))}>
            {villas.map((villa) => (
              <option key={villa.id} value={villa.id}>{villa.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-7">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((label) => (
          <div key={label} className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-7">
        {days.map((day) => {
          const dateKey = format(day.date, "yyyy-MM-dd");
          return (
            <button key={dateKey} type="button" onClick={() => setSelectedDate(dateKey)} className={`min-h-[4rem] rounded-3xl border p-3 text-left transition ${day.status === "available" ? "border-green-200 bg-green-50" : day.status === "booked" ? "border-red-200 bg-red-50" : day.status === "blocked" ? "border-orange-200 bg-orange-50" : "border-slate-200 bg-slate-100"} ${isSameDay(day.date, today) ? "ring-2 ring-primary/30" : "hover:-translate-y-0.5"}`}>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                <span>{format(day.date, "d")}</span>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-slate-500">{day.status}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Detail Tanggal</h3>
          {chosen ? (
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <p>Tanggal: <span className="font-semibold text-slate-900">{format(chosen.date, "dd MMMM yyyy")}</span></p>
              <p>Status: <span className="font-semibold text-slate-900 capitalize">{chosen.status}</span></p>
              {targetBooking && (
                <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-900">
                  <p className="font-semibold">Booking aktif</p>
                  <p>Kode: {targetBooking.booking_code}</p>
                  <p>Nama: {targetBooking.guest_name}</p>
                </div>
              )}
              {targetBlock && (
                <div className="rounded-3xl bg-orange-50 p-4 text-sm text-orange-900">
                  <p className="font-semibold">Tanggal diblokir</p>
                  <p>Alasan: {targetBlock.reason ?? "-"}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <Button variant={chosen.status === "blocked" ? "secondary" : "ghost"} onClick={async () => {
                  setMessage("Memproses …");
                  const response = await fetch("/api/admin/blocked-dates", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ villa_id: selectedVillaId.toString(), block_date: selectedDate, reason: "Maintenance", action: chosen.status === "blocked" ? "unblock" : "block" })
                  });
                  setMessage((await response.json()).error || (chosen.status === "blocked" ? "Tanggal berhasil dibuka." : "Tanggal berhasil diblokir."));
                }}>{chosen.status === "blocked" ? "Buka tanggal" : "Blokir tanggal"}</Button>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">Pilih tanggal untuk melihat detail.</p>
          )}
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Legenda</h3>
          <div className="mt-4 grid gap-3">
            {legend.map((item) => (
              <div key={item.label} className={`rounded-3xl px-4 py-3 text-sm ${item.className}`}>{item.label}</div>
            ))}
          </div>
          {message && <p className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{message}</p>}
        </div>
      </div>
    </div>
  );
}
