"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import { toast } from "react-hot-toast";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/schools", label: "Schools" },
];

export default function AdminLayoutGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session check failed:", error);
      }

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      setChecking(false);
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error(error.message || "Failed to sign out");
        return;
      }

      toast.success("Signed out");
      router.replace("/admin/login");
    } catch (err) {
      console.error("Unexpected sign out error:", err);
      toast.error("Unexpected error during sign out");
    }
  };

  const currentNav = useMemo(
    () => navItems.find((item) => item.href === pathname) || navItems[0],
    [pathname]
  );

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-600">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              School Admin
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{currentNav.label}</h2>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden gap-2 md:flex">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => router.push(item.href)}
                    className={[
                      "rounded-md px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
