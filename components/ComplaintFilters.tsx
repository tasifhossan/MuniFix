"use client";

import React from "react";
import { Building, Flag, AlertTriangle, Calendar, SlidersHorizontal, Download } from "lucide-react";

interface ComplaintFiltersProps {
  department: string;
  setDepartment: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  priority: string;
  setPriority: (val: string) => void;
  dateRange: string;
  setDateRange: (val: string) => void;
  onApply?: () => void;
  onExport?: () => void;
}

export default function ComplaintFilters({
  department,
  setDepartment,
  status,
  setStatus,
  priority,
  setPriority,
  dateRange,
  setDateRange,
  onApply,
  onExport,
}: ComplaintFiltersProps) {
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-6 shadow-sm font-sans space-y-6">
      
      {/* 4-column dropdown grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Department Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>Department</span>
          </label>
          <div className="relative">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] appearance-none cursor-pointer transition-all shadow-sm"
            >
              <option value="All">All Departments</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Waste Mgmt">Waste Mgmt</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Public Safety">Public Safety</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
            <Flag className="w-3.5 h-3.5 text-slate-400" />
            <span>Status</span>
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] appearance-none cursor-pointer transition-all shadow-sm"
            >
              <option value="All">Any Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Assigned">Assigned</option>
              <option value="Resolved">Resolved</option>
              <option value="Under Review">Under Review</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Priority Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
            <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
            <span>Priority</span>
          </label>
          <div className="relative">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] appearance-none cursor-pointer transition-all shadow-sm"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Date Range</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              placeholder="Select dates..."
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] appearance-none cursor-pointer transition-all shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* Filter Actions row */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onApply}
          className="inline-flex items-center gap-2 bg-[#005c55] hover:bg-[#004540] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-sm select-none"
        >
          <SlidersHorizontal className="w-4 h-4 text-white" />
          <span>Apply Filters</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 bg-white border border-[#005c55] hover:bg-teal-55/20 text-[#005c55] text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-sm select-none"
        >
          <Download className="w-4 h-4 text-[#005c55]" />
          <span>Export Data</span>
        </button>
      </div>

    </div>
  );
}
