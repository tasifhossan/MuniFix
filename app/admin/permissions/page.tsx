"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  ShieldCheck, 
  ClipboardList, 
  UserPlus, 
  ChevronDown, 
  MoreVertical,
  SlidersHorizontal,
  Download
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import UserStatsCard from "@/components/UserStatsCard";
import { updateUserRole, updateUserStatus, fetchUsers, fetchMyProfile, fetchDepartments } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  department: string;
  department_id?: number | null;
  role: string;
  status: boolean; // true = Active, false = Inactive
  initials: string;
  avatarBg: string;
  avatarText: string;
}

export default function RolePermissionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [savedState, setSavedState] = useState<AdminUser[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Profile data for header
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, deptsRes] = await Promise.all([
        fetchUsers({ role: "dept_admin,super_admin" }),
        fetchDepartments(),
      ]);
      const rawUsers = usersRes.users ?? usersRes ?? [];
      const depts = deptsRes.departments ?? deptsRes ?? [];
      const deptMap = new Map<number, string>(depts.map((d: any) => [d.id, d.name]));

      // Filter out citizens to only show staff/admin users
      const staffRaw = rawUsers.filter((u: any) => u.role !== "citizen");

      const mapped = staffRaw.map((u: any) => {
        // Initials
        const initials = (u.name || "SU")
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        // Avatar colors
        const bgs = ["bg-[#e0f2fe]", "bg-[#e2f2f0]", "bg-[#f1f5f9]", "bg-[#fee2e2]", "bg-[#fef3c7]"];
        const texts = ["text-[#0369a1]", "text-[#0f766e]", "text-[#475569]", "text-[#b91c1c]", "text-[#b45309]"];
        let hash = 0;
        const nameStr = u.name || "";
        for (let i = 0; i < nameStr.length; i++) {
          hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
        }
        const idx = Math.abs(hash) % bgs.length;

        return {
          id: u.id || u._id,
          name: u.name || "Unnamed User",
          email: u.email || "No Email",
          department: deptMap.get(u.department_id) || "General",
          department_id: u.department_id || null,
          role: u.role || "field_worker",
          status: u.is_active !== false,
          initials,
          avatarBg: bgs[idx],
          avatarText: texts[idx],
        };
      });

      setUsers(mapped);
      setSavedState(JSON.parse(JSON.stringify(mapped)));
    } catch (err: any) {
      setError(err.message || "Failed to fetch staff data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    async function loadProfile() {
      try {
        const p = await fetchMyProfile();
        setProfile(p.profile ?? p.user ?? p);
      } catch (err) {
        console.error("Failed to load header admin profile", err);
      }
    }
    loadProfile();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const handleToggleStatus = async (user: AdminUser) => {
    setToggleLoading(user.id);
    setError(null);
    try {
      const newStatus = !user.status;
      await updateUserStatus(user.id, newStatus);
      
      setUsers(prev =>
        prev.map(u => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
      setSavedState(prev =>
        prev.map(u => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
      triggerToast(`User status updated to ${newStatus ? "Active" : "Inactive"}`);
    } catch (err: any) {
      if (err.message && (err.message.includes("404") || err.message.toLowerCase().includes("not found") || err.message.toLowerCase().includes("not implemented"))) {
        setError("This feature is not available yet");
      } else {
        setError(err.message || "Failed to update user status");
      }
    } finally {
      setToggleLoading(null);
    }
  };

  const handleRoleChange = (id: string, newRole: string) => {
    setUsers(prev =>
      prev.map(user => (user.id === id ? { ...user, role: newRole } : user))
    );
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError(null);

      // Find users whose roles have changed
      const modified = users.filter(user => {
        const original = savedState.find(o => o.id === user.id);
        return original && original.role !== user.role;
      });

      for (const u of modified) {
        await updateUserRole(u.id, {
          role: u.role,
          department_id: u.department_id
        });
      }

      setSavedState(JSON.parse(JSON.stringify(users)));
      triggerToast("Changes saved successfully");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to update role privileges");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setUsers(JSON.parse(JSON.stringify(savedState)));
    setError(null);
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesName = user.name.toLowerCase().includes(term);
      const matchesEmail = user.email.toLowerCase().includes(term);
      const matchesDept = user.department.toLowerCase().includes(term);
      return matchesName || matchesEmail || matchesDept;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar - Configure active item and hide unused departments option */}
      <AdminSidebar 
        activeNav="permissions" 
        hideNewReport={true} 
        hideDepartments={true}
        settingsPlacement="top"
        newReportPlacement="bottom"
      />

      {/* Main panel */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          {/* Header - centered search and user role metadata */}
          <AdminHeader
            variant="permissions"
            title="Role & Permissions"
            userRole={profile?.name || authUser?.name || "Admin User"}
            userSubtitle={profile?.role === "super_admin" ? "Super Admin" : profile?.role || authUser?.role || "Administrator"}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <main className="px-8 py-6 space-y-6 flex-1">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl animate-fade-in flex items-center gap-2 select-none">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            {/* Stats row & Quick Action Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 select-none">
              
              {/* Total Staff Stats */}
              <UserStatsCard
                title="Total Staff"
                value={loading ? "..." : users.length.toString()}
                icon={<Users className="w-5 h-5 text-emerald-600" />}
              />

              {/* Super Admins Stats */}
              <UserStatsCard
                title="Super Admins"
                value={loading ? "..." : users.filter(u => u.role === "super_admin").length.toString()}
                icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
              />

              {/* Pending Changes Stats */}
              <UserStatsCard
                title="Pending Role Changes"
                value={loading ? "..." : users.filter(user => {
                  const original = savedState.find(o => o.id === user.id);
                  return original && original.role !== user.role;
                }).length.toString()}
                icon={<ClipboardList className="w-5 h-5 text-amber-600" />}
              />

              {/* Quick Action Card */}
              <div className="bg-[#005c55] rounded-2xl p-5 text-white flex flex-col justify-between h-[105px] shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-teal-100 uppercase tracking-wider">
                    Quick Action
                  </span>
                  <UserPlus className="w-5 h-5 text-teal-200" />
                </div>
                <button
                  onClick={() => triggerToast("Feature coming soon: Add New Member")}
                  className="w-full bg-white text-[#005c55] border border-transparent hover:bg-teal-50 text-xs font-extrabold py-2 px-4 rounded-xl shadow-sm text-center transition-all cursor-pointer select-none active:scale-[0.98] mt-1"
                >
                  Add New Member
                </button>
              </div>

            </div>

            {/* Administrators list card / Loading / Error */}
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
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between animate-fade-in">
                
                {/* Card Header */}
                <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 select-none">
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                    System Administrators & Roles
                  </h2>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => triggerToast("Feature coming soon: Export CSV")}
                      className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>Export CSV</span>
                    </button>
                    <button 
                      onClick={() => triggerToast("Feature coming soon: Filter by Dept")}
                      className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                      <span>Filter by Dept</span>
                    </button>
                  </div>
                </div>

                {/* Table section */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse table-auto min-w-[700px]">
                    {/* Table Header */}
                    <thead className="bg-[#f8fafc] border-b border-slate-200/50 select-none">
                      <tr>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          User
                        </th>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Department
                        </th>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-56">
                          Assigned Role
                        </th>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-36">
                          Status
                        </th>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-slate-150/60">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="transition-colors duration-150 hover:bg-slate-50/40"
                        >
                          {/* User identity cell */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center text-xs font-black shadow-inner select-none shrink-0 ${user.avatarBg} ${user.avatarText}`}>
                                {user.initials}
                              </div>
                              <div className="flex flex-col leading-tight">
                                <span className="text-sm font-bold text-slate-800">
                                  {user.name}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 mt-0.5 select-all">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Department cell */}
                          <td className="py-4 px-6 vertical-middle text-sm font-bold text-slate-500">
                            {user.department}
                          </td>

                          {/* Role selection dropdown cell */}
                          <td className="py-4 px-6 vertical-middle">
                            <div className="relative w-48">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                className="w-full bg-[#f8fafc]/60 border border-slate-205 rounded-xl py-1.5 pl-3.5 pr-8 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#005c55] cursor-pointer appearance-none shadow-sm transition-all"
                              >
                                <option value="citizen">Citizen</option>
                                <option value="field_worker">Field Worker</option>
                                <option value="dept_admin">Department Admin</option>
                                <option value="super_admin">Super Admin</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                                <ChevronDown className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </td>

                          {/* Toggle switch status cell */}
                          <td className="py-4 px-6 vertical-middle">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={toggleLoading === user.id}
                                onClick={() => handleToggleStatus(user)}
                                className={`relative inline-flex h-5.5 w-10.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-205 ease-in-out focus:outline-none ${
                                  user.status ? "bg-[#005c55]" : "bg-slate-250/90"
                                } ${toggleLoading === user.id ? "opacity-60 cursor-wait" : ""}`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-205 ease-in-out ${
                                    user.status ? "translate-x-5" : "translate-x-0"
                                  }`}
                                />
                              </button>
                              <span className="text-xs font-bold text-slate-500 w-12 select-none">
                                {user.status ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </td>

                          {/* Actions button cell */}
                          <td className="py-4 px-6 text-right vertical-middle">
                            <button 
                              onClick={() => triggerToast(`Actions menu for ${user.name}`)}
                              className="p-1 text-slate-400 hover:text-[#005c55] hover:bg-slate-50 rounded-lg cursor-pointer transition-all active:scale-90 inline-flex"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Actions block */}
                <div className="bg-[#f8fafc]/50 border-t border-slate-100 p-6 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-400 select-none">
                    Showing {filteredUsers.length} of {users.length} administrators
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDiscardChanges}
                      className="inline-flex items-center justify-center bg-white border border-slate-205 hover:bg-slate-50 text-slate-700 text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-sm cursor-pointer transition-all select-none active:scale-[0.98]"
                    >
                      Discard Changes
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      disabled={saving}
                      className="inline-flex items-center justify-center bg-[#005c55] hover:bg-[#004540] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>

              </div>
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

      {/* Floating Success Toast notification in bottom-right corner */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#1e293b] text-white text-xs font-bold px-4.5 py-3 rounded-2xl shadow-xl transition-all duration-300 transform scale-100 select-none border border-slate-800">
          <div className="w-5 h-5 bg-[#10b981] text-[#1e293b] rounded-full flex items-center justify-center shadow-inner shrink-0">
            <svg className="w-3.5 h-3.5 font-bold text-[#1e293b]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
