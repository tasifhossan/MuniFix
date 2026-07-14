"use client";

import React from "react";

interface DashboardStatCardProps {
  label: string;
  value: string;
  suffix?: React.ReactNode;
  accentBorder?: boolean;
  children?: React.ReactNode;
}

export default function DashboardStatCard({
  label,
  value,
  suffix,
  accentBorder = false,
  children
}: DashboardStatCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-150 shadow-sm flex flex-col justify-between min-h-[115px] ${accentBorder ? "border-l-[4px] border-l-brand-teal pl-5" : ""}`}>
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3.5xl font-black text-slate-900 tracking-tight">{value}</span>
          {suffix && <span>{suffix}</span>}
        </div>
      </div>
      {children && <div className="mt-2 w-full">{children}</div>}
    </div>
  );
}
