"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Supabase returns an error object with message
        toast.error(error.message ?? "Sign-in failed");
        setLoading(false);
        return;
      }

      // Successful sign in
      toast.success("Signed in successfully");

      // Redirect to admin schools
      router.push("/admin/applications");
    } catch (err) {
      console.error("Unexpected sign-in error:", err);
      toast.error("Unexpected error during sign-in");
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email above to reset your password");
      return;
    }

    setResetLoading(true);

    try {
      // supabase.auth.resetPasswordForEmail takes (email, options?)
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

      if (error) {
        console.error("Reset password error:", error);
        toast.error(error.message ?? "Failed to send password reset email");
        setResetLoading(false);
        return;
      }

      toast.success("Password reset email sent. Check your inbox.");
    } catch (err) {
      console.error("Unexpected reset password error:", err);
      toast.error("Unexpected error while requesting password reset");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6">Admin Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={resetLoading}
            className="text-sm text-blue-600 hover:underline"
          >
            {resetLoading ? "Sending…" : "Forgot password?"}
          </button>

          <p className="text-xs text-gray-500">
            Admin access only. If you don't have access, ask an administrator to assign the admin role.
          </p>
        </div>
      </div>
    </div>
  );
}
