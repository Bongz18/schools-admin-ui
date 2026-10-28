import { createClient } from "@supabase/supabase-js";

// Browser-safe Supabase client. Uses the public anon key only, so what it can
// read and write is decided by the Row Level Security policies in
// supabase/rls.sql. Placeholders keep `next build` from failing when the env
// vars are not set yet; requests will simply fail until they are.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
