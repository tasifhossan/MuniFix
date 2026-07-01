"use client";

import React, { ReactNode } from "react";

interface DepartmentStatsCardProps {
  title: string;
  value: string | number;
  rightElement?: ReactNode;
}

export default function DepartmentStatsCard({
  title,
  value,
  rightElement,
}: DepartmentStatsCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm font-sans flex flex-col justify-between h-[100px] flex-1 min-w-[200px]">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
        {title}
      </span>
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-black text-slate-850 tracking-tight select-all">
          {value}
        </span>
        {rightElement && (
          <div className="flex items-center shrink-0 select-none">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}
