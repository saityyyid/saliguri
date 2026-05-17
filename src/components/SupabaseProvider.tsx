"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createBrowserSupabase());

  return <>{children}</>;
}
