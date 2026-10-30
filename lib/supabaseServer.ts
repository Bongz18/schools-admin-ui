import { createClient } from "@supabase/supabase-js";

// Read-only Supabase client for public pages rendered on the server.
// Uses the public anon key, so database rules limit it to PUBLISHED schools.
export function publicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
