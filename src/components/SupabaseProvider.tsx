"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types";

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    )
  );

  return <>{children}</>;
}
