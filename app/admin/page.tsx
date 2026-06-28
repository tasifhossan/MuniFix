"use client";

import React, { useState } from "react";
import { 
  FileText, 
  ClipboardList, 
  CheckCircle2, 
  Calendar, 
  Filter, 
  Search, 
  Bell 
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import DashboardStatsCard from "@/components/DashboardStatsCard";
import RecentActivityTable from "@/components/RecentActivityTable";

export default function AdminDashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // Recent activity logs matching screenshot parameters
  const activityItems = [
    {
      id: "act-1",
      photo: "/road-pothole.png",
      categoryTitle: "Road Damage",
      categorySubtitle: "Agrabad, Block C",
      citizenName: "Mofizur K.",
      citizenInitials: "MK",
      citizenBgClass: "bg-blue-50 text-blue-700 border border-blue-100",
      priority: "Critical" as const,
      status: "PENDING REVIEW" as const,
    },
    {
      id: "act-2",
      photo: "/clogged-drain.png",
      categoryTitle: "Waste Management",
      categorySubtitle: "Nasirabad Area",
      citizenName: "Sumaiya A.",
      citizenInitials: "SA",
      citizenBgClass: "bg-purple-50 text-purple-750 border border-purple-100",
      priority: "High" as const,
      status: "ASSIGNED" as const,
    },
    {
      id: "act-3",
      photo: "/clogged-drain.png", // reusing clogged drain asset
      categoryTitle: "Street Lighting",
      categorySubtitle: "GEC Circle",
      citizenName: "Rakib H.",
      citizenInitials: "RH",
      citizenBgClass: "bg-slate-100 text-slate-700 border border-slate-200",
      priority: "Medium" as const,
      status: "RESOLVED" as const,
    }
  ];

  // Filtering based on search bar
  const filteredActivity = activityItems.filter((item) =>
    item.categoryTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.citizenName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/30 flex font-sans">
      {/* Sidebar - Admin navigation panel on left */}
      <AdminSidebar activeNav={activeNav} onNavClick={setActiveNav} />

      {/* Main Panel Content Area */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        
        {/* Main Content scrollable wrapper */}
        <main className="px-6 sm:px-8 py-6 space-y-6 flex-1">
          {/* Top Utilities Header bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
            {/* Search Pill */}
            <div className="relative w-full max-w-sm sm:max-w-xs md:max-w-md">
              <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none w-5 h-5 my-auto" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search complaints or citizens..."
                className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 text-xs font-semibold focus:outline-none focus:border-brand-teal bg-white text-gray-800 placeholder-gray-400 shadow-inner"
              />
            </div>

            {/* Profile Avatar and Alerts */}
            <div className="flex items-center justify-between sm:justify-end gap-5">
              <button className="relative p-2 text-slate-400 hover:text-brand-teal hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>

              <div className="hidden sm:block h-6 w-[1px] bg-slate-200" />

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-800 block leading-tight select-none">
                    Aminul Islam
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 block leading-tight select-none mt-0.5">
                    Dept. Administrator
                  </span>
                </div>
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
                    alt="Admin Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Heading Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">
                Department Overview
              </h2>
              <p className="text-gray-550 text-xs font-semibold mt-1.5">
                Real-time status of municipal service requests in Chattogram.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-3 select-none">
              <button className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-650 px-4 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer active:scale-[0.98] shadow-sm">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>This Week</span>
              </button>
              <button className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-650 px-4 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer active:scale-[0.98] shadow-sm">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Department Overview Stats Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardStatsCard
              icon={<FileText className="w-5 h-5" />}
              iconBgClass="bg-teal-50 border-teal-100 text-brand-teal"
              title="Total Complaints"
              value="1,482"
              valueColorClass="text-brand-teal"
              rightLabel={
                <span className="text-xxs sm:text-xs font-black text-emerald-600 tracking-wide select-none">
                  +12% vs last month
                </span>
              }
            />

            <DashboardStatsCard
              icon={<ClipboardList className="w-5 h-5" />}
              iconBgClass="bg-amber-50 border-amber-100/50 text-amber-600"
              title="Pending Review"
              value="84"
              valueColorClass="text-amber-600"
              rightLabel={
                <span className="text-[9px] font-black text-red-650 bg-red-50 border border-red-100/50 rounded-full px-2.5 py-0.5 uppercase tracking-wide select-none">
                  Action Required
                </span>
              }
            />

            <DashboardStatsCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              iconBgClass="bg-blue-50 border-blue-100 text-blue-700"
              title="Resolved This Week"
              value="315"
              valueColorClass="text-blue-700"
              rightLabel={
                <span className="text-xxs sm:text-xs font-black text-emerald-600 tracking-wide select-none">
                  Efficiency 92%
                </span>
              }
            />
          </div>

          {/* Recent Activity Table display */}
          <RecentActivityTable
            items={filteredActivity}
            totalReviews={84}
          />
        </main>

        {/* Global Footer */}
        <footer className="bg-slate-100/50 border-t border-slate-200/60 py-6 px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-4 mt-8">
          <span>&copy; 2024 MuniFix Ctg. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#departments" className="hover:text-brand-teal transition-colors">Departments</a>
            <a href="#privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-brand-teal transition-colors">Terms of Service</a>
            <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-brand-teal transition-colors">
              Chattogram City Corporation
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
}
