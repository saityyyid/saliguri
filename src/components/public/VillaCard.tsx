import Link from "next/link";
import { MapPin, Wifi, Bed, Home } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import type { Villa } from "@/types";

export function VillaCard({ villa }: { villa: Villa }) {
  return (
    <article className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden bg-slate-100">
        <div className="aspect-[4/3] bg-[radial-gradient(circle_at_top_left,_rgba(45,80,22,0.16),_transparent_40%),_linear-gradient(180deg,_#edf5e5_0%,_#f8faf6_100%)]" />
        <span className="absolute top-4 right-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
          {villa.capacity} orang
        </span>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Villa</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{villa.name}</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">{villa.floors} lantai</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">{villa.rooms} kamar</span>
        </div>
        <p className="text-base font-semibold text-primary">{formatRupiah(villa.price_per_night)}/malam</p>
        <div className="grid gap-2 text-sm text-slate-700">
          {villa.facilities.slice(0, 4).map((feature) => (
            <span key={feature} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
              <Home className="h-3.5 w-3.5" /> {feature}
            </span>
          ))}
        </div>
        <Link href={`/villa/${villa.slug}`} className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#27480f]">
          Lihat Villa
        </Link>
      </div>
    </article>
  );
}
