-- SchoolSpot Zimbabwe: how a school takes Form One boarding applications.
-- Applied to the live "Zimbabwe - Schools" project. Safe to run more than once.
--
-- emap_form1: 'yes' = Form One boarders apply through the Ministry's eMAP portal,
--             'no'  = parents apply directly to the school,
--             null  = not known yet (nothing is shown on the profile).
-- Public read access comes from the existing table-level grant on public.schools.

alter table public.schools
  add column if not exists emap_form1 text;

alter table public.schools drop constraint if exists schools_emap_form1_check;
alter table public.schools
  add constraint schools_emap_form1_check check (emap_form1 is null or emap_form1 in ('yes', 'no'));
