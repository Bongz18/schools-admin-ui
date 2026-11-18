-- SchoolSpot Zimbabwe: private preview links for schools.
-- Applied to the live "Zimbabwe - Schools" project. Safe to run more than once.
--
-- Every school gets a secret token. The link /preview/<token> shows the school's
-- profile (draft or live) so the school can check it before we publish, without
-- logging in. Tokens live in their own table so the public API can never read them.

create table if not exists public.school_previews (
  school_id uuid primary key references public.schools(id) on delete cascade,
  token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.school_previews enable row level security;
grant select on public.school_previews to authenticated;
grant all on public.school_previews to service_role;

drop policy if exists "admins read preview links" on public.school_previews;
create policy "admins read preview links" on public.school_previews
  for select to authenticated using (public.is_admin());
-- No other policies: the preview page reads tokens with the service role.

-- A link for every existing school, and automatically for every new one.
insert into public.school_previews (school_id)
select id from public.schools
on conflict (school_id) do nothing;

create or replace function public.create_school_preview()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.school_previews (school_id) values (new.id)
  on conflict (school_id) do nothing;
  return new;
end;
$$;

revoke all on function public.create_school_preview() from public, anon, authenticated;

drop trigger if exists schools_create_preview on public.schools;
create trigger schools_create_preview
  after insert on public.schools
  for each row execute function public.create_school_preview();

-- To replace a school's link (e.g. it was shared with the wrong person):
-- update public.school_previews set token = gen_random_uuid() where school_id = '<school id>';
