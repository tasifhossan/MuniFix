"use client";

import React, { ReactNode } from "react";

interface AnalyticsStatsCardProps {
  icon: ReactNode;
  iconBgClass: string;
  badgeText: string;
  badgeClass: string;
  title: string;
  value: string | number;
  footerElement: ReactNode;
}

export default function AnalyticsStatsCard({
  icon,
  iconBgClass,
  badgeText,
  badgeClass,
  title,
  value,
  footerElement,
}: AnalyticsStatsCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm font-sans flex flex-col justify-between h-[155px] flex-1 min-w-[200px]">
      {/* Top row: Icon and Badge */}
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${iconBgClass}`}>
          {icon}
        </div>
        <span className={`inline-flex items-center text-[10px] font-black px-2.5 py-1 rounded-full select-none ${badgeClass}`}>
          {badgeText}
        </span>
      </div>

      {/* Middle row: Title and Value */}
      <div className="mt-2 space-y-0.5">
        <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase select-none">
          {title}
        </span>
        <span className="text-3xl font-black text-slate-850 block tracking-tight select-all leading-none">
          {value}
        </span>
      </div>

      {/* Bottom row: Trend footer */}
      <div className="mt-2 text-[10px] font-extrabold text-slate-500 flex items-center gap-1 select-none">
        {footerElement}
      </div>
    </div>
  );
}
