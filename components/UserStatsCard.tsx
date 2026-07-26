"use client";

import React, { ReactNode } from "react";

interface UserStatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  footerElement?: ReactNode;
  badgeText?: string;
  badgeClass?: string;
  badgePlacement?: "value" | "icon";
}

export default function UserStatsCard({
  title,
  value,
  icon,
  footerElement,
  badgeText,
  badgeClass,
  badgePlacement = "value",
}: UserStatsCardProps) {
  return (
    <div className="bg-white border border-slate-200/85 rounded-2xl p-5 shadow-sm font-sans flex justify-between items-start h-[105px] flex-1 min-w-[200px]">
      <div className="flex flex-col justify-between h-full">
        <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider select-none block">
          {title}
        </span>
        <div className="space-y-0.5 mt-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-850 tracking-tight select-all block leading-none">
              {value}
            </span>
            {badgeText && badgePlacement === "value" && (
              <span className={`inline-flex items-center text-[9px] font-black px-2 py-0.5 rounded-full select-none ${badgeClass}`}>
                {badgeText}
              </span>
            )}
          </div>
          {footerElement && (
            <div className="text-[10px] font-extrabold text-slate-400 select-none flex items-center gap-1 mt-1 leading-none">
              {footerElement}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between h-full shrink-0">
        {icon && (
          <div className="text-slate-400">
            {icon}
          </div>
        )}
        {badgeText && badgePlacement === "icon" && (
          <span className={`inline-flex items-center text-[9px] font-black px-2 py-0.5 rounded-full select-none ${badgeClass}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
