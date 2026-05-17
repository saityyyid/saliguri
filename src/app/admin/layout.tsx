"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types";
import { Button } from "@/components/ui/Button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""), []);
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const [sessionLoading, setSessionLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isLogin) {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          router.replace("/admin/login");
          return;
        }
        setIsAuthenticated(true);
      }).finally(() => setSessionLoading(false));
    }
  }, [isLogin, router, supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream text-slate-900">
      {sessionLoading && !isLogin ? (
        <div className="container py-20 text-center text-slate-700">Memuat admin…</div>
      ) : (
      <div className="container py-6">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase text-primary">Admin Saliguri</p>
            <h1 className="text-2xl font-semibold">Dashboard Reservasi</h1>
          </div>
          {!isLogin && (
            <div className="flex flex-wrap items-center gap-3">
              <nav className="flex flex-wrap gap-2">
                <Link className="rounded-full border border-primary px-4 py-2 text-sm text-primary hover:bg-[#eef1e3]" href="/admin">Beranda</Link>
                <Link className="rounded-full border border-primary px-4 py-2 text-sm text-primary hover:bg-[#eef1e3]" href="/admin/booking">Booking</Link>
                <Link className="rounded-full border border-primary px-4 py-2 text-sm text-primary hover:bg-[#eef1e3]" href="/admin/kalender">Kalender</Link>
                <Link className="rounded-full border border-primary px-4 py-2 text-sm text-primary hover:bg-[#eef1e3]" href="/admin/villa">Villa</Link>
                <Link className="rounded-full border border-primary px-4 py-2 text-sm text-primary hover:bg-[#eef1e3]" href="/admin/profil">Profil</Link>
              </nav>
              <Button variant="secondary" onClick={handleSignOut}>Keluar</Button>
            </div>
          )}
        </header>
        {children}
      </div>
      )}
    </div>
  );
}
