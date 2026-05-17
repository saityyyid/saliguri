import dynamic from "next/dynamic";
import { Suspense } from "react";
import { supabaseAnon } from "@/lib/supabase";
import type { Villa } from "@/types";

const BookingForm = dynamic(
  () => import("@/components/public/BookingForm").then((mod) => mod.BookingForm),
  { suspense: true }
);

async function getVillas() {
  const { data, error } = await supabaseAnon
    .from("villas")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }
  return data as Villa[];
}

export default async function BookingPage() {
  const villas = await getVillas();

  return (
    <main className="container py-10">
      <div className="mb-8 rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Booking</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Reservasi Villa Saliguri</h1>
        <p className="mt-3 max-w-2xl text-slate-700">Isi data tamu, pilih tanggal, dan unggah bukti pembayaran DP. Admin akan menghubungi Anda via WhatsApp untuk konfirmasi.</p>
      </div>
      <Suspense fallback={<div className="rounded-[40px] border border-slate-200 bg-white p-8 text-center shadow-soft">Loading form...</div>}>
        <BookingForm villas={villas} />
      </Suspense>
    </main>
  );
}
