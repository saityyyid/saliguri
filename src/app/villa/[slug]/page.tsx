import Link from "next/link";
import { ArrowRight, BedSingle, CalendarDays, Home, MapPin, Sparkles, Users } from "lucide-react";
import { getSupabaseAnon } from "@/lib/supabase";
import { formatRupiah, formatDate } from "@/lib/utils";
import type { Villa } from "@/types";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getVilla(slug: string) {
  const supabaseAnon = getSupabaseAnon();
  const { data, error } = await supabaseAnon
    .from("villas")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Villa;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const villa = await getVilla(params.slug);

  if (!villa) {
    return { title: "Villa tidak ditemukan" };
  }

  return {
    title: `${villa.name} — Saliguri Harau Cottage`,
    description: `Detail ${villa.name} dengan kapasitas ${villa.capacity} orang dan fasilitas lengkap di Lembah Harau.`
  };
}

export default async function VillaPage({ params }: { params: { slug: string } }) {
  const villa = await getVilla(params.slug);

  if (!villa) {
    return (
      <main className="container py-20">
        <p className="rounded-3xl bg-white p-8 text-center text-lg font-semibold text-slate-900 shadow-soft">Villa tidak ditemukan.</p>
      </main>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Saliguri Harau Cottage",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/villa/${villa.slug}`,
    description: villa.description,
    telephone: "+6281368008800",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lembah Harau",
      addressRegion: "Sumatera Barat",
      streetAddress: "Sarasah Bunta"
    }
  };

  return (
    <main className="container py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="rounded-[40px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Detail Villa</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">{villa.name}</h1>
            <p className="mt-3 max-w-2xl text-slate-700">{villa.description ?? "Villa ini siap menyambut tamu dengan kenyamanan dan fasilitas lengkap."}</p>
          </div>
          <div className="rounded-3xl bg-[#f2f7ea] p-5 text-right">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Harga</p>
            <p className="mt-3 text-3xl font-semibold text-primary">{villa.slug === "aula" ? "Harga Custom" : formatRupiah(villa.price_per_night)}{villa.slug !== "aula" ? "/malam" : ""}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#f5f9ec] p-5">
                <p className="text-sm text-slate-500">Kapasitas</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{villa.capacity} orang</p>
              </div>
              <div className="rounded-3xl bg-[#f5f9ec] p-5">
                <p className="text-sm text-slate-500">Jumlah kamar</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{villa.rooms}</p>
              </div>
              <div className="rounded-3xl bg-[#f5f9ec] p-5">
                <p className="text-sm text-slate-500">Lantai</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{villa.floors}</p>
              </div>
              <div className="rounded-3xl bg-[#f5f9ec] p-5">
                <p className="text-sm text-slate-500">Tempat tidur</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{villa.beds_description}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {villa.facilities.map((facility) => (
                <span key={facility} className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <Sparkles className="h-4 w-4 text-primary" /> {facility}
                </span>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-[#f5f9ec] p-5">
                <div className="flex items-center gap-3 text-primary">
                  <CalendarDays className="h-5 w-5" />
                  <span>Check-in 12:00 WIB</span>
                </div>
              </div>
              <div className="rounded-3xl bg-[#f5f9ec] p-5">
                <div className="flex items-center gap-3 text-primary">
                  <Users className="h-5 w-5" />
                  <span>{villa.capacity} tamu</span>
                </div>
              </div>
              <div className="rounded-3xl bg-[#f5f9ec] p-5">
                <div className="flex items-center gap-3 text-primary">
                  <MapPin className="h-5 w-5" />
                  <span>Lembah Harau</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="aspect-[4/3] rounded-[32px] bg-[#d8ead0]" />
              <div className="aspect-[4/3] rounded-[32px] bg-[#d8ead0]" />
              <div className="aspect-[4/3] rounded-[32px] bg-[#d8ead0]" />
              <div className="aspect-[4/3] rounded-[32px] bg-[#d8ead0]" />
            </div>
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 text-center shadow-soft">
              {villa.slug === "aula" ? (
                <>
                  <p className="text-lg font-semibold">Aula hanya tersedia dengan harga custom.</p>
                  <p className="mt-3 text-slate-700">Hubungi admin untuk penawaran terbaik dan ketersediaan acara.</p>
                  <Link href="https://wa.me/6281368008800?text=Halo%20Saliguri%20Harau%20Cottage%2C%20saya%20ingin%20memesan%20Aula." className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24450f]">
                    WhatsApp Admin
                  </Link>
                </>
              ) : (
                <Link href={`/booking?villa=${villa.slug}`} className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24450f]">
                  Pesan Villa Ini <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
