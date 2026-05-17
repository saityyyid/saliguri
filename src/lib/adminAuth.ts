import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types";

export async function verifyAdminSession() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!supabaseUrl || !supabaseKey) return null;
  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, { cookies: cookies as any });
  const { data } = await supabase.auth.getSession();

  if (!data.session?.user?.email || data.session.user.email !== process.env.ADMIN_EMAIL) {
    return null;
  }

  return data.session;
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key) return ({} as any);
  return createClient<Database>(url, key);
}
