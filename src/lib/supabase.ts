import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function ensureSupabaseAnonEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local or your deployment environment."
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

function createAnonClient(): SupabaseClient<Database> {
  const env = ensureSupabaseAnonEnv();
  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
}

export function getSupabaseAnon(): SupabaseClient<Database> {
  return createAnonClient();
}

export const createBrowserSupabase = () => {
  const env = ensureSupabaseAnonEnv();
  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
};
