"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types";

export default function AdminProfilePage() {
  const supabase = useMemo(() => createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""), []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak cocok.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage("Password berhasil diperbarui.");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      <section className="surface-card p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Profil Admin</h1>
        <p className="mt-3 text-slate-600">Ubah password akun admin untuk menjaga keamanan dashboard.</p>
      </section>
      <div className="surface-card p-8 sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Password Baru</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Konfirmasi Password</span>
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>
          {error && <div className="rounded-3xl bg-danger/10 p-4 text-sm text-danger">{error}</div>}
          {message && <div className="rounded-3xl bg-success/10 p-4 text-sm text-success">{message}</div>}
          <Button type="submit" variant="primary" disabled={loading}>{loading ? "Menyimpan…" : "Ubah Password"}</Button>
        </form>
      </div>
    </div>
  );
}
