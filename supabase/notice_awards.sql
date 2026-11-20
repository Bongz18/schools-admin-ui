-- SchoolSpot Zimbabwe: a time-limited notice (e.g. "Lower Sixth 2027 applications close
-- 30 November") and an awards list on school profiles.
-- Applied to the live "Zimbabwe - Schools" project. Safe to run more than once.
--
-- notice: { "label": "Now enrolling", "title": "Lower Sixth 2027", "body": "...",
--           "closes_on": "2026-11-30", "link_url": "https://...", "link_label": "..." }
--   The profile stops showing it automatically after closes_on (Harare time).
-- awards: [ { "count": 7, "title": "Cambridge Learner Excellence Awards", "year": "2025", "note": "..." } ]
--   Only awards the school has confirmed.

alter table public.schools add column if not exists notice jsonb;
alter table public.schools add column if not exists awards jsonb not null default '[]'::jsonb;
