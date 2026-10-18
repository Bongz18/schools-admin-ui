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

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
