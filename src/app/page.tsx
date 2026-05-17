import Link from "next/link";
import { MapPin, Star, Wifi, Coffee, Sparkles, Wind, Shield } from "lucide-react";
import { supabaseAnon } from "@/lib/supabase";
import { VillaCard } from "@/components/public/VillaCard";
import type { Villa } from "@/types";

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

  return (data ?? []) as Villa[];
}

export default async function HomePage() {
  const villas = await getVillas();

  return (
    <main className="bg-cream text-slate-900">
      <section className="container py-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Saliguri Harau Cottage
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
              Pesan villa dan aula nyaman di Lembah Harau, Sumatera Barat.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-700">
              Nikmati penginapan dekat tebing, air terjun, dan suasana alam Harau dengan sistem reservasi online yang cepat dan aman.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/booking" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#24450f]">
                Pesan Sekarang
              </Link>
              <Link href="/cek-booking" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Cek Booking
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 shadow-soft">
                <p className="text-sm text-slate-500">Alamat</p>
                <p className="mt-2 font-semibold">Sarasah Bunta - Harau, Sumatera Barat</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-soft">
                <p className="text-sm text-slate-500">Kontak</p>
                <p className="mt-2 font-semibold">WhatsApp: 0813-6800-8800</p>
              </div>
            </div>
          </div>
          <div className="rounded-[40px] border border-slate-200 bg-[#eaf2de] p-6 shadow-soft">
            <div className="aspect-[4/3] overflow-hidden rounded-[32px] bg-[#d8ead0]" />
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Jenis Villa</p>
          <h2 className="text-3xl font-semibold">Pilihan Villa Terbaik</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {villas.map((villa) => (
            <VillaCard key={villa.id} villa={villa} />
          ))}
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Fasilitas Unggulan</p>
            <h2 className="text-3xl font-semibold">Fasilitas Lengkap untuk Liburan Keluarga</h2>
            <p className="max-w-2xl text-slate-700">
              Semua villa dilengkapi AC, WiFi, air panas, dan sarapan pagi. Aula tersedia untuk acara keluarga, ulang tahun, dan rapat.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Wifi, label: "WiFi" },
                { icon: Coffee, label: "Sarapan" },
                { icon: MapPin, label: "Dekat Air Terjun" },
                { icon: Shield, label: "Parkir Aman" }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-soft">
                  <item.icon className="h-5 w-5 text-primary" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[40px] border border-slate-200 bg-white p-6 shadow-soft">
            <iframe
              title="Peta Saliguri Harau Cottage"
              className="h-96 w-full rounded-3xl border border-slate-200"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.8105955848246!2d100.67013897521998!3d-0.11274663546988793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2aad98a705f1c5%3A0x362358f90bd97e93!2sSaliguri%20Homestay%20Harau!5e0!3m2!1sen!2sid!4v1779008836296!5m2!1sen!2sid"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="rounded-[32px] bg-primary px-8 py-10 text-white shadow-soft">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold">Butuh bantuan cepat?</h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-white/90">
                Hubungi admin Saliguri melalui WhatsApp untuk rekomendasi villa dan konfirmasi ketersediaan.
              </p>
            </div>
            <Link href="https://wa.me/6281368008800?text=Halo%20Saliguri%20Harau%20Cottage%2C%20saya%20ingin%20memesan." className="inline-flex max-w-max items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-slate-100">
              Chat WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
