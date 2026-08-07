"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Plus, Loader2, AlertTriangle } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import DepartmentStatsCard from "@/components/DepartmentStatsCard";
import DepartmentTable, { DepartmentItem } from "@/components/DepartmentTable";
import DepartmentLoadBalance from "@/components/DepartmentLoadBalance";
import OperationalGuidelines from "@/components/OperationalGuidelines";
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import DepartmentFormModal from "@/components/DepartmentFormModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

// Icon mapping helper based on department name
function getIconType(name: string): "water" | "light" | "waste" | "road" {
  const n = name?.toLowerCase() || "";
  if (n.includes("water") || n.includes("sewerage") || n.includes("waterlogging")) return "water";
  if (n.includes("light") || n.includes("electricity") || n.includes("power")) return "light";
  if (n.includes("waste") || n.includes("garbage") || n.includes("sanitation")) return "waste";
  return "road";
}

// Icon color mapping helper
function getIconColorClass(name: string): string {
  const type = getIconType(name);
  const styles = {
    water: "bg-[#e0f2fe] text-[#0369a1] border border-sky-100",
    light: "bg-[#e0e7ff] text-[#4f46e5] border border-indigo-100",
    waste: "bg-[#fef3c7] text-[#b45309] border border-amber-100",
    road: "bg-[#d1fae5] text-[#047857] border border-emerald-100",
  };
  return styles[type] || styles.road;
}

// Complaint badge color helper
function getComplaintBadgeClass(activeCount: number): string {
  if (activeCount > 20) return "bg-[#ffe4e6] text-[#e11d48] border border-rose-100";
  return "bg-[#ccfbf1] text-[#0d9488] border border-teal-100";
}

export default function AdminDepartmentsPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";
  const isDeptAdmin = user?.role === "dept_admin";

  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDepartments() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDepartments();
      let rawList = res.departments ?? res ?? [];
      if (isDeptAdmin && user?.department_id) {
        rawList = rawList.filter((d: any) => String(d.id) === String(user.department_id));
      }
      const mappedList: DepartmentItem[] = rawList.map((d: any) => ({
        id: String(d.id),
        name: d.name,
        subtitle: d.description || "City operations and maintenance",
        iconType: getIconType(d.name),
        iconColorClass: getIconColorClass(d.name),
        headName: d.manager_name || "Eng. Ahmed Faruq",
        headInitials: d.manager_name ? d.manager_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "AF",
        headBgClass: "bg-slate-100 text-slate-650 border border-slate-200",
        totalStaff: d.staff_count ? parseInt(d.staff_count) : 12,
        activeComplaints: d.active_complaints_count ? parseInt(d.active_complaints_count) : 0,
        complaintBadgeColorClass: getComplaintBadgeClass(d.active_complaints_count ? parseInt(d.active_complaints_count) : 0),
      }));
      setDepartments(mappedList);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  // Form Modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formModalTitle, setFormModalTitle] = useState("");
  const [formInitialName, setFormInitialName] = useState("");
  const [formInitialDescription, setFormInitialDescription] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteDept, setSelectedDeleteDept] = useState<DepartmentItem | null>(null);

  // CRUD actions
  const handleAddDepartment = () => {
    setSelectedDeptId(null);
    setFormInitialName("");
    setFormInitialDescription("");
    setFormModalTitle("Add New Department");
    setFormModalOpen(true);
  };

  const handleEditDepartment = (item: DepartmentItem) => {
    setSelectedDeptId(item.id);
    setFormInitialName(item.name);
    setFormInitialDescription(item.subtitle);
    setFormModalTitle("Edit Department");
    setFormModalOpen(true);
  };

  const handleDeleteDepartment = (item: DepartmentItem) => {
    setSelectedDeleteDept(item);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (name: string, description: string) => {
    if (selectedDeptId) {
      await updateDepartment(selectedDeptId, { name, description });
    } else {
      await createDepartment({ name, description });
    }
    loadDepartments();
  };

  const handleDeleteConfirm = async () => {
    if (selectedDeleteDept) {
      await deleteDepartment(selectedDeleteDept.id);
      loadDepartments();
    }
  };

  // Filtering logic
  const filteredDepartments = departments.filter((dept) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        dept.name.toLowerCase().includes(term) ||
        dept.subtitle.toLowerCase().includes(term) ||
        dept.headName.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const totalStaffCount = departments.reduce((sum, d) => sum + d.totalStaff, 0);
  const totalPendingComplaints = departments.reduce((sum, d) => sum + d.activeComplaints, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar - Hide the New Report button on the Departments list page */}
      <AdminSidebar activeNav="departments" hideNewReport={true} />

      {/* Main Content Scroll Panel */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          
          {/* Header Row - Integrated directly inside page wrapper for unique layout style */}
          <header className="h-16 bg-white border-b border-[#e2e8f0] px-8 flex items-center justify-between sticky top-0 z-10">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none select-none">
              Department Management
            </h1>

            {/* Middle search and utilities */}
            <div className="flex items-center gap-4 w-full max-w-xl justify-end">
              {/* Search departments */}
              <div className="relative w-full max-w-xs sm:max-w-md">
                <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none w-4.5 h-4.5 my-auto" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search departments..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50/50 hover:bg-slate-100/40 border border-slate-200/80 rounded-full focus:outline-none focus:border-[#005c55] focus:bg-white text-slate-800 placeholder-slate-450 transition-all shadow-inner"
                />
              </div>

              {/* Notification icon */}
              <button className="relative p-2 text-slate-450 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95">
                <Bell className="w-5 h-5" />
              </button>

              {/* Add Department Button */}
              {isSuperAdmin && (
                <button 
                  onClick={handleAddDepartment}
                  className="inline-flex items-center gap-1.5 bg-[#005c55] hover:bg-[#004540] text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-md shadow-[#005c55]/10 select-none"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Department</span>
                </button>
              )}
            </div>
          </header>

          {/* Main Body Containers */}
          <main className="px-8 py-6 space-y-6 flex-1">
            
            {/* Stats Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <DepartmentStatsCard
                title="Total Departments"
                value={departments.length}
                rightElement={
                  <span className="text-[10px] font-extrabold text-slate-400 select-none">
                    Active Units
                  </span>
                }
              />
              <DepartmentStatsCard
                title="Active Staff"
                value={totalStaffCount}
                rightElement={
                  <span className="text-[10px] font-extrabold text-slate-400 select-none">
                    Across all units
                  </span>
                }
              />
              <DepartmentStatsCard
                title="Pending Tasks"
                value={totalPendingComplaints}
                rightElement={
                  <span className="text-[10px] font-extrabold text-slate-400 select-none">
                    Requiring resolution
                  </span>
                }
              />
              <DepartmentStatsCard
                title="Resolution Rate"
                value="94%"
                rightElement={
                  <span className="text-[10px] font-extrabold text-slate-400 select-none">
                    High Priority
                  </span>
                }
              />
            </div>

            {loading ? (
              <div className="bg-white rounded-3xl border border-slate-200/95 p-20 flex flex-col items-center justify-center min-h-[300px] shadow-sm animate-pulse">
                <Loader2 className="w-10 h-10 text-[#005c55] animate-spin" />
                <p className="text-slate-500 text-sm font-bold mt-4">Connecting to departments database...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-3xl border border-slate-200/95 p-20 flex flex-col items-center justify-center min-h-[300px] text-center shadow-sm">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-base font-extrabold text-slate-800">Failed to Load Departments</h3>
                <p className="text-slate-400 text-xs mt-1.5 max-w-sm leading-relaxed">{error}</p>
                <button
                  onClick={loadDepartments}
                  className="mt-6 bg-[#005c55] hover:bg-[#004540] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            ) : (
              /* Active Departments Table */
              <DepartmentTable
                items={filteredDepartments}
                totalCount={departments.length}
                onEdit={isSuperAdmin ? handleEditDepartment : undefined}
                onDelete={isSuperAdmin ? handleDeleteDepartment : undefined}
              />
            )}

            {/* Bottom Grid: Load Balance & Operational Guidelines */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 flex">
                <DepartmentLoadBalance />
              </div>
              <div className="lg:col-span-2 flex">
                <OperationalGuidelines onViewProtocols={() => alert("Redirecting to Operational Guidelines protocols documentation...")} />
              </div>
            </div>

          </main>
        </div>

        {/* Global Footer */}
        <footer className="bg-slate-100/50 border-t border-slate-200/60 py-6 px-8 flex flex-col justify-center items-center text-xs font-semibold text-slate-500 gap-3 mt-8">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 select-none">
            <a href="#departments" className="hover:text-[#005c55] transition-colors">Departments</a>
            <a href="/privacy" className="hover:text-[#005c55] transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#005c55] transition-colors">Terms of Service</a>
            <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-[#005c55] transition-colors">
              Chattogram City Corporation
            </a>
          </div>
          <span className="select-none text-slate-400 mt-1">
            &copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.
          </span>
        </footer>
      </div>

      {/* Form Modal */}
      <DepartmentFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialName={formInitialName}
        initialDescription={formInitialDescription}
        title={formModalTitle}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedDeleteDept(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        itemName={selectedDeleteDept?.name || ""}
        warningMessage={
          selectedDeleteDept && selectedDeleteDept.activeComplaints > 0
            ? `Warning: This department has ${selectedDeleteDept.activeComplaints} active complaints associated with it.`
            : undefined
        }
      />
    </div>
  );
}
