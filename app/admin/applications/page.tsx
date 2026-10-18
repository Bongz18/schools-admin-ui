"use client";

import { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import { toast } from "react-hot-toast";

console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("SUPABASE KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function ApplicationsPage() {
  // -----------------------------
  // SECTION 1 — State
  // -----------------------------
  const [applications, setApplications] = useState<Application[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // -----------------------------
  // SECTION 2 — Fetching
  // -----------------------------
  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        return;
      }

      setApplications(data || []);
    } catch (err) {
      console.error("Unexpected error fetching applications:", err);
    }
  };

  const fetchParents = async () => {
    try {
      const { data, error } = await supabase.from("users").select("id, email");

      if (error) {
        console.error("Error fetching parents:", error);
        return;
      }

      setParents(data || []);
    } catch (err) {
      console.error("Unexpected error fetching parents:", err);
    }
  };

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase.from("schools").select("id, name");

      if (error) {
        console.error("Error fetching schools:", error);
        return;
      }

      setSchools(data || []);
    } catch (err) {
      console.error("Unexpected error fetching schools:", err);
    }
  };

  // -----------------------------
  // SECTION 3 — Sorting / Filtering / Pagination
  // -----------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredApplications = applications.filter((app) => {
    const parent = parents.find((p) => String(p.id) === String(app.parent_id));
    const school = schools.find((s) => String(s.id) === String(app.school_id));

    const matchesSearch =
      !searchQuery ||
      parent?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSchool =
      schoolFilter === "all" || String(app.school_id) === String(schoolFilter);

    return matchesSearch && matchesStatus && matchesSchool;
  });

  const sortedApplications = [...filteredApplications].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const totalPages = Math.max(1, Math.ceil(sortedApplications.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  const paginatedApplications = sortedApplications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    const init = async () => {
      try {
        // Ensure an anonymous session exists for RLS policies that expect auth
        await supabase.auth.signInAnonymously();
      } catch (err) {
        // signInAnonymously may fail if provider disabled; ignore and continue — many projects expect anon key to work
        console.warn("supabase anonymous sign-in failed:", err);
      }

      setLoading(true);

      // fetch all resources in parallel
      await Promise.all([fetchApplications(), fetchParents(), fetchSchools()]);

      setLoading(false);
    };

    init();
  }, []);
  // -----------------------------
  // SECTION 4 — Filters UI
  // -----------------------------
  const ApplicationsFilters = () => (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      {/* Search */}
      <input
        type="text"
        placeholder="Search by parent or school..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
        className="border rounded px-3 py-2 w-full md:w-64"
      />

      <div className="flex items-center gap-3">

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="in_review">In Review</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* School Filter */}
        <select
          value={schoolFilter}
          onChange={(e) => {
            setSchoolFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Schools</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>

        {/* New Application Button */}
        <button
          onClick={() => {
            setNewParentId("");
            setNewSchoolId("");
            setNewStatus("submitted");
            setNewNotes("");
            setIsCreateModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + New Application
        </button>
      </div>
    </div>
  );

  // -----------------------------
  // SECTION 5 — Applications Table
  // -----------------------------
  const ApplicationsTable = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      );
    }

    if (paginatedApplications.length === 0) return <EmptyState />;

    return (
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="p-3">Parent</th>
              <th className="p-3">School</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedApplications.map((app) => (
              <tr key={app.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">
                  <ParentName parentId={app.parent_id} />
                </td>

                <td className="p-3">
                  <SchoolName schoolId={app.school_id} />
                </td>

                <td className="p-3">
                  <StatusBadge status={app.status} />
                </td>

                <td className="p-3">{formatDate(app.created_at)}</td>

                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => {
                      setSelectedApplication(app);
                      setEditStatus(app.status);
                      setEditNotes(app.notes || "");
                      setIsEditPanelOpen(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedApplication(app);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  // -----------------------------
  // SECTION 6 — Edit Slide-Over
  // -----------------------------
  const EditApplicationPanel = () => {
    if (!selectedApplication) return null;

    const parent = parents.find((p) => String(p.id) === String(selectedApplication.parent_id));
    const school = schools.find((s) => String(s.id) === String(selectedApplication.school_id));

    const handleSave = () => {
      handleUpdateApplication({
        status: editStatus,
        notes: editNotes,
      });
    };

    return (
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity ${
          isEditPanelOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform ${
            isEditPanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Edit Application</h2>
            <button
              onClick={() => setIsEditPanelOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-120px)]">
            <div>
              <label className="text-sm text-gray-600">Parent</label>
              <div className="mt-1 font-medium">{parent?.email}</div>
            </div>

            <div>
              <label className="text-sm text-gray-600">School</label>
              <div className="mt-1 font-medium">{school?.name}</div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="border rounded px-3 py-2 w-full mt-1"
              >
                <option value="submitted">Submitted</option>
                <option value="in_review">In Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Notes</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="border rounded px-3 py-2 w-full mt-1 h-32"
                placeholder="Internal notes..."
              />
            </div>
          </div>

          <div className="p-4 border-t flex justify-end gap-2">
            <button
              onClick={() => setIsEditPanelOpen(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // -----------------------------
  // SECTION 7 — Delete Modal
  // -----------------------------
  const DeleteApplicationModal = () => {
    if (!selectedApplication) return null;

    return (
      <div
        className={`fixed inset-0 bg-black/30 flex items-center justify-center transition-opacity ${
          isDeleteModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <h2 className="text-lg font-semibold mb-2">Delete Application</h2>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this application? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteApplication}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // -----------------------------
  // SECTION 8 — Create Modal
  // -----------------------------
  const [newParentId, setNewParentId] = useState("");
  const [newSchoolId, setNewSchoolId] = useState("");
  const [newStatus, setNewStatus] = useState("submitted");
  const [newNotes, setNewNotes] = useState("");

  const handleCreateApplication = async (formData: any) => {
    const { error } = await supabase.from("applications").insert([formData]);

    if (error) {
      toast.error("Failed to create application");
      console.error(error);
      return;
    }

    toast.success("Application created");
    setIsCreateModalOpen(false);
    fetchApplications();
  };

  // (other handlers like handleUpdateApplication, handleDeleteApplication are assumed to exist in the file elsewhere)
  const CreateApplicationModal = () => (
    <div
      className={`fixed inset-0 bg-black/30 flex items-center justify-center transition-opacity ${
        isCreateModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">New Application</h2>

        <div className="space-y-4">
          {/* Parent */}
          <div>
            <label className="text-sm text-gray-600">Parent</label>
            <select
              value={newParentId}
              onChange={(e) => setNewParentId(e.target.value)}
              className="border rounded px-3 py-2 w-full mt-1"
            >
              <option value="">Select Parent</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.email}
                </option>
              ))}
            </select>
          </div>

          {/* School */}
          <div>
            <label className="text-sm text-gray-600">School</label>
            <select
              value={newSchoolId}
              onChange={(e) => setNewSchoolId(e.target.value)}
              className="border rounded px-3 py-2 w-full mt-1"
            >
              <option value="">Select School</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border rounded px-3 py-2 w-full mt-1"
            >
              <option value="submitted">Submitted</option>
              <option value="in_review">In Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-gray-600">Notes</label>
            <textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="border rounded px-3 py-2 w-full mt-1 h-24"
              placeholder="Optional internal notes..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              handleCreateApplication({
                parent_id: newParentId,
                school_id: newSchoolId,
                status: newStatus,
                notes: newNotes,
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );

  // -----------------------------
  // SECTION 9 — Final Page Assembly
  // -----------------------------
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Applications</h1>
      <ApplicationsFilters />
      <ApplicationsTable />
      <EditApplicationPanel />
      <DeleteApplicationModal />
      <CreateApplicationModal />
    </div>
  );
}
