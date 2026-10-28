# Schools Admin

Admissions dashboard for school staff: manage applications, schools and users,
get an AI summary of an application, and keep an audit log of every change.

Built with Next.js, Supabase (database + sign-in) and, optionally, OpenAI.

## 1. Set up the database (Supabase)

1. Create a project at [supabase.com](https://supabase.com) if you don't have one.
2. The app expects these tables: `schools`, `applications`, `users`, `audit_logs`
   (see `docs/agent-mvp-roadmap.md` for the fields).
3. Open **SQL Editor**, paste in [`supabase/rls.sql`](supabase/rls.sql) and run it.
   This turns on the access rules that stop the public from reading your data.
4. Make yourself an admin. In the SQL Editor run (with your email):

   ```sql
   update public.users set role = 'admin' where lower(email) = lower('you@example.com');
   ```

   Your sign-in account (Authentication -> Users) must use the same email as
   your row in the `users` table.

## 2. Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000/login and sign in.

## 3. Put it online (Vercel)

1. Sign in at [vercel.com](https://vercel.com) with GitHub and import this repository.
2. Under **Environment Variables**, add the same values as in `.env.local`.
3. Deploy. Then, in Supabase -> Authentication -> URL Configuration, add your
   Vercel address as the Site URL so password-reset emails link to the right place.

## How access works

- Only users whose `users.role` is `admin` can open `/admin`. This is checked on
  the server, and enforced again by the database rules.
- The browser can only **read** data. Status changes go through
  `/api/admin/applications/[id]/status`, which checks the admin role and writes
  an audit log entry.
- The AI review only suggests a status. A person confirms every change, and the
  parent's email is never sent to the AI provider.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses all database rules. Keep it secret and
  only ever use it in server code (`lib/adminAuth.ts`).
