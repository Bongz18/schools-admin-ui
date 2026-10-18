"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import { toast } from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Login failed");
        setLoading(false);
        return;
      }

      // Successful sign-in
      toast.success("Signed in successfully");
      // Redirect to admin root
      router.push("/admin");
    } catch (err) {
      console.error("Unexpected login error:", err);
      toast.error("Unexpected error during sign-in");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">Admin Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          This is an admin-only page — make sure your Supabase users have the correct role and
          your RLS policies allow admins to sign in.
        </p>
      </div>
    </div>
  );
}
