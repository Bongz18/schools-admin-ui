"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "@/utils/supabaseClient";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    schools: 0,
    users: 0,
    applications: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [schoolsRes, usersRes, applicationsRes] = await Promise.all([
          supabase.from("schools").select("id", { count: "exact", head: true }),
          supabase.from("users").select("id", { count: "exact", head: true }),
          supabase.from("applications").select("id", { count: "exact", head: true }),
        ]);

        const schoolsCount = schoolsRes.count ?? 0;
        const usersCount = usersRes.count ?? 0;
        const applicationsCount = applicationsRes.count ?? 0;

        const pendingRes = await supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .eq("status", "submitted");

        setStats({
          schools: schoolsCount,
          users: usersCount,
          applications: applicationsCount,
          pending: pendingRes.count ?? 0,
        });
      } catch (error) {
        console.error("Unable to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const cards = [
    { label: "Schools", value: stats.schools, href: "/admin/schools", accent: "sky" },
    { label: "Users", value: stats.users, href: "/admin/users", accent: "violet" },
    { label: "Applications", value: stats.applications, href: "/admin/applications", accent: "emerald" },
    { label: "Pending review", value: stats.pending, href: "/admin/applications", accent: "amber" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Operations overview</h1>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{card.label}</span>
                <span
                  className={[
                    "h-3 w-3 rounded-full",
                    card.accent === "sky" && "bg-sky-500",
                    card.accent === "violet" && "bg-violet-500",
                    card.accent === "emerald" && "bg-emerald-500",
                    card.accent === "amber" && "bg-amber-500",
                  ].join(" ")}
                />
              </div>
              <div className="mt-6 text-3xl font-bold text-slate-900">{card.value}</div>
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recommended workflow</h2>
          <div className="mt-5 space-y-4">
            {[
              "Review any newly submitted applications.",
              "Use AI summaries to catch missing documents and unusual cases.",
              "Approve recommended status updates before finalizing decisions.",
            ].map((item, index) => (
              <div key={item} className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                  {index + 1}
                </div>
                <p className="text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/admin/applications"
              className="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Open applications
            </Link>
            <Link
              href="/admin/users"
              className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:border-slate-400"
            >
              Manage users
            </Link>
            <Link
              href="/admin/schools"
              className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:border-slate-400"
            >
              Manage schools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
