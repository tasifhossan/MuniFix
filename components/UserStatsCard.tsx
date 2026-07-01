"use client";

import React, { ReactNode } from "react";

interface UserStatsCardProps {
  title: string;
  value: string | number;
  footerElement?: ReactNode;
}

export default function UserStatsCard({
  title,
  value,
  footerElement,
}: UserStatsCardProps) {
  return (
    <div className="bg-white border border-slate-200/85 rounded-2xl p-5 shadow-sm font-sans flex flex-col justify-between h-[105px] flex-1 min-w-[200px]">
      <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider select-none block">
        {title}
      </span>
      <div className="space-y-0.5 mt-1">
        <span className="text-2xl font-black text-slate-850 tracking-tight select-all block leading-none">
          {value}
        </span>
        {footerElement && (
          <div className="text-[10px] font-extrabold text-slate-400 select-none flex items-center gap-1 mt-1 leading-none">
            {footerElement}
          </div>
        )}
      </div>
    </div>
  );
}
