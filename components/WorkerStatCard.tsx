"use client";

import React from "react";

interface WorkerStatCardProps {
  label: string;
  value: string;
  subtext?: React.ReactNode;
  icon?: React.ReactNode;
  borderClass?: string; // e.g. "border-t-brand-teal"
  iconBgClass?: string;  // e.g. "bg-teal-50 text-brand-teal"
}

export default function WorkerStatCard({
  label,
  value,
  subtext,
  icon,
  borderClass = "border-t-brand-teal",
  iconBgClass = "bg-teal-50 text-brand-teal",
}: WorkerStatCardProps) {
  return (
    <div className={`w-full bg-white rounded-3xl p-6 border border-slate-150 border-t-[5px] ${borderClass} shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center relative overflow-hidden font-sans`}>
      {/* Metrics Content */}
      <div className="space-y-1">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
          {label}
        </span>
        <span className="text-3xl font-extrabold text-gray-900 leading-none tracking-tight block">
          {value}
        </span>
        {subtext && (
          <div className="pt-1.5 block">
            {subtext}
          </div>
        )}
      </div>

      {/* Metric Icon Badge */}
      {icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
          {icon}
        </div>
      )}
    </div>
  );
}
