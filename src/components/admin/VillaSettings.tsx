"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Villa } from "@/types";

export function VillaSettings({ villas }: { villas: Villa[] }) {
  const [items, setItems] = useState(villas);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (id: number, field: string, value: string | number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleSave = async (villa: Villa) => {
    setSaving(true);
    setMessage(null);
    const response = await fetch(`/api/admin/villas/${villa.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price_per_night: villa.price_per_night, status: villa.status, sort_order: villa.sort_order })
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setMessage(data.error || "Gagal menyimpan.");
      return;
    }
    setMessage(`Villa ${villa.name} berhasil diperbarui.`);
  };

  return (
    <div className="space-y-6">
      {message && <div className="rounded-3xl bg-primary/10 p-4 text-sm text-primary">{message}</div>}
      <div className="grid gap-4">
        {items.map((villa) => (
          <div key={villa.id} className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">{villa.name}</p>
                <p className="text-sm text-slate-600">Kapasitas {villa.capacity} orang</p>
              </div>
              <Button variant="secondary" onClick={() => handleSave(villa)} disabled={saving}>{saving ? "Menyimpan…" : "Simpan"}</Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm text-slate-600">Harga / malam</span>
                <input type="number" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" value={villa.price_per_night} onChange={(event) => handleChange(villa.id, "price_per_night", Number(event.target.value))} />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-slate-600">Status</span>
                <select className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" value={villa.status} onChange={(event) => handleChange(villa.id, "status", event.target.value)}>
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm text-slate-600">Urutan</span>
                <input type="number" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" value={villa.sort_order} onChange={(event) => handleChange(villa.id, "sort_order", Number(event.target.value))} />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
