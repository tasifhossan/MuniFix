"use client";

import React from "react";

interface DashboardStatsCardProps {
  icon: React.ReactNode;
  iconBgClass?: string;
  title: string;
  value: string;
  valueColorClass?: string;
  rightLabel: React.ReactNode;
}

export default function DashboardStatsCard({
  icon,
  iconBgClass = "bg-slate-50 border-slate-100 text-slate-500",
  title,
  value,
  valueColorClass = "text-slate-800",
  rightLabel,
}: DashboardStatsCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm flex flex-col justify-between font-sans relative overflow-hidden flex-1 min-w-[240px]">
      
      {/* Top Header widgets row */}
      <div className="flex items-center justify-between">
        {/* Left Icon badge */}
        <div className={`w-10 h-10 border rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
          {icon}
        </div>
        
        {/* Right Info tag */}
        <div className="select-none">
          {rightLabel}
        </div>
      </div>

      {/* Metric details */}
      <div className="mt-5">
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none">
          {title}
        </span>
        <span className={`text-3xl sm:text-4.5xl font-black mt-2 block tracking-tight leading-none ${valueColorClass}`}>
          {value}
        </span>
      </div>

    </div>
  );
}
