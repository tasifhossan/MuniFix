"use client";

import React, { useState } from "react";
import { 
  Download, 
  UserPlus, 
  Search, 
  Bell, 
  ChevronDown,
  TrendingUp,
  ShieldCheck,
  Building,
  Zap
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import UserStatsCard from "@/components/UserStatsCard";
import UserTable, { UserItem } from "@/components/UserTable";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Exact mock data matching the screenshot
  const mockUsers: UserItem[] = [
    {
      id: "usr-1",
      name: "Tanvir Ahmed",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop",
      memberSince: "Member since Jan 2024",
      email: "tanvir.cto@munifix.ctg",
      role: "Super Admin",
      status: "Active",
    },
    {
      id: "usr-2",
      name: "Nusrat Jahan",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
      memberSince: "Member since Feb 2024",
      email: "nusrat.field@ccc.gov.bd",
      role: "Field Worker",
      status: "Active",
    },
    {
      id: "usr-3",
      name: "Abul Kashem",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      memberSince: "Member since Mar 2024",
      email: "kashem77@email.com",
      role: "Citizen",
      status: "Inactive",
    },
    {
      id: "usr-4",
      name: "Zubair Karim",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      memberSince: "Member since Jan 2024",
      email: "zubair.waste@ccc.gov.bd",
      role: "Dept Admin",
      status: "Active",
    },
  ];

  // Filtering users based on search and role
  const filteredUsers = mockUsers.filter((user) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesName = user.name.toLowerCase().includes(term);
      const matchesEmail = user.email.toLowerCase().includes(term);
      if (!matchesName && !matchesEmail) {
        return false;
      }
    }

    if (roleFilter !== "All" && user.role !== roleFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/30 flex font-sans">
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
                  placeholder="Search users by name, email..."
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
              <button className="relative p-2 text-slate-450 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95">
                <Bell className="w-5 h-5" />
              </button>

              <div className="h-6 w-[1px] bg-slate-200" />

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-805 block leading-tight">
                    Ariful Haque
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 block leading-tight mt-0.5">
                    Super Admin
                  </span>
                </div>
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                    alt="Ariful Haque profile"
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
                <button className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-350 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-sm">
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Export Data</span>
                </button>
                <button className="inline-flex items-center gap-1.5 bg-[#005c55] hover:bg-[#004540] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-md shadow-[#005c55]/10">
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>Add New User</span>
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <UserStatsCard
                title="Total Registered"
                value="12,842"
                footerElement={
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 font-extrabold">+12% this month</span>
                  </>
                }
              />
              <UserStatsCard
                title="Active Citizens"
                value="11,200"
                footerElement={
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 font-extrabold">Verified Profiles</span>
                  </>
                }
              />
              <UserStatsCard
                title="Field Workers"
                value="485"
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

            {/* User List Table */}
            <UserTable 
              items={filteredUsers}
              totalCount={12842}
              onEditClick={(usr) => alert(`Modifying details for user: ${usr.name}`)}
            />

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
            &copy; 2024 MuniFix Ctg. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}
