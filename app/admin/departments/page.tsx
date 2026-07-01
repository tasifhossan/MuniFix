"use client";

import React, { useState } from "react";
import { Search, Bell, Plus, TrendingUp } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import DepartmentStatsCard from "@/components/DepartmentStatsCard";
import DepartmentTable, { DepartmentItem } from "@/components/DepartmentTable";
import DepartmentLoadBalance from "@/components/DepartmentLoadBalance";
import OperationalGuidelines from "@/components/OperationalGuidelines";

export default function AdminDepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Exact mock data matching the screenshot
  const mockDepartments: DepartmentItem[] = [
    {
      id: "dept-1",
      name: "Water & Sewerage",
      subtitle: "Maintenance & Pipeline",
      iconType: "water",
      iconColorClass: "bg-[#e0f2fe] text-[#0369a1] border border-sky-100",
      headName: "Eng. Ahmed Faruq",
      headAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      totalStaff: 128,
      activeComplaints: 24,
      complaintBadgeColorClass: "bg-[#ffe4e6] text-[#e11d48] border border-rose-100",
    },
    {
      id: "dept-2",
      name: "Public Lighting",
      subtitle: "Street lights & Grid",
      iconType: "light",
      iconColorClass: "bg-[#e0e7ff] text-[#4f46e5] border border-indigo-100",
      headName: "Ms. Tahmina Akter",
      headAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      totalStaff: 45,
      activeComplaints: 8,
      complaintBadgeColorClass: "bg-[#ccfbf1] text-[#0d9488] border border-teal-100",
    },
    {
      id: "dept-3",
      name: "Waste Management",
      subtitle: "Sanitation & Recycling",
      iconType: "waste",
      iconColorClass: "bg-[#fef3c7] text-[#b45309] border border-amber-100",
      headName: "Mr. Rafiqul Islam",
      headAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      totalStaff: 210,
      activeComplaints: 52,
      complaintBadgeColorClass: "bg-[#ffedd5] text-[#d97706] border border-orange-100",
    },
    {
      id: "dept-4",
      name: "Road Engineering",
      subtitle: "Potholes & Pavement",
      iconType: "road",
      iconColorClass: "bg-[#d1fae5] text-[#047857] border border-emerald-100",
      headName: "Nazmun Sakib",
      headInitials: "NS",
      headBgClass: "bg-slate-100 text-slate-650 border border-slate-200",
      totalStaff: 88,
      activeComplaints: 15,
      complaintBadgeColorClass: "bg-[#ffe4e6] text-[#e11d48] border border-rose-100",
    },
  ];

  // Filtering logic
  const filteredDepartments = mockDepartments.filter((dept) => {
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

  return (
    <div className="min-h-screen bg-slate-50/30 flex font-sans">
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
              <button className="inline-flex items-center gap-1.5 bg-[#005c55] hover:bg-[#004540] text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-md shadow-[#005c55]/10 select-none">
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Department</span>
              </button>
            </div>
          </header>

          {/* Main Body Containers */}
          <main className="px-8 py-6 space-y-6 flex-1">
            
            {/* Stats Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <DepartmentStatsCard
                title="Total Departments"
                value={12}
                rightElement={
                  <span className="inline-flex items-center bg-[#ccfbf1] text-[#0d9488] text-[10px] font-black px-2.5 py-0.5 rounded-full select-none">
                    +2 New
                  </span>
                }
              />
              <DepartmentStatsCard
                title="Active Staff"
                value={342}
                rightElement={
                  <span className="text-[10px] font-extrabold text-slate-400 select-none">
                    Total 12 Units
                  </span>
                }
              />
              <DepartmentStatsCard
                title="Pending Tasks"
                value={87}
                rightElement={
                  <span className="inline-flex items-center text-red-500 text-[10px] font-extrabold gap-0.5 select-none">
                    <svg className="w-3 h-3 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    ~14%
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

            {/* Active Departments Table */}
            <DepartmentTable
              items={filteredDepartments}
              onEdit={(item) => alert(`Editing department: ${item.name}`)}
              onDelete={(item) => alert(`Deleting department: ${item.name}`)}
            />

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
