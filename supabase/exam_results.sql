-- SchoolSpot Zimbabwe: exam results on school profiles.
-- Applied to the live "Zimbabwe - Schools" project. Safe to run more than once.
--
-- One row per school, year and exam (and subject, where a school reports
-- results for single subjects, e.g. ZIMSEC History). Only figures the school
-- has supplied and approved go in here.

create table if not exists public.exam_results (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  year int not null check (year between 2000 and 2100),
  exam text not null,                 -- e.g. 'A Level', 'AS Level', 'IGCSE', 'ZIMSEC', 'Cambridge Checkpoint'
  subject text,                       -- null = whole exam; otherwise a single subject
  pass_rate numeric(5,2) check (pass_rate between 0 and 100),
  top_grade_rate numeric(5,2) check (top_grade_rate between 0 and 100),
  top_grade_label text,               -- what "top grades" means for this exam, e.g. '10 points and above'
  sort_order int not null default 0,  -- order exams appear on the profile
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists exam_results_unique
  on public.exam_results (school_id, year, exam, coalesce(subject, ''));
create index if not exists exam_results_school_idx on public.exam_results (school_id);

-- Results follow their school: public once the school is published, admins always.
alter table public.exam_results enable row level security;
grant select on public.exam_results to anon, authenticated;
grant all on public.exam_results to service_role;

drop policy if exists "public reads results of published schools" on public.exam_results;
create policy "public reads results of published schools" on public.exam_results
  for select to anon, authenticated
  using (exists (
    select 1 from public.schools s
    where s.id = exam_results.school_id and s.status = 'published'
  ));

drop policy if exists "admins read exam results" on public.exam_results;
create policy "admins read exam results" on public.exam_results
  for select to authenticated using (public.is_admin());
-- No insert/update/delete policies: changes go through the service role.
