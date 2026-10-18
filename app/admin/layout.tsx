"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import { toast } from "react-hot-toast";

export default function AdminLayoutGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
      // Redirect to public login page
      router.replace("/login");
    } catch (err) {
      console.error("Unexpected sign out error:", err);
      toast.error("Unexpected error during sign out");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Admin</h2>

          <div>
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
