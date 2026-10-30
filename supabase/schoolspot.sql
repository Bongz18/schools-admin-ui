-- SchoolSpot Zimbabwe: public school profiles and parent enquiries.
-- Applied to the live "Zimbabwe - Schools" project. Safe to run more than once.

-- 1. Profile fields on schools -------------------------------------------------
alter table public.schools
  add column if not exists slug text,
  add column if not exists school_type text,          -- private | trust | mission | government | international
  add column if not exists city text,
  add column if not exists suburb text,
  add column if not exists province text,
  add column if not exists levels text,
  add column if not exists gender text,               -- boys | girls | coed
  add column if not exists gender_note text,
  add column if not exists boarding text,             -- day | day_boarding | boarding
  add column if not exists curriculum text[] not null default '{}',
  add column if not exists religion text,
  add column if not exists founded text,
  add column if not exists fees_text text,
  add column if not exists fee_term_min_usd numeric,
  add column if not exists fee_term_max_usd numeric,
  add column if not exists fees_source text,
  add column if not exists website text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists description text,
  add column if not exists sources text,
  add column if not exists status text not null default 'draft',
  add column if not exists verified boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

do $$ begin
  alter table public.schools add constraint schools_status_check check (status in ('draft','published'));
exception when duplicate_object then null; end $$;

create unique index if not exists schools_slug_key on public.schools (slug);

-- 2. Anyone may read PUBLISHED schools; drafts stay admin-only -----------------
grant select on public.schools to anon;
drop policy if exists "public reads published schools" on public.schools;
create policy "public reads published schools" on public.schools
  for select to anon, authenticated using (status = 'published');

-- 3. Parent enquiries -----------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete set null,
  parent_name text not null,
  email text,
  phone text,
  child_grade text,
  intake text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.enquiries enable row level security;
grant select on public.enquiries to authenticated;
grant all on public.enquiries to service_role;
drop policy if exists "admins read enquiries" on public.enquiries;
create policy "admins read enquiries" on public.enquiries
  for select to authenticated using (public.is_admin());
-- No insert policy: enquiries are submitted through the app's server route,
-- which validates them and uses the service role.
