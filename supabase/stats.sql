-- SchoolSpot stats: profile views and compare adds per school, plus enquiries.
-- Applied to the live project. Events are written only by the app's server (service role);
-- only admins can read the totals, through school_stats().

create table if not exists public.school_events (
  id bigint generated always as identity primary key,
  school_id uuid not null references public.schools(id) on delete cascade,
  event_type text not null check (event_type in ('view','compare_add')),
  created_at timestamptz not null default now()
);
create index if not exists school_events_school_time_idx on public.school_events (school_id, created_at);
alter table public.school_events enable row level security;
grant all on public.school_events to service_role;
grant usage, select on sequence public.school_events_id_seq to service_role;

create or replace function public.school_stats(days integer default 30)
returns table (school_id uuid, views bigint, compare_adds bigint, enquiries bigint)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;
  return query
  select s.id,
    (select count(*) from public.school_events e where e.school_id = s.id and e.event_type = 'view'
       and e.created_at >= now() - make_interval(days => days)),
    (select count(*) from public.school_events e where e.school_id = s.id and e.event_type = 'compare_add'
       and e.created_at >= now() - make_interval(days => days)),
    (select count(*) from public.enquiries q where q.school_id = s.id
       and q.created_at >= now() - make_interval(days => days))
  from public.schools s;
end;
$$;
revoke all on function public.school_stats(integer) from public;
grant execute on function public.school_stats(integer) to authenticated;
