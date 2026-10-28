"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { adminFetch } from "@/lib/adminFetch";
import { toast } from "react-hot-toast";

const NAV_ITEMS = [
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/schools", label: "Schools" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/audit", label: "Audit log" },
];

export default function AdminLayoutGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    let cancelled = false;

    const checkAccess = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      // The server decides whether this user is an admin, not the browser.
      const response = await adminFetch("/api/admin/me");
      const result = await response.json().catch(() => ({}));

      if (cancelled) return;

      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/login");
        } else {
          if (response.status === 500) {
            toast.error(result?.error ?? "Could not check admin access");
          }
          router.replace("/unauthorized");
        }
        return;
      }

      setAdminEmail(result.email ?? "");
      setChecking(false);
    };

    checkAccess();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.replace("/login");
      }
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message || "Failed to sign out");
      return;
    }

    toast.success("Signed out");
    router.replace("/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Checking access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-6">
            <h2 className="text-lg font-semibold">Schools Admin</h2>
            <nav className="flex flex-wrap gap-1 text-sm">
              {NAV_ITEMS.map((item) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded px-3 py-1.5 ${
                      active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {adminEmail && <span className="hidden text-sm text-slate-500 sm:inline">{adminEmail}</span>}
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
