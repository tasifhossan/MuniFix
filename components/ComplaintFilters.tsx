"use client";

import React from "react";
import { Calendar, ChevronDown } from "lucide-react";

interface ComplaintFiltersProps {
  category: string;
  setCategory: (val: string) => void;
  priority: string;
  setPriority: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  dateRange: string;
  setDateRange: (val: string) => void;
  onReset: () => void;
}

export default function ComplaintFilters({
  category,
  setCategory,
  priority,
  setPriority,
  status,
  setStatus,
  dateRange,
  setDateRange,
  onReset,
}: ComplaintFiltersProps) {
  return (
    <div className="w-full bg-[#f8fafc]/50 rounded-2xl border border-slate-200/80 p-5 shadow-sm font-sans flex flex-wrap items-end gap-5">
      
      {/* Category Select */}
      <div className="flex-1 min-w-[150px] space-y-1.5">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
          Category
        </label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] appearance-none cursor-pointer transition-all shadow-sm"
          >
            <option value="All">All Categories</option>
            <option value="Road Maintenance">Road Maintenance</option>
            <option value="Waste Management">Waste Management</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Street Lighting">Street Lighting</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Priority Select */}
      <div className="flex-1 min-w-[150px] space-y-1.5">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
          Priority
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
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Status Select */}
      <div className="flex-1 min-w-[150px] space-y-1.5">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
          Status
        </label>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] appearance-none cursor-pointer transition-all shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Assigned">Assigned</option>
            <option value="Resolved">Resolved</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="flex-1 min-w-[200px] space-y-1.5">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
          Date Range
        </label>
        <div className="relative">
          <Calendar className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none w-5 h-5 my-auto" />
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            placeholder="Select date range"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-250/70 hover:bg-slate-100/50 focus:bg-white text-sm font-semibold text-slate-700 rounded-xl focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] transition-all cursor-pointer shadow-inner"
          />
        </div>
      </div>

      {/* Reset Filters Button */}
      <button
        type="button"
        onClick={onReset}
        className="h-[42px] px-4 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#005c55] hover:text-[#004540] hover:bg-slate-50 active:scale-[0.98] transition-all rounded-xl select-none cursor-pointer shrink-0"
      >
        {/* Custom Reset Sliders Icon */}
        <svg className="w-4 h-4 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
          {/* Diagonal Slash for Reset */}
          <line x1="3" y1="3" x2="21" y2="21" stroke="#ef4444" strokeWidth="2.5" />
        </svg>
        <span>Reset Filters</span>
      </button>

    </div>
  );
}
