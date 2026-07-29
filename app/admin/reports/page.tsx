"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  UserCheck, 
  RefreshCw, 
  LogIn, 
  AlertTriangle, 
  ChevronDown, 
  Calendar, 
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import UserStatsCard from "@/components/UserStatsCard";

export default function SystemActivityLogPage() {
  const [activeNav, setActiveNav] = useState("reports");
  const [searchTerm, setSearchTerm] = useState("");
  const [eventType, setEventType] = useState("All");
  const [dateRange, setDateRange] = useState("Oct 20, 2024 - Oct 27, 2024");

  // TODO: backend endpoint not implemented yet

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar - link active to reports, hide permissions and departments */}
      <AdminSidebar 
        activeNav={activeNav} 
        onNavClick={setActiveNav} 
        hidePermissions={true}
        hideDepartments={true}
        settingsPlacement="top"
        newReportPlacement="bottom"
      />

      {/* Main panel */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          {/* Header - customized log style, breadcrumbs */}
          <AdminHeader
            variant="logs"
            title="System Activity Log"
            userRole="Rahat Hossain"
            userSubtitle="City Admin"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Main Container */}
          <main className="px-8 py-6 space-y-6 flex-1">
            
            {/* Filter Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-wrap items-end gap-5 select-none">
              
              {/* Event Type Select */}
              <div className="flex-1 min-w-[200px] space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Event Type
                </label>
                <div className="relative">
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] appearance-none cursor-pointer transition-all shadow-sm"
                  >
                    <option value="All">All Activities</option>
                    <option value="Assignment">Worker Assignments</option>
                    <option value="Status">Status Changes</option>
                    <option value="Login">User Logins</option>
                    <option value="Escalation">Critical Escalations</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Date Range Picker */}
              <div className="flex-1 min-w-[200px] space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Date Range
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    placeholder="Select Date Range"
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-750 placeholder-slate-400 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] appearance-none cursor-pointer transition-all shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                type="button"
                onClick={() => alert("Applying logs search filters...")}
                className="h-[43px] inline-flex items-center gap-2 bg-[#005c55] hover:bg-[#004540] text-white text-sm font-bold px-6 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-sm select-none shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4 text-white" />
                <span>Apply Filters</span>
              </button>

            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 select-none">
              
              {/* Total Events Stats Card */}
              <UserStatsCard
                title="Total Events Today"
                value="1,284"
                icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
                badgeText="+12%"
                badgeClass="bg-emerald-50 text-emerald-700 border border-emerald-100/50"
                badgePlacement="value"
              />

              {/* Assignments Made Stats Card */}
              <UserStatsCard
                title="Assignments Made"
                value="42"
                icon={<Users className="w-5 h-5 text-amber-600" />}
              />

              {/* Failed Logins Stats Card */}
              <UserStatsCard
                title="Failed Logins"
                value="08"
                icon={<ShieldCheck className="w-5 h-5 text-indigo-650" />}
                badgeText="3 Alerts"
                badgeClass="bg-red-50 text-red-650 border border-red-100/50"
                badgePlacement="icon"
              />

            </div>

            {/* Recent Activity Timeline Feed */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between p-6">
              
              {/* Feed Header */}
              <div className="pb-6 flex items-center justify-between border-b border-slate-100 select-none">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  Recent Activity
                </h2>
                <a
                  href="#export-csv"
                  onClick={(e) => { e.preventDefault(); alert("Exporting system logs as CSV..."); }}
                  className="text-xs font-bold text-[#005c55] hover:underline"
                >
                  Export as CSV
                </a>
              </div>

              {/* Timeline Container */}
              <div className="relative pl-12 space-y-8 py-6">
                
                {/* Vertical connecting line */}
                <div className="absolute left-[18px] top-8 bottom-8 w-[2px] bg-slate-100" />

                {/* Timeline Item 1: Worker Assigned */}
                <div className="relative flex items-start gap-4">
                  {/* Left Circle Icon */}
                  <div className="absolute -left-[44px] top-0 w-8.5 h-8.5 rounded-full bg-[#e6f4f2] text-[#005c55] border border-teal-100/60 flex items-center justify-center shadow-sm select-none">
                    <UserCheck className="w-4.5 h-4.5" />
                  </div>
                  {/* Content body */}
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-extrabold text-slate-805">
                        Worker Assigned
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 select-none shrink-0">
                        2 mins ago
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 leading-normal">
                      <span className="font-extrabold text-slate-800">Admin_Sharif</span> assigned{" "}
                      <span className="font-extrabold text-slate-800">Field Worker Karim</span> to Case{" "}
                      <span className="font-extrabold text-slate-800">#2024-8812 (Waste Management)</span>.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 select-none pt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-[#e2f2f0] text-[#0f766e]">
                        In Progress
                      </span>
                      <span className="text-[10px] font-extrabold text-slate-400">
                        &bull; Priority: High
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 2: Status Change */}
                <div className="relative flex items-start gap-4">
                  {/* Left Circle Icon */}
                  <div className="absolute -left-[44px] top-0 w-8.5 h-8.5 rounded-full bg-[#fef3c7] text-[#b45309] border border-amber-100/60 flex items-center justify-center shadow-sm select-none">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  {/* Content body */}
                  <div className="flex-1 space-y-3 pt-0.5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-extrabold text-slate-805">
                        Status Change
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 select-none shrink-0">
                        45 mins ago
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 leading-normal">
                      System automated update: Case{" "}
                      <span className="font-extrabold text-slate-800">#2024-8790</span> moved from{" "}
                      <span className="italic text-slate-500 line-through">Reported</span> to{" "}
                      <span className="font-extrabold text-slate-800">Resolved</span> following citizen verification.
                    </p>
                    {/* Embedded photo section */}
                    <div className="bg-[#eff6ff]/70 border border-[#dbeafe] rounded-2xl p-3 flex items-center gap-3.5 max-w-md shadow-inner select-none">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-blue-100 shadow-sm bg-white">
                        <img 
                          src="/water.png" 
                          alt="Resolution" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-extrabold text-[#1d4ed8]">
                        Resolution photo attached by City Corp Team
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 3: User Login */}
                <div className="relative flex items-start gap-4">
                  {/* Left Circle Icon */}
                  <div className="absolute -left-[44px] top-0 w-8.5 h-8.5 rounded-full bg-[#e0f2fe] text-[#0369a1] border border-sky-100/60 flex items-center justify-center shadow-sm select-none">
                    <LogIn className="w-4 h-4" />
                  </div>
                  {/* Content body */}
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-extrabold text-slate-805">
                        User Login
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 select-none shrink-0">
                        1 hour ago
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 leading-normal">
                      <span className="font-extrabold text-slate-800">Rahat Hossain (Admin)</span> logged in from IP{" "}
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-150 select-all font-bold">
                        103.145.21.14
                      </span>{" "}
                      using Chrome Desktop (Windows).
                    </p>
                    <div className="flex items-center gap-1 select-none pt-1">
                      <span className="w-4.5 h-4.5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner shrink-0 border border-emerald-100/50">
                        <svg className="w-2.5 h-2.5 font-bold" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wide">
                        MFA Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 4: Critical Escalation */}
                <div className="relative flex items-start gap-4">
                  {/* Left Circle Icon */}
                  <div className="absolute -left-[44px] top-0 w-8.5 h-8.5 rounded-full bg-[#ffe4e6] text-[#e11d48] border border-red-100/60 flex items-center justify-center shadow-sm select-none">
                    <AlertTriangle className="w-4.5 h-4.5" />
                  </div>
                  {/* Content body */}
                  <div className="flex-1 space-y-3.5 pt-0.5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-extrabold text-slate-805">
                        Critical Escalation
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 select-none shrink-0">
                        3 hours ago
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 leading-normal">
                      Case <span className="font-extrabold text-slate-800">#2024-8711 (Broken Water Main)</span> escalated to{" "}
                      <span className="font-extrabold text-[#e11d48]">Critical</span> after 4 hours without response from Zonal Office 04.
                    </p>
                    <button
                      onClick={() => alert("Reviewing escalation path case details...")}
                      className="bg-white border border-slate-205 hover:bg-slate-50 text-slate-700 text-[10px] font-extrabold px-3.5 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer active:scale-[0.98] select-none"
                    >
                      Review Escalation Path
                    </button>
                  </div>
                </div>

              </div>

              {/* Load More Button */}
              <div className="border-t border-slate-100 pt-5 flex justify-center">
                <button
                  onClick={() => alert("Loading older system activity logs...")}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-[#005c55] hover:text-[#004540] transition-colors cursor-pointer select-none"
                >
                  <span>Load More Activities</span>
                  <ChevronDown className="w-4 h-4 text-current mt-0.5" />
                </button>
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
            &copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}
