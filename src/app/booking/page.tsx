import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import { getSupabaseAnon } from "@/lib/supabase";
import type { Villa } from "@/types";

export const dynamic = "force-dynamic";

const BookingForm = nextDynamic(
  () => import("@/components/public/BookingForm").then((mod) => mod.BookingForm),
  { suspense: true }
);

async function getVillas() {
  const supabaseAnon = getSupabaseAnon();
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
    <main className="container py-12">
      <div className="surface-card mb-10 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Booking</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Reservasi Villa Saliguri</h1>
        <p className="mt-4 max-w-2xl text-slate-600">Isi data tamu, pilih tanggal, dan unggah bukti pembayaran. Admin akan mengonfirmasi via WhatsApp setelah menerima reservasi Anda.</p>
      </div>
      <Suspense fallback={<div className="surface-card p-8 text-center">Loading form...</div>}>
        <BookingForm villas={villas} />
      </Suspense>
    </main>
  );
}
