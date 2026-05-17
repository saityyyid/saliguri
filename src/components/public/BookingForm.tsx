"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { formatRupiah, getWhatsAppLink } from "@/lib/utils";
import type { Villa } from "@/types";
import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { bookingCreateSchema } from "@/lib/schema";
import { z } from "zod";

const addonCatalog = [
  { id: "prasmanan", name: "Prasmanan", price: 60000, unitLabel: "per orang" },
  { id: "bbq", name: "Barbeque", price: 60000, unitLabel: "per orang" },
  { id: "karaoke", name: "Karaoke", price: 300000, unitLabel: "per acara" },
  { id: "orgen", name: "Orgen Musik", price: 2500000, unitLabel: "per acara" },
  { id: "extrabed", name: "Extra Bed + Sarapan", price: 100000, unitLabel: "per item" },
  { id: "sarapanextra", name: "Sarapan Pagi Extra", price: 20000, unitLabel: "per orang" }
];

const formSchema = bookingCreateSchema.extend({
  selected_villa_slug: z.string().optional(),
  proof_file: z.any().optional()
});

type BookingFormValues = z.infer<typeof formSchema>;

export function BookingForm({ villas }: { villas: Villa[] }) {
  const params = useSearchParams();
  const initialSlug = params.get("villa") ?? "";
  const [loading, setLoading] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Record<number, boolean>>({});
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState<string>("");

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guest_name: "",
      guest_phone: "",
      guest_email: "",
      notes: "",
      guest_count: 1,
      check_in: "",
      check_out: "",
      nights: 1,
      villa_price: 0,
      addon_total: 0,
      grand_total: 0,
      dp_amount: 0,
      addons: []
    }
  });

  const checkIn = useWatch({ control: form.control, name: "check_in" });
  const checkOut = useWatch({ control: form.control, name: "check_out" });
  const guestCount = useWatch({ control: form.control, name: "guest_count" });
  const nights = useWatch({ control: form.control, name: "nights" });
  const addons = useWatch({ control: form.control, name: "addons" });
  const selectedVillaSlug = useWatch({ control: form.control, name: "selected_villa_slug" });
  const selectedVilla = useMemo(() => villas.find((villa) => villa.slug === selectedVillaSlug), [selectedVillaSlug, villas]);

  useEffect(() => {
    if (selectedVilla) {
      form.setValue("villa_price", selectedVilla.price_per_night);
    }
  }, [selectedVilla, form]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      form.setValue("nights", nights);
    }
  }, [checkIn, checkOut, form]);

  useEffect(() => {
    const result = addons?.reduce((sum, item) => sum + item.total_price, 0) ?? 0;
    const villaPrice = selectedVilla?.price_per_night ?? 0;
    const grand = villaPrice * (nights ?? 0) + result;
    form.setValue("addon_total", result);
    form.setValue("grand_total", grand);
    form.setValue("dp_amount", Math.round(grand * 0.5));
  }, [selectedVilla, addons, nights, form]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!checkIn || !checkOut) return;
      const next = {} as Record<number, boolean>;
      await Promise.all(
        villas.map(async (villa) => {
          if (villa.slug === "aula") {
            next[villa.id] = false;
            return;
          }
          const res = await fetch(`/api/availability?villa_id=${villa.id}&start=${checkIn}&end=${checkOut}&guest_count=${guestCount}`);
          const data = await res.json();
          next[villa.id] = data.available ?? false;
        })
      );
      setAvailability(next);
    };
    fetchAvailability();
  }, [checkIn, checkOut, guestCount, villas]);

  useEffect(() => {
    if (initialSlug) {
      form.setValue("selected_villa_slug", initialSlug);
    }
  }, [initialSlug, form]);

  const availableVillas = villas.filter((villa) => (availability[villa.id] ?? true) || villa.slug === "aula");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("File terlalu besar, maksimal 2MB.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setErrorMessage(null);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok) {
      setErrorMessage(payload.error || "Gagal mengunggah file.");
      return;
    }
    setPaymentUrl(payload.url);
    setProofFileName(file.name);
    form.setValue("payment_proof_url", payload.url);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    const values = form.getValues();
    if (!selectedVilla) {
      setErrorMessage("Silakan pilih villa terlebih dahulu.");
      setLoading(false);
      return;
    }
    if (selectedVilla.slug === "aula") {
      setErrorMessage("Silakan hubungi admin untuk pemesanan Aula.");
      setLoading(false);
      return;
    }
    const payload = {
      ...values,
      villa_id: selectedVilla.id.toString(),
      guest_count: Number(values.guest_count),
      nights: Number(values.nights),
      villa_price: selectedVilla.price_per_night,
      addons: values.addons ?? []
    };
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await response.json();
    setLoading(false);
    if (!response.ok) {
      setErrorMessage(json.error || "Gagal membuat booking.");
      return;
    }
    setSuccessCode(json.booking_code);
  }

  if (successCode) {
    return (
      <div className="rounded-[40px] border border-slate-200 bg-white p-10 text-center shadow-soft">
        <h2 className="text-3xl font-semibold text-slate-900">Booking Berhasil!</h2>
        <p className="mt-4 text-slate-700">Kode booking Anda:</p>
        <p className="mt-4 rounded-3xl bg-cream px-6 py-4 text-2xl font-semibold text-primary">{successCode}</p>
        <p className="mt-4 text-slate-700">Admin akan menghubungi Anda via WhatsApp untuk konfirmasi.</p>
        <a href={getWhatsAppLink(`Halo Saliguri, saya sudah membuat booking dengan kode ${successCode}`)} className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-[#24450f]">
          Chat Admin WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-8">
        <section className="surface-card p-6">
          <h2 className="text-xl font-semibold text-slate-900">1. Pilih Tanggal & Tamu</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Check-in</span>
              <input className="form-input" type="date" value={checkIn || ""} onChange={(event) => form.setValue("check_in", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Check-out</span>
              <input className="form-input" type="date" value={checkOut || ""} onChange={(event) => form.setValue("check_out", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Jumlah Tamu</span>
              <input className="form-input" type="number" min={1} value={guestCount} onChange={(event) => form.setValue("guest_count", Number(event.target.value))} />
            </label>
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Durasi Menginap</span>
              <div className="form-input">{form.getValues("nights")} malam</div>
            </div>
          </div>
        </section>

        <section className="surface-card p-6">
          <h2 className="text-xl font-semibold text-slate-900">2. Pilih Villa</h2>
          <div className="mt-6 grid gap-4">
            {availableVillas.map((villa) => {
              const available = villa.slug === "aula" || (availability[villa.id] ?? true);
              return (
                <button
                  key={villa.id}
                  type="button"
                  onClick={() => form.setValue("selected_villa_slug", villa.slug)}
                  disabled={!available}
                  className={`rounded-3xl border p-5 text-left transition ${selectedVillaSlug === villa.slug ? "border-primary bg-primary/10" : "border-slate-200 bg-slate-50 hover:border-slate-300"} ${!available ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{villa.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{formatRupiah(villa.price_per_night)} / malam</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{villa.capacity} orang</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-700">
                    <span className="rounded-full bg-white px-3 py-1 shadow-sm">{villa.floors} lantai</span>
                    <span className="rounded-full bg-white px-3 py-1 shadow-sm">{villa.rooms} kamar</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{villa.beds_description}</p>
                  {!available && <p className="mt-3 text-sm text-slate-500">Tidak tersedia untuk tanggal atau kapasitas saat ini.</p>}
                  {villa.slug === "aula" && <p className="mt-3 text-sm text-warning">Harga Custom — Hubungi Admin</p>}
                </button>
              );
            })}
            {villas.length === 0 && <p className="text-slate-600">Sedang memuat data villa...</p>}
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">3. Tambah Add-on</h2>
          <div className="mt-6 grid gap-4">
            {addonCatalog.map((addon) => {
              const existing = form.getValues("addons")?.find((item) => item.addon_name === addon.name);
              const quantity = existing?.quantity || 0;
              return (
                <div key={addon.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{addon.name}</p>
                    <p className="text-sm text-slate-600">{formatRupiah(addon.price)} {addon.unitLabel}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => {
                      const updated = (form.getValues("addons") ?? []).filter((item) => item.addon_name !== addon.name);
                      if (quantity > 0) {
                        form.setValue("addons", updated.concat({ addon_name: addon.name, quantity: quantity - 1, price_per_unit: addon.price, total_price: addon.price * (quantity - 1) }));
                      }
                    }} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-300 text-slate-700">-</button>
                    <span className="min-w-[2rem] text-center text-sm font-semibold">{quantity}</span>
                    <button type="button" onClick={() => {
                      const filtered = (form.getValues("addons") ?? []).filter((item) => item.addon_name !== addon.name);
                      form.setValue("addons", filtered.concat({ addon_name: addon.name, quantity: quantity + 1, price_per_unit: addon.price, total_price: addon.price * (quantity + 1) }));
                    }} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">4. Detail Tamu</h2>
          <div className="mt-6 grid gap-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Nama Lengkap</span>
              <input className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" value={form.getValues("guest_name")} onChange={(event) => form.setValue("guest_name", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">WhatsApp</span>
              <input className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" value={form.getValues("guest_phone")} onChange={(event) => form.setValue("guest_phone", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Email (opsional)</span>
              <input className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" value={form.getValues("guest_email")} onChange={(event) => form.setValue("guest_email", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Catatan</span>
              <textarea className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" rows={4} value={form.getValues("notes")} onChange={(event) => form.setValue("notes", event.target.value)} />
            </label>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">5. Unggah Bukti Pembayaran</h2>
          <p className="mt-2 text-sm text-slate-600">Unggah gambar bukti DP maksimal 2MB.</p>
          <input type="file" accept="image/*" className="mt-4" onChange={handleFileChange} />
          {proofFileName && <p className="mt-3 text-sm text-slate-700">Bukti terunggah: {proofFileName}</p>}
        </section>
      </div>

      <aside className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">Ringkasan Pesanan</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-700">
            <p>Villa: <span className="font-semibold text-slate-900">{selectedVilla?.name ?? "Belum dipilih"}</span></p>
            <p>Check-in: <span className="font-semibold text-slate-900">{checkIn || "-"}</span></p>
            <p>Check-out: <span className="font-semibold text-slate-900">{checkOut || "-"}</span></p>
            <p>Durasi: <span className="font-semibold text-slate-900">{form.getValues("nights")} malam</span></p>
            <p>Jumlah tamu: <span className="font-semibold text-slate-900">{guestCount}</span></p>
          </div>
          <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="flex justify-between"><span>Harga villa</span><span>{formatRupiah(selectedVilla?.price_per_night ?? 0)}</span></p>
            <p className="flex justify-between"><span>Add-on</span><span>{formatRupiah(form.getValues("addon_total") ?? 0)}</span></p>
            <div className="mt-4 border-t border-slate-200 pt-4 font-semibold text-slate-900">
              <p className="flex justify-between"><span>Total</span><span>{formatRupiah(form.getValues("grand_total") ?? 0)}</span></p>
              <p className="mt-2 flex justify-between text-sm text-slate-600"><span>DP 50%</span><span>{formatRupiah(form.getValues("dp_amount") ?? 0)}</span></p>
            </div>
          </div>
          {selectedVilla?.slug === "aula" && (
            <div className="rounded-3xl bg-warning/10 p-4 text-sm text-slate-900">
              Harga Aula custom. Klik tombol WhatsApp untuk menghubungi admin.
            </div>
          )}
          {errorMessage && <p className="rounded-3xl bg-danger/10 p-4 text-sm text-danger">{errorMessage}</p>}
          <div className="space-y-3">
            <Button type="submit" variant="primary" disabled={loading || selectedVilla?.slug === "aula" || !checkIn || !checkOut || !proofFileName}>
              {loading ? "Mengirim…" : "Kirim Reservasi"}
            </Button>
            <a href={getWhatsAppLink("Halo Saliguri, saya ingin memesan villa.")} className="inline-flex w-full items-center justify-center rounded-full border border-primary bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-[#edf3e8]">
              Hubungi Admin via WhatsApp
            </a>
          </div>
        </div>
      </aside>
    </form>
  );
}
