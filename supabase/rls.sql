-- Database access rules (Row Level Security) for the Schools Admin app.
--
-- WHY: the browser talks to Supabase with the public "anon" key, which anyone
-- can see in the page source. Without these rules, anyone could read every
-- parent's email and every application straight from the database.
--
-- WHAT IT DOES:
--   * adds a `role` column to public.users ('user' by default)
--   * lets signed-in admins READ schools, applications, users and audit logs
--   * blocks all browser writes; changes go through the app's server routes,
--     which check the admin role and write an audit log entry
--
-- HOW TO RUN: Supabase dashboard -> SQL Editor -> paste this file -> Run.
-- Safe to run more than once. Check it against your tables first if other
-- apps or sign-up flows also write to these tables from the browser.

-- 1. Admin role ---------------------------------------------------------------
alter table public.users add column if not exists role text not null default 'user';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- 2. Turn on RLS --------------------------------------------------------------
alter table public.schools      enable row level security;
alter table public.applications enable row level security;
alter table public.users        enable row level security;
alter table public.audit_logs   enable row level security;

-- 3. Read access for admins only ----------------------------------------------
drop policy if exists "admins read schools" on public.schools;
create policy "admins read schools" on public.schools
  for select to authenticated using (public.is_admin());

drop policy if exists "admins read applications" on public.applications;
create policy "admins read applications" on public.applications
  for select to authenticated using (public.is_admin());

drop policy if exists "admins read users" on public.users;
create policy "admins read users" on public.users
  for select to authenticated using (public.is_admin());

drop policy if exists "admins read audit logs" on public.audit_logs;
create policy "admins read audit logs" on public.audit_logs
  for select to authenticated using (public.is_admin());

-- No insert/update/delete policies: the browser cannot change data directly.
-- The server routes use the service role key, which RLS does not restrict.
--
-- Later, when the public comparison site is built, add a policy like:
--   create policy "public reads published schools" on public.schools
--     for select to anon, authenticated using (status = 'published');

-- 4. Make yourself an admin (edit the email, then run) ------------------------
-- update public.users set role = 'admin' where lower(email) = lower('you@example.com');
