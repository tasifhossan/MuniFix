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

interface AdminUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: boolean; // true = Active, false = Inactive
  initials: string;
  avatarBg: string;
  avatarText: string;
}

const initialUsers: AdminUser[] = [
  {
    id: "1",
    name: "Ahmed Hossain",
    email: "ahmed.h@munifix.gov.bd",
    department: "Waste Management",
    role: "Department Head",
    status: true,
    initials: "AH",
    avatarBg: "bg-[#e0f2fe]",
    avatarText: "text-[#0369a1]",
  },
  {
    id: "2",
    name: "Sultana Kamal",
    email: "s.kamal@munifix.gov.bd",
    department: "Public Works",
    role: "Operator",
    status: false,
    initials: "SK",
    avatarBg: "bg-[#e2f2f0]",
    avatarText: "text-[#0f766e]",
  },
  {
    id: "3",
    name: "Tanvir Rahman",
    email: "tanvir.r@munifix.gov.bd",
    department: "Electricity & Lighting",
    role: "Field Officer",
    status: true,
    initials: "TR",
    avatarBg: "bg-[#f1f5f9]",
    avatarText: "text-[#475569]",
  },
];

export default function RolePermissionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [savedState, setSavedState] = useState<AdminUser[]>(initialUsers);
  const [showToast, setShowToast] = useState(false);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleToggleStatus = (id: string) => {
    setUsers(prev =>
      prev.map(user => (user.id === id ? { ...user, status: !user.status } : user))
    );
  };

  const handleRoleChange = (id: string, newRole: string) => {
    setUsers(prev =>
      prev.map(user => (user.id === id ? { ...user, role: newRole } : user))
    );
  };

  const handleSaveChanges = () => {
    setSavedState([...users]);
    setShowToast(true);
  };

  const handleDiscardChanges = () => {
    setUsers([...savedState]);
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
    <div className="min-h-screen bg-[#f8fafc]/50 flex font-sans">
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
            userRole="Super Admin"
            userSubtitle="CCC Headquarters"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Main Container */}
          <main className="px-8 py-6 space-y-6 flex-1">
            
            {/* Stats row & Quick Action Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 select-none">
              
              {/* Total Staff Stats */}
              <UserStatsCard
                title="Total Staff"
                value="142"
                icon={<Users className="w-5 h-5 text-emerald-600" />}
              />

              {/* Super Admins Stats */}
              <UserStatsCard
                title="Super Admins"
                value="08"
                icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
              />

              {/* Pending Changes Stats */}
              <UserStatsCard
                title="Pending Role Changes"
                value="03"
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
                  onClick={() => alert("Add new member modal/form goes here...")}
                  className="w-full bg-white text-[#005c55] border border-transparent hover:bg-teal-50 text-xs font-extrabold py-2 px-4 rounded-xl shadow-sm text-center transition-all cursor-pointer select-none active:scale-[0.98] mt-1"
                >
                  Add New Member
                </button>
              </div>

            </div>

            {/* Administrators list card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              
              {/* Card Header */}
              <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 select-none">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  System Administrators & Roles
                </h2>
                <div className="flex items-center gap-3">
                  <button className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm cursor-pointer transition-all active:scale-[0.98]">
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>Export CSV</span>
                  </button>
                  <button className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm cursor-pointer transition-all active:scale-[0.98]">
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
                              <option value="Department Head">Department Head</option>
                              <option value="Operator">Operator</option>
                              <option value="Field Officer">Field Officer</option>
                              <option value="Administrator">Administrator</option>
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
                              onClick={() => handleToggleStatus(user.id)}
                              className={`relative inline-flex h-5.5 w-10.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-205 ease-in-out focus:outline-none ${
                                user.status ? "bg-[#005c55]" : "bg-slate-250/90"
                              }`}
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
                          <button className="p-1 text-slate-400 hover:text-[#005c55] hover:bg-slate-50 rounded-lg cursor-pointer transition-all active:scale-90 inline-flex">
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
                  Showing {filteredUsers.length} of 142 administrators
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
                    className="inline-flex items-center justify-center bg-[#005c55] hover:bg-[#004540] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all select-none active:scale-[0.98]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

            </div>

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
            &copy; 2024 MuniFix Ctg. All rights reserved.
          </span>
        </footer>
      </div>

      {/* Floating Success Toast notification in bottom-right corner */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#1e293b] text-white text-xs font-bold px-4.5 py-3 rounded-2xl shadow-xl transition-all duration-300 transform scale-100 select-none animate-fade-in border border-slate-800">
          <div className="w-5 h-5 bg-[#10b981] text-[#1e293b] rounded-full flex items-center justify-center shadow-inner shrink-0">
            <svg className="w-3.5 h-3.5 font-bold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span>Changes saved successfully</span>
        </div>
      )}
    </div>
  );
}
