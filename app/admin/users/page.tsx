"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Icons
import {
  SunIcon,
  MoonIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

export default function UsersPage() {
// ===============================
// STATE
// ===============================

// Theme
const [theme, setTheme] = useState("light");

// Users
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);

// Search
const [search, setSearch] = useState("");

// Sorting
const [sortField, setSortField] = useState("createdAt");
const [sortDirection, setSortDirection] = useState("desc");

// Pagination
const [page, setPage] = useState(1);
const pageSize = 10;

// Filter chips
const [statusFilter, setStatusFilter] = useState("all");

// Bulk selection
const [selectedUsers, setSelectedUsers] = useState([]);

// Slide-over (edit user)
const [editingUser, setEditingUser] = useState(null);

// Delete modal
const [deletingUser, setDeletingUser] = useState(null);

// Create modal
const [creatingUser, setCreatingUser] = useState(false);

// ===============================
// EFFECT: THEME INITIALIZATION
// ===============================
useEffect(() => {
  const saved = localStorage.getItem("theme") || "light";
  setTheme(saved);
  document.documentElement.classList.toggle("dark", saved === "dark");
}, []);

function toggleTheme() {
  const newTheme = theme === "light" ? "dark" : "light";
  setTheme(newTheme);
  document.documentElement.classList.toggle("dark", newTheme === "dark");
  localStorage.setItem("theme", newTheme);
}

// ===============================
// EFFECT: FETCH USERS
// ===============================
async function fetchUsers() {
  try {
    setLoading(true);

    const res = await fetch("http://localhost:5000/admin/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch users");

    const data = await res.json();
    setUsers(data);
  } catch (err) {
    toast.error("Failed to load users");
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  fetchUsers();
}, []);

  // ===============================
// SEARCH FILTERING
// ===============================
const filteredUsers = users.filter((u) => {
  const matchesSearch =
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(search.toLowerCase()));

  const matchesStatus =
    statusFilter === "all" ? true : u.status === statusFilter;

  return matchesSearch && matchesStatus;
});

// ===============================
// SORTING
// ===============================
const sortedUsers = [...filteredUsers].sort((a, b) => {
  const fieldA = a[sortField];
  const fieldB = b[sortField];

  if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
  if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
  return 0;
});

// ===============================
// PAGINATION
// ===============================
const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
const paginatedUsers = sortedUsers.slice(
  (page - 1) * pageSize,
  page * pageSize
);

// ===============================
// CREATE USER
// ===============================
async function createUser(e) {
  e.preventDefault();

  const form = new FormData(e.target);
  const newUser = {
    name: form.get("name"),
    email: form.get("email"),
    role: form.get("role"),
    status: form.get("status"),
  };

  try {
    const res = await fetch("http://localhost:5000/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newUser),
    });

    if (!res.ok) throw new Error();

    toast.success("User created");
    setCreatingUser(false);
    fetchUsers();
  } catch {
    toast.error("Failed to create user");
  }
}

// ===============================
// SAVE EDITED USER
// ===============================
async function saveUser(e) {
  e.preventDefault();

  const form = new FormData(e.target);
  const updated = {
    name: form.get("name"),
    email: form.get("email"),
    role: form.get("role"),
    status: form.get("status"),
  };

  try {
    const res = await fetch(
      `http://localhost:5000/admin/users/${editingUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updated),
      }
    );

    if (!res.ok) throw new Error();

    toast.success("User updated");
    setEditingUser(null);
    fetchUsers();
  } catch {
    toast.error("Failed to update user");
  }
}

// ===============================
// DELETE USER
// ===============================
async function confirmDeleteUser() {
  const ids = Array.isArray(deletingUser.id)
    ? deletingUser.id
    : [deletingUser.id];

  try {
    const res = await fetch(
      "http://localhost:5000/admin/users/bulk-delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ids }),
      }
    );

    if (!res.ok) throw new Error();

    toast.success(`Deleted ${ids.length} user(s)`);
    setDeletingUser(null);
    setSelectedUsers([]);
    fetchUsers();
  } catch {
    toast.error("Failed to delete users");
  }
}

// ===============================
// ROLE BADGE
// ===============================
function roleBadge(role) {
  const base =
    "inline-flex items-center gap-1 px-2 py-1 rounded text-white text-sm";

  if (role === "admin") {
    return (
      <span className={`${base} bg-red-600`}>
        <ShieldCheckIcon className="h-4 w-4" />
        Admin
      </span>
    );
  }

  return (
    <span className={`${base} bg-blue-600`}>
      <UserIcon className="h-4 w-4" />
      User
    </span>
  );
}

// ===============================
// SKELETON ROWS
// ===============================
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="p-3">
        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </td>
      <td className="p-3">
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </td>
      <td className="p-3">
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </td>
      <td className="p-3">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </td>
      <td className="p-3">
        <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </td>
      <td className="p-3">
        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </td>
    </tr>
  );
}

// ===============================
// FILTER CHIP
// ===============================
function FilterChip({ label, value }) {
  const active = statusFilter === value;

  return (
    <button
      onClick={() => setStatusFilter(value)}
      className={`px-3 py-1 rounded-full text-sm border transition
        ${
          active
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
        }
      `}
    >
      {label}
    </button>
  );
}

// ===============================
// SORTING HEADER
// ===============================
function SortHeader({ label, field }) {
  const active = sortField === field;

  return (
    <th
      className="p-3 cursor-pointer select-none"
      onClick={() => {
        if (active) {
          setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
          setSortField(field);
          setSortDirection("asc");
        }
      }}
    >
      <div className="flex items-center gap-1">
        {label}
        {active && (
          <span className="text-xs">
            {sortDirection === "asc" ? "▲" : "▼"}
          </span>
        )}
      </div>
    </th>
  );
}

// ===============================
// TABLE + SEARCH + FILTERS + PAGINATION
// ===============================

function UsersTable() {
  return (
    <div className="mt-6 bg-white dark:bg-gray-900 shadow rounded-lg p-6">

      {/* Top Bar: Search + Theme Toggle + Create Button */}
      <div className="flex items-center justify-between mb-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-64 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        />

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            {theme === "light" ? (
              <MoonIcon className="h-5 w-5 text-gray-800" />
            ) : (
              <SunIcon className="h-5 w-5 text-yellow-400" />
            )}
          </button>

          {/* Create User */}
          <button
            onClick={() => setCreatingUser(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Create User
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-4">
        <FilterChip label="All" value="all" />
        <FilterChip label="Active" value="active" />
        <FilterChip label="Suspended" value="suspended" />
      </div>

      {/* Bulk Delete Button */}
      {selectedUsers.length > 0 && (
        <button
          onClick={() =>
            setDeletingUser({ id: selectedUsers, bulk: true })
          }
          className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete {selectedUsers.length} Selected
        </button>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {/* Select All */}
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={
                    selectedUsers.length === paginatedUsers.length &&
                    paginatedUsers.length > 0
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(paginatedUsers.map((u) => u.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </th>

              <SortHeader label="Email" field="email" />
              <SortHeader label="Role" field="role" />
              <SortHeader label="Status" field="status" />
              <SortHeader label="Created" field="createdAt" />

              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading Skeletons */}
            {loading &&
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

            {/* Empty State */}
            {!loading && paginatedUsers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-500 dark:text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            )}

            {/* User Rows */}
            {!loading &&
              paginatedUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  {/* Row Checkbox */}
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, u.id]);
                        } else {
                          setSelectedUsers(
                            selectedUsers.filter((id) => id !== u.id)
                          );
                        }
                      }}
                    />
                  </td>

                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{roleBadge(u.role)}</td>
                  <td className="p-3 capitalize">{u.status}</td>
                  <td className="p-3">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeletingUser({ id: u.id })}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="p-2 rounded disabled:opacity-40 bg-gray-200 dark:bg-gray-700"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <span className="text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="p-2 rounded disabled:opacity-40 bg-gray-200 dark:bg-gray-700"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// ===============================
// SLIDE-OVER EDIT PANEL
// ===============================
function EditUserPanel() {
  if (!editingUser) return null;

  return (
    <div className="fixed inset-0 z-40 flex">

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40"
        onClick={() => setEditingUser(null)}
      ></div>

      {/* Panel */}
      <div
        className="relative ml-auto h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl p-6 animate-slide-left"
      >
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
          Edit User
        </h2>

        <form onSubmit={saveUser} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block mb-1 dark:text-gray-200">Name</label>
            <input
              name="name"
              defaultValue={editingUser.name}
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 dark:text-gray-200">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={editingUser.email}
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 dark:text-gray-200">Role</label>
            <select
              name="role"
              defaultValue={editingUser.role}
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 dark:text-gray-200">Status</label>
            <select
              name="status"
              defaultValue={editingUser.status}
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===============================
// DELETE CONFIRMATION MODAL
// ===============================
function DeleteModal() {
  if (!deletingUser) return null;

  const isBulk = Array.isArray(deletingUser.id);
  const count = isBulk ? deletingUser.id.length : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setDeletingUser(null)}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
          Confirm Delete
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete{" "}
          <strong>{count}</strong> user{count > 1 ? "s" : ""}?  
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeletingUser(null)}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={confirmDeleteUser}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ===============================
// CREATE USER MODAL
// ===============================
function CreateUserModal() {
  if (!creatingUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setCreatingUser(false)}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
          Create User
        </h2>

        <form onSubmit={createUser} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block mb-1 dark:text-gray-200">Name</label>
            <input
              name="name"
              required
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 dark:text-gray-200">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 dark:text-gray-200">Role</label>
            <select
              name="role"
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 dark:text-gray-200">Status</label>
            <select
              name="status"
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setCreatingUser(false)}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===============================
// MAIN RETURN
// ===============================
return (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6">

    <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">
      Users
    </h1>

    {/* Main Table */}
    <UsersTable />

    {/* Slide-over Edit Panel */}
    <EditUserPanel />

    {/* Delete Confirmation Modal */}
    <DeleteModal />

    {/* Create User Modal */}
    <CreateUserModal />
  </div>
);
}