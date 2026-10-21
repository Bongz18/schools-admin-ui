"use client";

import { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";

type UserRow = {
  id: number | string;
  email?: string | null;
  created_at?: string | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, email, created_at")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to fetch users:", error);
          setUsers([]);
          return;
        }

        setUsers((data || []) as UserRow[]);
      } catch (error) {
        console.error("Unexpected user fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">People</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Users</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={String(user.id)} className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-800">#{String(user.id)}</td>
                  <td className="px-4 py-3 text-slate-700">{user.email || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}










































































































































































































































































