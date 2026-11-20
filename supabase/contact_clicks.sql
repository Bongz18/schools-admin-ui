-- SchoolSpot Zimbabwe: anonymous "Contact the school" click counts (20 Nov 2026).
-- Applied to the live "Zimbabwe - Schools" project. Safe to run more than once.
-- Parents now contact schools directly; we only count clicks on the Email, Call and Website
-- buttons (no personal data). school_stats() gains a "contacts" column; "enquiries" is kept
-- for the old enquiries table, which is no longer written to.

alter table public.school_events drop constraint if exists school_events_event_type_check;
alter table public.school_events add constraint school_events_event_type_check
  check (event_type = any (array['view','compare_add','contact_email','contact_phone','contact_website']));

drop function if exists public.school_stats(integer);
create function public.school_stats(days integer default 30)
returns table (school_id uuid, views bigint, compare_adds bigint, contacts bigint, enquiries bigint)
language plpgsql stable security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  return query
  select s.id,
    (select count(*) from public.school_events e where e.school_id = s.id and e.event_type = 'view' and e.created_at >= now() - make_interval(days => days)),
    (select count(*) from public.school_events e where e.school_id = s.id and e.event_type = 'compare_add' and e.created_at >= now() - make_interval(days => days)),
    (select count(*) from public.school_events e where e.school_id = s.id and e.event_type like 'contact\_%' and e.created_at >= now() - make_interval(days => days)),
    (select count(*) from public.enquiries q where q.school_id = s.id and q.created_at >= now() - make_interval(days => days))
  from public.schools s;
end;
$$;
revoke all on function public.school_stats(integer) from public;
grant execute on function public.school_stats(integer) to authenticated;
