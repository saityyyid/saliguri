import Link from "next/link";
import { MapPin, Wifi, Bed, Home } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import type { Villa } from "@/types";

export function VillaCard({ villa }: { villa: Villa }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div className="h-52 bg-[#dce8d2] p-4">
        <div className="flex h-full items-end justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-32 w-48 rounded-3xl bg-[#aed798]" />
          </div>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">{villa.capacity} orang</span>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Villa</p>
          <h2 className="text-xl font-semibold text-slate-900">{villa.name}</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">{villa.floors} lantai</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">{villa.rooms} kamar</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">{villa.beds_description}</span>
        </div>
        <p className="text-base font-semibold text-primary">{formatRupiah(villa.price_per_night)}/malam</p>
        <div className="grid gap-2 text-sm text-slate-700">
          {villa.facilities.slice(0, 4).map((feature) => (
            <span key={feature} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
              <Home className="h-3.5 w-3.5" /> {feature}
            </span>
          ))}
        </div>
        <Link href={`/villa/${villa.slug}`} className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#24450f]">
          Lihat Villa
        </Link>
      </div>
    </article>
  );
}
