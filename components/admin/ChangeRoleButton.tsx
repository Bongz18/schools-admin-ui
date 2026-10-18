"use client";

import { useRouter } from "next/navigation";

export function ChangeRoleButton({
  id,
  currentRole,
}: {
  id: string;
  currentRole: string;
}) {
  const router = useRouter();

  async function toggleRole() {
    const newRole = currentRole === "admin" ? "user" : "admin";

    const res = await fetch(`http://127.0.0.1:3001/admin/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (!res.ok) {
      alert("Failed to update role");
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={toggleRole}
      className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
    >
      {currentRole === "admin" ? "Make User" : "Make Admin"}
    </button>
  );
}