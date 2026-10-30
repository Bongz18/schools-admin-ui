"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

// Landing page for the link in a "reset your password" email.
// Supabase signs the user in from the link; this page lets them choose a new password.
export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) {
        setReady(true);
      }
    });

    // The session may already be set by the time this runs.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    // If no session appears, the link was expired, already used, or opened in another browser.
    const timer = setTimeout(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) setLinkInvalid(true);
      });
    }, 4000);

    return () => {
      clearTimeout(timer);
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 12) {
      toast.error("Use at least 12 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("The two passwords don't match");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      toast.error(error.message || "Could not update password");
      return;
    }

    toast.success("Password updated");
    router.replace("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6">Choose a new password</h1>

        {linkInvalid && !ready ? (
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              This reset link has expired or was already used. Links only work once, in the same
              browser you open them in.
            </p>
            <a href="/login" className="text-blue-600 hover:underline">
              Back to sign in to request a new link
            </a>
          </div>
        ) : !ready ? (
          <p className="text-sm text-gray-600">Checking your reset link...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                New password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={12}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500">At least 12 characters, with letters and numbers.</p>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium mb-1">
                Confirm new password
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save new password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
