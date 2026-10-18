"use client";

import { useRouter } from "next/navigation";

export function DeleteUserButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    const res = await fetch(`http://127.0.0.1:3001/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
      },
    });

    if (!res.ok) {
      alert("Failed to delete user");
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="px-2 py-1 text-sm bg-red-600 text-white rounded"
    >
      Delete
    </button>
  );
}