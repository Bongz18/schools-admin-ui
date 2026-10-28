import Link from "next/link";

// Placeholder home page. The public school comparison pages for parents will live here.
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <main className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Schools Admin</h1>
        <p className="mt-3 text-slate-600">
          The school comparison site for parents is coming soon.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Staff sign in
        </Link>
      </main>
    </div>
  );
}
