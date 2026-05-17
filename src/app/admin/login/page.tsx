"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const supabase = useMemo(() => createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""), []);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
  };

  return (
    <main className="container py-16">
      <div className="mx-auto max-w-xl rounded-[40px] border border-slate-200 bg-white p-10 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Admin Login</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Masuk ke Dashboard</h1>
        <p className="mt-2 text-slate-700">Gunakan email admin untuk mengelola booking dan villa.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>
          {error && <p className="rounded-3xl bg-danger/10 p-4 text-sm text-danger">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading}>{loading ? "Memproses…" : "Masuk"}</Button>
        </form>
      </div>
    </main>
  );
}
