"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

// -----------------------------
// School Type Definition
// -----------------------------
export type School = {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
  type: "public" | "private" | "boarding" | "international";
  curriculum: "IB" | "Cambridge" | "National" | "American" | "Other";
  fees_annual: number;
  fees_monthly: number;
  rating: number;
  admission_requirements: string;
  contact_email: string;
  contact_phone?: string;
  website?: string;
  description?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

// -----------------------------
// Component Start
// -----------------------------
export default function SchoolsPage() {
  // -----------------------------
  // Data State
  // -----------------------------
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Pagination State
  // -----------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // -----------------------------
  // Sorting State
  // -----------------------------
  const [sortColumn, setSortColumn] = useState<keyof School>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // -----------------------------
  // Filtering State
  // -----------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  // -----------------------------
  // Modal + Slide-over State
  // -----------------------------
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // -----------------------------
  // CRUD Handler Placeholders
  // -----------------------------
  const fetchSchools = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/schools");
      const data = await res.json();
      setSchools(data);
    } catch (error) {
      toast.error("Failed to load schools");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchool = async (formData: any) => {
    try {
      const res = await fetch("/api/schools", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success("School created");
      setIsCreateModalOpen(false);
      fetchSchools();
    } catch {
      toast.error("Failed to create school");
    }
  };

  const handleUpdateSchool = async (formData: any) => {
    if (!selectedSchool) return;

    try {
      const res = await fetch(`/api/schools/${selectedSchool.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success("School updated");
      setIsEditPanelOpen(false);
      fetchSchools();
    } catch {
      toast.error("Failed to update school");
    }
  };

  const handleDeleteSchool = async () => {
    if (!selectedSchool) return;

    try {
      const res = await fetch(`/api/schools/${selectedSchool.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("School deleted");
      setIsDeleteModalOpen(false);
      fetchSchools();
    } catch {
      toast.error("Failed to delete school");
    }
  };

  // -----------------------------
  // Initial Fetch
  // -----------------------------
  useEffect(() => {
    fetchSchools();
  }, []);

  // -----------------------------
  // SECTION 2 — Derived Data Logic
  // -----------------------------

  // Sorting function
  const sortSchools = (data: School[]) => {
    return [...data].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Filtering function
  const filterSchools = (data: School[]) => {
    return data.filter((school) => {
      const matchesSearch =
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.region.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "all" || school.type === selectedType;

      const matchesRegion =
        selectedRegion === "all" || school.region === selectedRegion;

      return matchesSearch && matchesType && matchesRegion;
    });
  };

  // Apply filtering + sorting
  const processedSchools = sortSchools(filterSchools(schools));

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(processedSchools.length / pageSize));

  const paginatedSchools = processedSchools.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle sort column click
  const handleSort = (column: keyof School) => {
    if (sortColumn === column) {
      // Toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedRegion]);

    // -----------------------------
  // SECTION 3 — UI Helper Components
  // -----------------------------

  // Badge for school type
  const TypeBadge = ({ type }: { type: School["type"] }) => {
    const colors: Record<School["type"], string> = {
      public: "bg-blue-100 text-blue-700",
      private: "bg-purple-100 text-purple-700",
      boarding: "bg-green-100 text-green-700",
      international: "bg-orange-100 text-orange-700",
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  // Badge for region
  const RegionBadge = ({ region }: { region: string }) => (
    <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
      {region}
    </span>
  );

  // Featured badge (monetization hook)
  const FeaturedBadge = ({ featured }: { featured: boolean }) => {
    if (!featured) return null;

    return (
      <span className="px-2 py-1 rounded bg-yellow-200 text-yellow-800 text-xs font-semibold">
        ★ Featured
      </span>
    );
  };

  // Rating stars
  const RatingStars = ({ rating }: { rating: number }) => {
    const stars = Array.from({ length: 5 }, (_, i) => i < rating);

    return (
      <div className="flex gap-0.5">
        {stars.map((filled, i) => (
          <span key={i} className={filled ? "text-yellow-500" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Format currency
  const formatCurrency = (value: number) => {
    if (!value) return "—";
    return `£${value.toLocaleString()}`;
  };

  // Truncate long text
  const truncate = (text: string, length = 60) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

    // -----------------------------
  // SECTION 4 — Top Bar UI
  // -----------------------------

  const SchoolFilters = () => {
    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        
        {/* Left side: Search + Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center">

          {/* Search */}
          <input
            type="text"
            placeholder="Search schools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-64"
          />

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Types</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="boarding">Boarding</option>
            <option value="international">International</option>
          </select>

          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Regions</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="Central">Central</option>
          </select>
        </div>

        {/* Right side: Create School Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add School
        </button>
      </div>
    );
  };

    // -----------------------------
  // SECTION 5 — Schools Table
  // -----------------------------

  const SchoolsTable = () => {
    return (
      <div className="overflow-x-auto border rounded-lg bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {/* Name */}
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name {sortColumn === "name" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              {/* Type */}
              <th className="px-4 py-3 text-left">Type</th>

              {/* Region */}
              <th className="px-4 py-3 text-left">Region</th>

              {/* Rating */}
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("rating")}
              >
                Rating {sortColumn === "rating" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              {/* Fees */}
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("fees_annual")}
              >
                Annual Fees {sortColumn === "fees_annual" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              {/* Featured */}
              <th className="px-4 py-3 text-left">Featured</th>

              {/* Actions */}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              // Skeleton rows
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                  <td className="px-4 py-3 text-right"><div className="h-4 bg-gray-200 rounded w-12" /></td>
                </tr>
              ))
            ) : paginatedSchools.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No schools found
                </td>
              </tr>
            ) : (
              paginatedSchools.map((school) => (
                <tr
                  key={school.id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => {
                    setSelectedSchool(school);
                    setIsEditPanelOpen(true);
                  }}
                >
                  {/* Name */}
                  <td className="px-4 py-3 font-medium">{school.name}</td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <TypeBadge type={school.type} />
                  </td>

                  {/* Region */}
                  <td className="px-4 py-3">
                    <RegionBadge region={school.region} />
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-3">
                    <RatingStars rating={school.rating} />
                  </td>

                  {/* Fees */}
                  <td className="px-4 py-3">
                    {formatCurrency(school.fees_annual)}
                  </td>

                  {/* Featured */}
                  <td className="px-4 py-3">
                    <FeaturedBadge featured={school.featured} />
                  </td>

                  {/* Actions */}
                  <td
                    className="px-4 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setSelectedSchool(school);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50 dark:bg-gray-800">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

    // -----------------------------
  // SECTION 6 — Edit School Slide-Over
  // -----------------------------

  const EditSchoolPanel = () => {
    if (!selectedSchool) return null;

    const [formData, setFormData] = useState({
      name: selectedSchool.name,
      address: selectedSchool.address,
      city: selectedSchool.city,
      region: selectedSchool.region,
      type: selectedSchool.type,
      curriculum: selectedSchool.curriculum,
      fees_annual: selectedSchool.fees_annual,
      fees_monthly: selectedSchool.fees_monthly,
      rating: selectedSchool.rating,
      admission_requirements: selectedSchool.admission_requirements,
      contact_email: selectedSchool.contact_email,
      contact_phone: selectedSchool.contact_phone || "",
      website: selectedSchool.website || "",
      description: selectedSchool.description || "",
      featured: selectedSchool.featured,
    });

    const updateField = (field: string, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${
          isEditPanelOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsEditPanelOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-xl bg-white dark:bg-gray-900 shadow-xl transform transition-transform ${
            isEditPanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Edit School</h2>
            <button
              onClick={() => setIsEditPanelOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <div className="p-6 overflow-y-auto h-[calc(100%-70px)] space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">School Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium mb-1">Region</label>
              <select
                value={formData.region}
                onChange={(e) => updateField("region", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="Central">Central</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">School Type</label>
              <select
                value={formData.type}
                onChange={(e) => updateField("type", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="boarding">Boarding</option>
                <option value="international">International</option>
              </select>
            </div>

            {/* Curriculum */}
            <div>
              <label className="block text-sm font-medium mb-1">Curriculum</label>
              <select
                value={formData.curriculum}
                onChange={(e) => updateField("curriculum", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="IB">IB</option>
                <option value="Cambridge">Cambridge</option>
                <option value="National">National</option>
                <option value="American">American</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Fees */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Annual Fees (£)</label>
                <input
                  type="number"
                  value={formData.fees_annual}
                  onChange={(e) => updateField("fees_annual", Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Monthly Fees (£)</label>
                <input
                  type="number"
                  value={formData.fees_monthly}
                  onChange={(e) => updateField("fees_monthly", Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-1">Rating (0–5)</label>
              <input
                type="number"
                min={0}
                max={5}
                value={formData.rating}
                onChange={(e) => updateField("rating", Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Admission Requirements */}
            <div>
              <label className="block text-sm font-medium mb-1">Admission Requirements</label>
              <textarea
                value={formData.admission_requirements}
                onChange={(e) => updateField("admission_requirements", e.target.value)}
                className="w-full border rounded px-3 py-2 h-24"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => updateField("contact_email", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => updateField("contact_phone", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => updateField("website", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full border rounded px-3 py-2 h-24"
              />
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
              />
              <label className="text-sm font-medium">Featured School</label>
            </div>

            {/* Save Button */}
            <button
              onClick={() => handleUpdateSchool(formData)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

    // -----------------------------
  // SECTION 7 — Delete School Modal
  // -----------------------------

  const DeleteSchoolModal = () => {
    if (!isDeleteModalOpen || !selectedSchool) return null;

    return (
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={() => setIsDeleteModalOpen(false)}
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <h2 className="text-xl font-semibold mb-4">Delete School</h2>

          {/* Message */}
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedSchool.name}</span>?  
            This action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteSchool}
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
  // SECTION 8 — Create School Modal
  // -----------------------------

  const CreateSchoolModal = () => {
    if (!isCreateModalOpen) return null;

    const [formData, setFormData] = useState({
      name: "",
      address: "",
      city: "",
      region: "North",
      type: "public",
      curriculum: "IB",
      fees_annual: 0,
      fees_monthly: 0,
      rating: 0,
      admission_requirements: "",
      contact_email: "",
      contact_phone: "",
      website: "",
      description: "",
      featured: false,
    });

    const updateField = (field: string, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={() => setIsCreateModalOpen(false)}
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <h2 className="text-xl font-semibold mb-4">Add New School</h2>

          <div className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">School Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium mb-1">Region</label>
              <select
                value={formData.region}
                onChange={(e) => updateField("region", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="Central">Central</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">School Type</label>
              <select
                value={formData.type}
                onChange={(e) => updateField("type", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="boarding">Boarding</option>
                <option value="international">International</option>
              </select>
            </div>

            {/* Curriculum */}
            <div>
              <label className="block text-sm font-medium mb-1">Curriculum</label>
              <select
                value={formData.curriculum}
                onChange={(e) => updateField("curriculum", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="IB">IB</option>
                <option value="Cambridge">Cambridge</option>
                <option value="National">National</option>
                <option value="American">American</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Fees */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Annual Fees (£)</label>
                <input
                  type="number"
                  value={formData.fees_annual}
                  onChange={(e) => updateField("fees_annual", Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Monthly Fees (£)</label>
                <input
                  type="number"
                  value={formData.fees_monthly}
                  onChange={(e) => updateField("fees_monthly", Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-1">Rating (0–5)</label>
              <input
                type="number"
                min={0}
                max={5}
                value={formData.rating}
                onChange={(e) => updateField("rating", Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Admission Requirements */}
            <div>
              <label className="block text-sm font-medium mb-1">Admission Requirements</label>
              <textarea
                value={formData.admission_requirements}
                onChange={(e) => updateField("admission_requirements", e.target.value)}
                className="w-full border rounded px-3 py-2 h-24"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => updateField("contact_email", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => updateField("contact_phone", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => updateField("website", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full border rounded px-3 py-2 h-24"
              />
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
              />
              <label className="text-sm font-medium">Featured School</label>
            </div>

            {/* Create Button */}
            <button
              onClick={() => handleCreateSchool(formData)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Create School
            </button>
          </div>
        </div>
      </div>
    );
  };

    // -----------------------------
  // SECTION 9 — Final Page Layout
  // -----------------------------

  return (
    <div className="p-6 space-y-6">

      {/* Page Title */}
      <h1 className="text-2xl font-bold">Schools</h1>

      {/* Filters + Create Button */}
      <SchoolFilters />

      {/* Schools Table */}
      <SchoolsTable />

      {/* Modals & Panels */}
      <EditSchoolPanel />
      <DeleteSchoolModal />
      <CreateSchoolModal />
    </div>
  );
}