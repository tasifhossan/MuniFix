"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import ComplaintFilters from "@/components/ComplaintFilters";
import ComplaintsTable, { ComplaintItem } from "@/components/ComplaintsTable";
import AssignWorkerModal from "@/components/AssignWorkerModal";
import { 
  fetchAdminComplaints, 
  fetchDepartments, 
  searchComplaints, 
  assignComplaint, 
  deleteComplaint, 
  updateComplaintStatus,
  fetchMyProfile 
} from "@/lib/api";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Priority mapper from backend values
function mapPriority(p: string): "Critical" | "High" | "Medium" | "Low" {
  const map: Record<string, "Critical" | "High" | "Medium" | "Low"> = {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  };
  return map[p?.toLowerCase()] ?? "Low";
}

// Status mapper from backend values
function mapStatus(s: string): "Pending" | "In Progress" | "Assigned" | "Resolved" | "Under Review" {
  const map: Record<string, "Pending" | "In Progress" | "Assigned" | "Resolved" | "Under Review"> = {
    pending: "Pending",
    in_progress: "In Progress",
    assigned: "Assigned",
    resolved: "Resolved",
    under_review: "Under Review",
    cancelled: "Resolved",
  };
  return map[s?.toLowerCase()] ?? "Pending";
}

// Dot color helper based on department name
function getDepartmentDotColor(deptName: string): string {
  const map: Record<string, string> = {
    "Waterlogging": "bg-blue-500",
    "Water Supply": "bg-blue-500",
    "Waste Mgmt": "bg-green-500",
    "Waste Management": "bg-green-500",
    "Road Repair": "bg-orange-500",
    "Infrastructure": "bg-orange-500",
    "Public Safety": "bg-red-500",
    "Health": "bg-purple-500",
    "Electricity": "bg-indigo-500"
  };
  return map[deptName] ?? "bg-slate-400";
}

export default function AdminComplaintsPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";
  const isDeptAdmin = user?.role === "dept_admin";

  const [activeNav, setActiveNav] = useState("complaints");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Select dates...");

  // Dynamic Complaints state
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [departmentsList, setDepartmentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function getProfile() {
      try {
        const p = await fetchMyProfile();
        setProfile(p.profile ?? p.user ?? p);
      } catch (err) {}
    }
    getProfile();
  }, []);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  // Modal target complaint
  const [selectedAssignComplaint, setSelectedAssignComplaint] = useState<ComplaintItem | null>(null);

  async function loadComplaints() {
    try {
      setLoading(true);
      setError(null);
      
      // Load departments for mapping if not loaded yet
      let depts = departmentsList;
      if (depts.length === 0) {
        const deptData = await fetchDepartments();
        depts = deptData.departments ?? deptData ?? [];
        setDepartmentsList(depts);
      }

      let department_id = undefined;
      if (isDeptAdmin) {
        department_id = user?.department_id;
      } else {
        const matchedDept = depts.find((d: any) => d.name === departmentFilter);
        department_id = matchedDept ? matchedDept.id : undefined;
      }

      let data;
      if (searchTerm) {
        console.log("[AdminComplaints] Searching with query:", searchTerm);
        data = await searchComplaints({
          q: searchTerm,
          category: (!isDeptAdmin && departmentFilter !== "All") ? departmentFilter : undefined,
          priority: priorityFilter !== "All" ? priorityFilter : undefined,
          status: statusFilter !== "All" ? statusFilter : undefined
        });
      } else {
        console.log("[AdminComplaints] Fetching with filters:", { statusFilter, priorityFilter, department_id });
        data = await fetchAdminComplaints({
          status: statusFilter,
          priority: priorityFilter,
          department_id
        });
      }

      console.log("[AdminComplaints] API Response:", data);

      if (data.success) {
        let rawList = data.complaints ?? data.complains ?? [];
        // Securely filter out other departments' data for dept_admin
        if (isDeptAdmin && user?.department_id) {
          rawList = rawList.filter((c: any) => c.department_id === user.department_id);
        }
        console.log("[AdminComplaints] Raw complaints count:", rawList.length);
        const mappedList: ComplaintItem[] = rawList.map((c: any) => ({
          id: c.id,
          category: c.category || "Other",
          department: c.department_name || (depts.find((d: any) => d.id === c.department_id)?.name) || "Infrastructure",
          departmentId: c.department_id,
          departmentDotColor: getDepartmentDotColor(c.department_name || (depts.find((d: any) => d.id === c.department_id)?.name) || "Infrastructure"),
          priority: mapPriority(c.priority),
          status: mapStatus(c.status),
          dateReported: new Date(c.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          thumbnail: (Array.isArray(c.image_url) && c.image_url[0]) || (typeof c.image_url === "string" ? c.image_url : null) || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop",
          aiConfidence: c.ai_confidence_score ? parseFloat(c.ai_confidence_score) : null,
        }));
        setComplaints(mappedList);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Trigger reloading whenever filters or search terms change
  useEffect(() => {
    setCurrentPage(1);
    loadComplaints();
  }, [departmentFilter, priorityFilter, statusFilter, searchTerm]);

  // Actions
  const handleAssign = async (workerId: string) => {
    if (!selectedAssignComplaint) return;
    try {
      await assignComplaint(selectedAssignComplaint.id, { worker_id: workerId });
      alert("Worker assigned successfully!");
      loadComplaints();
    } catch (err: any) {
      alert("Failed to assign worker: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this complaint?")) {
      try {
        await deleteComplaint(id);
        alert("Complaint deleted successfully!");
        loadComplaints();
      } catch (err: any) {
        alert("Failed to delete complaint: " + err.message);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    let dbStatus = newStatus.toLowerCase();
    if (dbStatus === "in progress") dbStatus = "in_progress";
    if (dbStatus === "under review") dbStatus = "pending"; // backend maps under review back to pending or is status pending? Let's check status_enum: pending, assigned, in_progress, resolved, cancelled.

    try {
      await updateComplaintStatus(id, { status: dbStatus });
      alert("Complaint status updated successfully!");
      loadComplaints();
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Slice list for local pagination
  const itemsPerPage = 10;
  const paginatedComplaints = complaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar - Left panel */}
      <AdminSidebar 
        role={profile?.role === "super_admin" ? "superadmin" : "admin"}
        activeNav={activeNav} 
        onNavClick={setActiveNav} 
        hideUsersAndDepartments={false}
        settingsPlacement="top"
        newReportPlacement="bottom"
      />

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          {/* Reusable Header bar */}
          <AdminHeader 
            variant="overview" 
            title="Complaint Overview" 
            userRole={profile?.name || user?.name || "Admin User"}
            userSubtitle={profile?.role === "super_admin" ? "Super Admin" : profile?.role || user?.role || "Administrator"}
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />

          {/* Main Container */}
          <main className="px-8 py-6 space-y-6 flex-1">
            {/* Filter controls */}
            <ComplaintFilters
              department={departmentFilter}
              setDepartment={setDepartmentFilter}
              status={statusFilter}
              setStatus={setStatusFilter}
              priority={priorityFilter}
              setPriority={setPriorityFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
              onApply={() => {}}
              onExport={() => {
                alert("Exporting data as CSV/Excel...");
              }}
              hideDepartment={isDeptAdmin}
            />

            {loading ? (
              <div className="bg-white rounded-3xl border border-slate-200/95 p-20 flex flex-col items-center justify-center min-h-[300px] shadow-sm animate-pulse">
                <Loader2 className="w-10 h-10 text-[#005c55] animate-spin" />
                <p className="text-slate-500 text-sm font-bold mt-4">Connecting to live complains database...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-3xl border border-slate-200/95 p-20 flex flex-col items-center justify-center min-h-[300px] text-center shadow-sm">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-base font-extrabold text-slate-800">Failed to Load Complaints</h3>
                <p className="text-slate-400 text-xs mt-1.5 max-w-sm leading-relaxed">{error}</p>
                <button
                  onClick={loadComplaints}
                  className="mt-6 bg-[#005c55] hover:bg-[#004540] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            ) : (
              /* Complaints Table */
              <ComplaintsTable
                items={paginatedComplaints}
                totalCount={complaints.length}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onAssignClick={(item) => setSelectedAssignComplaint(item)}
                onDeleteClick={handleDelete}
                onStatusChange={handleStatusChange}
              />
            )}
          </main>
        </div>

        {/* Global Footer */}
        <footer className="bg-transparent py-6 px-8 flex flex-col justify-center items-center text-xs font-semibold text-slate-500 gap-3 mt-8">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 select-none">
            <a href="#departments" className="hover:text-[#005c55] transition-colors">Departments</a>
            <a href="#privacy" className="hover:text-[#005c55] transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#005c55] transition-colors">Terms of Service</a>
            <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-[#005c55] transition-colors">
              Chattogram City Corporation
            </a>
          </div>
          <span className="select-none text-slate-400 mt-1">
            &copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.
          </span>
        </footer>
      </div>

      {/* Assign Worker Modal */}
      {selectedAssignComplaint && (
        <AssignWorkerModal
          isOpen={!!selectedAssignComplaint}
          onClose={() => setSelectedAssignComplaint(null)}
          complaintId={selectedAssignComplaint.id}
          priority={selectedAssignComplaint.priority}
          category={selectedAssignComplaint.category}
          location="Chattogram Municipal"
          departmentId={selectedAssignComplaint.departmentId}
          onConfirm={handleAssign}
        />
      )}
    </div>
  );
}
