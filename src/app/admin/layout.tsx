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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {sessionLoading && !isLogin ? (
        <div className="container py-20 text-center text-slate-700">Memuat admin…</div>
      ) : (
      <div className="container py-6">
        <header className="mb-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Admin Saliguri</p>
              <h1 className="text-3xl font-semibold text-slate-900">Dashboard Reservasi</h1>
            </div>
            {!isLogin && (
              <div className="flex flex-wrap items-center gap-3">
                <nav className="flex flex-wrap gap-2">
                  <Link className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-900 hover:bg-slate-200" href="/admin">Beranda</Link>
                  <Link className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-900 hover:bg-slate-200" href="/admin/booking">Booking</Link>
                  <Link className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-900 hover:bg-slate-200" href="/admin/kalender">Kalender</Link>
                  <Link className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-900 hover:bg-slate-200" href="/admin/villa">Villa</Link>
                  <Link className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-900 hover:bg-slate-200" href="/admin/profil">Profil</Link>
                </nav>
                <Button variant="secondary" onClick={handleSignOut}>Keluar</Button>
              </div>
            )}
          </div>
        </header>
        {children}
      </div>
      )}
    </div>
  );
}
