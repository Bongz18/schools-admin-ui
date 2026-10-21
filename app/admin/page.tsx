import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <nav className="mb-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">School Admin</div>
          <div className="flex gap-3">
            <Link
              href="/admin/login"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
            >
              Admin login
            </Link>
            <Link
              href="/admin"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Open dashboard
            </Link>
          </div>
        </nav>

        <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-sky-200 bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
              AI-assisted school operations
            </p>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
              Manage schools, applications, and admin work from one place.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">
              This web app gives school admins an operational dashboard with fast access to records,
              application review workflows, and AI-powered summaries that help teams act faster.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/admin/login"
                className="rounded-md bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
              >
                Get started
              </Link>
              <Link
                href="/admin/applications"
                className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                View applications
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Operations snapshot</span>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                Live-ready
              </span>
            </div>

            <div className="space-y-4">
              {[
                ["Schools", "12"],
                ["Applications", "84"],
                ["Pending review", "9"],
                ["AI actions", "24"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span className="text-sm text-slate-600">{label}</span>
                  <span className="text-xl font-semibold text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
