"use client";

import React from "react";
import { Search, Bell } from "lucide-react";

interface WorkerHeaderProps {
  zoneName?: string;
  technicianName?: string;
  technicianId?: string;
  technicianAvatar?: string;
}

export default function WorkerHeader({
  zoneName = "Online: Chattogram Zone 04",
  technicianName = "Abul Hossain",
  technicianId = "Technician ID #2044",
  technicianAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
}: WorkerHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between py-6 gap-4 border-b border-slate-200/60 font-sans">
      {/* Title & Online Zone Status */}
      <div className="flex flex-wrap items-center gap-3.5">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">
          Field Worker Dashboard
        </h1>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100/50 shadow-inner">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {zoneName}
        </span>
      </div>

      {/* Utilities & Profile */}
      <div className="flex items-center justify-between sm:justify-end gap-6">
        <div className="flex items-center gap-4">
          {/* Search Toggle */}
          <button className="p-2 text-slate-400 hover:text-brand-teal hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Alerts */}
          <button className="relative p-2 text-slate-400 hover:text-brand-teal hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>
        </div>

        {/* Profile Details */}
        <div className="flex items-center gap-4.5 pl-2 border-l border-slate-200">
          <div className="text-right">
            <span className="text-sm font-bold text-gray-800 tracking-tight block leading-tight">
              {technicianName}
            </span>
            <span className="text-[10px] font-black text-gray-400 block -mt-0.5 tracking-wider">
              {technicianId}
            </span>
          </div>

          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm hover:scale-105 transition-transform duration-300">
            <img
              src={technicianAvatar}
              alt={technicianName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
