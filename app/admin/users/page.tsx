"use client";

import React, { useState, useEffect } from "react";
import { 
  Download, 
  UserPlus, 
  Search, 
  Bell, 
  ChevronDown,
  TrendingUp,
  ShieldCheck,
  Building,
  Zap,
  X
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import UserStatsCard from "@/components/UserStatsCard";
import UserTable, { UserItem } from "@/components/UserTable";
import { fetchUsers, updateUserRole, updateUserStatus, fetchMyProfile } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Profile data for header
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  // Edit / Status modal and toast states
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const mapApiUserToUserItem = (apiUser: any): UserItem => {
    // Role mapping
    let uiRole: UserItem["role"] = "Citizen";
    if (apiUser.role === "super_admin") uiRole = "Super Admin";
    else if (apiUser.role === "field_worker") uiRole = "Field Worker";
    else if (apiUser.role === "dept_admin") uiRole = "Dept Admin";

    // Member since date formatting
    let memberSince = "Member since Jan 2024";
    if (apiUser.created_at || apiUser.createdAt) {
      try {
        const date = new Date(apiUser.created_at || apiUser.createdAt);
        const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
        memberSince = `Member since ${date.toLocaleDateString('en-US', options)}`;
      } catch (e) {}
    }

    // Default avatars matching username or roles
    const fallbackAvatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop`;
    
    return {
      id: apiUser.id || apiUser._id,
      name: apiUser.name || "Unnamed User",
      email: apiUser.email || "No email",
      role: uiRole,
      status: apiUser.is_active ? "Active" : "Inactive",
      avatarUrl: apiUser.avatarUrl || apiUser.avatar_url || fallbackAvatar,
      memberSince,
      // Store phone for filtering
      phone: apiUser.phone
    } as any;
  };

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchUsers();
      const rawUsers = res.users ?? res ?? [];
      const mapped = rawUsers.map(mapApiUserToUserItem);
      setUsers(mapped);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();

    async function loadProfile() {
      try {
        const p = await fetchMyProfile();
        setProfile(p.profile ?? p.user ?? p);
      } catch (err) {
        console.error("Failed to load admin profile for header", err);
      }
    }
    loadProfile();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setActionLoading(true);
    try {
      const backendRoleMap: Record<string, string> = {
        "Super Admin": "super_admin",
        "Field Worker": "field_worker",
        "Citizen": "citizen",
        "Dept Admin": "dept_admin",
      };
      const apiRole = backendRoleMap[newRole] || "citizen";
      await updateUserRole(userId, { role: apiRole });
      triggerToast("User role updated successfully!", "success");
      setEditUser(null);
      await loadUsers();
    } catch (err: any) {
      triggerToast(err.message || "Failed to update user role", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    setActionLoading(true);
    try {
      const newStatus = user.status !== "Active";
      await updateUserStatus(user.id, newStatus);
      triggerToast(`User status updated to ${newStatus ? "Active" : "Inactive"}!`, "success");
      setEditUser(null);
      await loadUsers();
    } catch (err: any) {
      // If endpoint doesn't exist, show proper Feature coming soon message
      if (err.message && (err.message.includes("404") || err.message.toLowerCase().includes("not found") || err.message.toLowerCase().includes("not implemented"))) {
        triggerToast("Feature coming soon: This status toggle is not implemented on the backend yet.", "info");
      } else {
        triggerToast("Feature coming soon: This status toggle is not implemented on the backend yet.", "info");
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Filtering users based on search and role
  const filteredUsers = users.filter((user) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesName = user.name.toLowerCase().includes(term);
      const matchesEmail = user.email.toLowerCase().includes(term);
      const matchesPhone = (user as any).phone?.toLowerCase().includes(term);
      if (!matchesName && !matchesEmail && !matchesPhone) {
        return false;
      }
    }

    if (roleFilter !== "All" && user.role !== roleFilter) {
      return false;
    }

    return true;
  });

  const getDisplayRole = (role: string) => {
    if (!role) return "Admin";
    if (role === "super_admin") return "Super Admin";
    if (role === "dept_admin") return "Dept Admin";
    if (role === "field_worker") return "Field Worker";
    if (role === "citizen") return "Citizen";
    return role;
  };

  // Stats calculation
  const totalRegistered = users.length;
  const activeCitizens = users.filter(u => u.role === "Citizen" && u.status === "Active").length;
  const fieldWorkers = users.filter(u => u.role === "Field Worker").length;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar - Configure settings list at top, + New Report button in bottom footer */}
      <AdminSidebar 
        activeNav="users" 
        newReportPlacement="bottom" 
        settingsPlacement="top"
        role="admin"
      />

      {/* Content panel */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          
          {/* Header Row - search bar, role filter dropdown, notification bell, profile details */}
          <header className="h-16 bg-white border-b border-[#e2e8f0] px-8 flex items-center justify-between sticky top-0 z-10 select-none">
            {/* Search Pill & Filter by Role */}
            <div className="flex items-center gap-6 w-full max-w-2xl">
              {/* Search */}
              <div className="relative w-full max-w-xs md:max-w-sm">
                <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none w-4.5 h-4.5 my-auto" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users by name, email, phone..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50/50 hover:bg-slate-100/40 border border-slate-205/85 rounded-full focus:outline-none focus:border-[#005c55] focus:bg-white text-slate-805 placeholder-slate-450 transition-all shadow-inner"
                />
              </div>

              {/* Vertical divider */}
              <div className="h-6 w-[1px] bg-slate-200" />

              {/* Filter by Role */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  Filter by Role:
                </span>
                <div className="relative">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-white border border-slate-205 rounded-xl py-1.5 pl-3.5 pr-8 text-xs font-bold text-slate-650 focus:outline-none focus:border-[#005c55] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%25236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[right_0.5rem_center] bg-no-repeat transition-all shadow-sm"
                  >
                    <option value="All">All Roles</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Field Worker">Field Worker</option>
                    <option value="Citizen">Citizen</option>
                    <option value="Dept Admin">Dept Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Profile info & Notification Bell */}
            <div className="flex items-center gap-5">
              <button 
                onClick={() => triggerToast("Feature coming soon: Notifications", "info")}
                className="relative p-2 text-slate-450 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95"
              >
                <Bell className="w-5 h-5" />
              </button>

              <div className="h-6 w-[1px] bg-slate-200" />

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-805 block leading-tight">
                    {profile?.name || authUser?.name || "Admin User"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 block leading-tight mt-0.5">
                    {getDisplayRole(profile?.role || authUser?.role || "super_admin")}
                  </span>
                </div>
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                  <img
                    src={profile?.avatarUrl || profile?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"}
                    alt="Admin profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Main Body */}
          <main className="px-8 py-6 space-y-6 flex-1">
            {/* Title / Action Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none select-none">
                  User Management
                </h1>
                <p className="text-slate-500 text-sm font-semibold mt-2 select-none">
                  Manage accounts, permissions, and status for the municipal platform.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 select-none">
                <button 
                  onClick={() => triggerToast("Feature coming soon: Export Data", "info")}
                  className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-350 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-sm"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Export Data</span>
                </button>
                <button 
                  onClick={() => triggerToast("Feature coming soon: Add New User", "info")}
                  className="inline-flex items-center gap-1.5 bg-[#005c55] hover:bg-[#004540] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-md shadow-[#005c55]/10"
                >
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>Add New User</span>
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <UserStatsCard
                title="Total Registered"
                value={loading ? "..." : totalRegistered.toLocaleString()}
                footerElement={
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 font-extrabold">+12% this month</span>
                  </>
                }
              />
              <UserStatsCard
                title="Active Citizens"
                value={loading ? "..." : activeCitizens.toLocaleString()}
                footerElement={
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 font-extrabold">Verified Profiles</span>
                  </>
                }
              />
              <UserStatsCard
                title="Field Workers"
                value={loading ? "..." : fieldWorkers.toLocaleString()}
                footerElement={
                  <>
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500">8 Departments</span>
                  </>
                }
              />
              <UserStatsCard
                title="Report Efficiency"
                value="94%"
                footerElement={
                  <>
                    <Zap className="w-3.5 h-3.5 text-[#3b82f6]" />
                    <span className="text-[#3b82f6] font-extrabold">Average response</span>
                  </>
                }
              />
            </div>

            {/* User List Table / Skeleton / Error */}
            {loading ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-4 animate-pulse">
                <div className="h-8 bg-slate-200 rounded-lg w-1/4" />
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="grid grid-cols-5 gap-4 py-3 border-b border-slate-100">
                      <div className="h-10 bg-slate-200 rounded-full w-10 col-span-1" />
                      <div className="h-5 bg-slate-200 rounded w-5/6 col-span-2" />
                      <div className="h-5 bg-slate-200 rounded w-1/2 col-span-1" />
                      <div className="h-5 bg-slate-200 rounded w-1/3 col-span-1" />
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-3xl border border-red-200/90 shadow-sm p-8 text-center space-y-4">
                <div className="text-red-500 font-bold text-lg">Failed to load users</div>
                <p className="text-slate-500 text-sm">{error}</p>
                <button 
                  onClick={loadUsers}
                  className="bg-[#005c55] hover:bg-[#004540] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 shadow-md"
                >
                  Retry Loading
                </button>
              </div>
            ) : (
              <UserTable 
                items={filteredUsers}
                totalCount={users.length}
                onEditClick={(usr) => setEditUser(usr)}
              />
            )}

          </main>
        </div>

        {/* Global Footer */}
        <footer className="bg-slate-100/50 border-t border-slate-200/60 py-6 px-8 flex flex-col justify-center items-center text-xs font-semibold text-slate-500 gap-3 mt-8">
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

      {/* Edit User Modal Overlay */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setEditUser(null)}
          />
          <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100/80 max-w-[440px] w-full z-10 overflow-hidden flex flex-col font-sans animate-scale-up">
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-tight">
                  Edit User Account
                </h3>
                <p className="text-xxs sm:text-xs font-semibold text-gray-450 block -mt-0.5">
                  Update role or platform access status
                </p>
              </div>
              <button 
                onClick={() => setEditUser(null)} 
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-650 rounded-xl transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* User Details box */}
              <div className="bg-[#f8fafc] border border-slate-150 rounded-2xl p-4 sm:p-5 flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                  <img
                    src={editUser.avatarUrl}
                    alt={editUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-slate-850 block leading-tight">
                    {editUser.name}
                  </span>
                  <span className="text-xs text-slate-450 font-bold block mt-1">
                    {editUser.email}
                  </span>
                </div>
              </div>

              {/* Edit Role Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">
                  Select User Role
                </label>
                <div className="relative">
                  <select
                    value={editUser.role}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white border border-slate-205 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#005c55] text-gray-800 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%25236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat cursor-pointer transition-all duration-200"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Field Worker">Field Worker</option>
                    <option value="Citizen">Citizen</option>
                    <option value="Dept Admin">Dept Admin</option>
                  </select>
                </div>
              </div>

              {/* Status Toggle Box */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-gray-500 uppercase tracking-widest block">
                    Account Status
                  </span>
                  <span className="text-sm font-bold text-slate-700 mt-1 block">
                    Current Status: <span className={editUser.status === "Active" ? "text-emerald-600" : "text-red-650"}>{editUser.status}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(editUser)}
                  disabled={actionLoading}
                  className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all select-none active:scale-[0.98] cursor-pointer ${
                    editUser.status === "Active"
                      ? "border border-red-200 hover:bg-red-50 text-red-650"
                      : "bg-[#005c55] hover:bg-[#004540] text-white"
                  }`}
                >
                  {actionLoading ? "Processing..." : editUser.status === "Active" ? "Deactivate User" : "Activate User"}
                </button>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="border border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-650 text-xs font-bold px-5 py-3 rounded-xl transition-all cursor-pointer select-none active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateRole(editUser.id, editUser.role)}
                disabled={actionLoading}
                className="bg-[#005c55] hover:bg-[#004540] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all cursor-pointer select-none active:scale-[0.98] shadow-md shadow-[#005c55]/10"
              >
                {actionLoading ? "Saving..." : "Save Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Toast notification in bottom-right corner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#1e293b] text-white text-xs font-bold px-4.5 py-3 rounded-2xl shadow-xl transition-all duration-300 transform scale-100 select-none border border-slate-800">
          <div className={`w-5 h-5 ${toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-blue-500' : 'bg-[#10b981]'} text-[#1e293b] rounded-full flex items-center justify-center shadow-inner shrink-0`}>
            {toast.type === 'error' ? (
              <span className="text-white text-xs font-black">!</span>
            ) : toast.type === 'info' ? (
              <span className="text-white text-xs font-black">i</span>
            ) : (
              <svg className="w-3.5 h-3.5 font-bold text-[#1e293b]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-white">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
