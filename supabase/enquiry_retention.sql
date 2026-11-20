-- SchoolSpot Zimbabwe: privacy safeguards for parent enquiries.
-- Applied to the live "Zimbabwe - Schools" project. Safe to run more than once.
--
-- 1. consent_at records when the parent ticked "I agree that SchoolSpot can store my details
--    and pass them to the school" (required by /api/enquiries).
-- 2. Enquiries are deleted automatically 12 months after they are sent, as the Privacy Policy
--    (/privacy) promises. The job runs every day at 02:15 UTC.

alter table public.enquiries add column if not exists consent_at timestamptz;

create extension if not exists pg_cron;

select cron.unschedule(jobid) from cron.job where jobname = 'delete-old-enquiries';
select cron.schedule(
  'delete-old-enquiries',
  '15 2 * * *',
  $$delete from public.enquiries where created_at < now() - interval '12 months'$$
);
