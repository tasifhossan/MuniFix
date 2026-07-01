"use client";

import React from "react";

export default function StatusDistribution() {
  // SVG Donut circle parameters
  const radius = 55;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~345.57

  // Data values: Resolved (70%), In Progress (18%), Assigned (7%), Pending (5%)
  const data = [
    { label: "Resolved", percentage: 70, color: "#10b981", bgClass: "bg-emerald-500" },
    { label: "In Progress", percentage: 18, color: "#f59e0b", bgClass: "bg-amber-500" },
    { label: "Assigned", percentage: 7, color: "#1d4ed8", bgClass: "bg-[#1d4ed8]" },
    { label: "Pending", percentage: 5, color: "#94a3b8", bgClass: "bg-slate-400" },
  ];

  // Compute stroke offsets consecutively
  let currentOffset = 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm font-sans flex flex-col justify-between items-center w-full lg:w-72 h-[340px] shrink-0">
      {/* Title Header */}
      <div className="w-full text-left pb-4 select-none">
        <h3 className="text-base font-extrabold text-slate-850">
          Status Distribution
        </h3>
      </div>

      {/* SVG Donut Chart */}
      <div className="relative w-36 h-36 flex items-center justify-center select-none">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          {/* Base circle background */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Colored donut segments */}
          {data.map((item, idx) => {
            const strokeLength = (item.percentage / 100) * circumference;
            const offset = currentOffset;
            currentOffset += strokeLength;
            return (
              <circle
                key={idx}
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-in-out"
              />
            );
          })}
        </svg>

        {/* Center Text labels */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-slate-900 leading-none">
            100%
          </span>
          <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider mt-1 block">
            Compliance
          </span>
        </div>
      </div>

      {/* Legends layout grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 w-full mt-4 border-t border-slate-100 pt-4 select-none">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.bgClass}`} />
              <span className="text-[10px] font-bold text-slate-400 block tracking-wide select-none">
                {item.label}
              </span>
            </div>
            <span className="text-sm font-extrabold text-slate-805 block pl-4 select-all">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
