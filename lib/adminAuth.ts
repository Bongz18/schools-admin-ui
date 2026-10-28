import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

// SERVER ONLY. Never import this file from a "use client" component: it uses
// the service role key, which bypasses all database security.

export type AdminCheck =
  | { ok: true; email: string; userId: string; supabase: SupabaseClient }
  | { ok: false; status: number; error: string };

export function getServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Verifies the caller's Supabase access token (sent as `Authorization: Bearer <token>`)
 * and checks that their row in the `users` table has role = 'admin'. This is the same
 * rule the database uses (public.is_admin() in supabase/rls.sql), so the two always agree.
 */
export async function requireAdmin(request: NextRequest): Promise<AdminCheck> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";

  if (!token) {
    return { ok: false, status: 401, error: "Not signed in" };
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return { ok: false, status: 500, error: "Server is missing Supabase configuration" };
  }

  const { data, error } = await supabase.auth.getUser(token);
  const email = data.user?.email?.toLowerCase();

  if (error || !data.user || !email) {
    return { ok: false, status: 401, error: "Session is invalid or expired" };
  }

  // Escape LIKE wildcards so the match is exact but case-insensitive.
  const pattern = email.replace(/[\\%_]/g, (char) => `\\${char}`);
  const { data: row, error: roleError } = await supabase
    .from("users")
    .select("role")
    .ilike("email", pattern)
    .limit(1)
    .maybeSingle();

  if (roleError) {
    console.error("Admin role lookup failed:", roleError.message);
    return { ok: false, status: 500, error: "Could not check admin role" };
  }

  if (row?.role !== "admin") {
    return { ok: false, status: 403, error: "Admin access only" };
  }

  return { ok: true, email, userId: data.user.id, supabase };
}

export async function writeAuditLog(
  supabase: SupabaseClient,
  entry: {
    event: string;
    entityType: string;
    entityId: string | number;
    actor: string;
    details?: Record<string, unknown>;
  },
) {
  const { error } = await supabase.from("audit_logs").insert({
    entity_type: entry.entityType,
    entity_id: String(entry.entityId),
    event: entry.event,
    actor: entry.actor,
    details: entry.details ? JSON.stringify(entry.details) : null,
  });

  if (error) {
    console.error("Audit log insert failed:", error.message);
  }

  return !error;
}
