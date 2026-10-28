-- Database access rules (Row Level Security) for the Schools Admin app.
-- Written for the "Zimbabwe - Schools" Supabase project.
--
-- WHY: the browser talks to Supabase with the public "anon" key, which anyone
-- can see in the page source. Without these rules, anyone could read and
-- change every parent's email and every application straight from the database.
--
-- WHAT IT DOES:
--   * adds a `role` column to public.users ('user' by default)
--   * lets signed-in admins READ schools, applications, users and audit logs
--   * blocks all browser writes to those tables; changes go through the app's
--     server routes, which check the admin role and write an audit log entry
--   * makes new applications start as 'submitted' (the statuses the app uses)
--   * locks down the older, empty Prisma tables ("User", "Applications",
--     "Program", "Review", _prisma_migrations). A Prisma backend connects as
--     the database owner, which RLS does not restrict, so it keeps working.
--     "School" keeps its public read access for the parent comparison site.
--
-- HOW TO RUN: Supabase dashboard -> SQL Editor -> paste this file -> Run.
-- Safe to run more than once.

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

-- 2. Application statuses used by the app -------------------------------------
alter table public.applications alter column status set default 'submitted';

-- 3. Turn on RLS for the app's tables -----------------------------------------
alter table public.schools      enable row level security;
alter table public.applications enable row level security;
alter table public.users        enable row level security;
alter table public.audit_logs   enable row level security;

-- 4. Read access for admins only ----------------------------------------------
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

-- 5. Older Prisma tables (empty) ----------------------------------------------
-- "User" holds password and reset-token columns, so it must never be public.
drop policy if exists "Allow read for all"    on public."User";
drop policy if exists "Allow anon read User"  on public."User";
drop policy if exists "Allow read for all"    on public."Applications";
alter table public."Program"           enable row level security;
alter table public."Review"            enable row level security;
alter table public."_prisma_migrations" enable row level security;

-- 6. Make an admin (edit the email, then run) ---------------------------------
-- insert into public.users (email, full_name, role)
-- values ('you@example.com', 'Your Name', 'admin')
-- on conflict (email) do update set role = 'admin';
