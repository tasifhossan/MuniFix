"use client";

import React from "react";
import { MoreVertical } from "lucide-react";

interface BarItem {
  label: string;
  count: number;
  maxCount: number;
}

export default function ComplaintsChart() {
  const data: BarItem[] = [
    { label: "Roads", count: 85, maxCount: 100 },
    { label: "Water", count: 62, maxCount: 100 },
    { label: "Waste", count: 78, maxCount: 100 },
    { label: "Power", count: 42, maxCount: 100 },
    { label: "Sanitation", count: 50, maxCount: 100 },
    { label: "Parks", count: 28, maxCount: 100 },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm font-sans flex flex-col justify-between flex-1 min-w-[320px] h-[340px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 select-none">
        <h3 className="text-base font-extrabold text-slate-850">
          Complaints by Department
        </h3>
        <button className="text-slate-400 hover:text-[#005c55] cursor-pointer">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Chart Layout */}
      <div className="relative flex-1 flex flex-col justify-between select-none">
        {/* Horizontal background grid lines */}
        <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
          <div className="border-t border-slate-100 w-full" />
          <div className="border-t border-slate-100 w-full" />
          <div className="border-t border-slate-100 w-full" />
          <div className="border-t border-slate-100 w-full" />
          <div className="border-t border-slate-100 w-full" />
        </div>

        {/* The Bars */}
        <div className="relative z-10 flex-1 flex items-end justify-around px-2 pb-8 h-full">
          {data.map((item, idx) => {
            const pct = (item.count / item.maxCount) * 100;
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer w-10">
                {/* Tooltip on hover */}
                <div className="absolute opacity-0 group-hover:opacity-100 bottom-[80%] bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded transition-opacity duration-200 pointer-events-none z-20 shadow-md">
                  {item.count} complaints
                </div>

                {/* Vertical Bar shape */}
                <div className="w-6 bg-slate-100 rounded-full h-full relative overflow-hidden flex items-end">
                  <div 
                    className="w-full bg-gradient-to-t from-[#005c55]/90 to-[#0d9488]/80 rounded-t-full transition-all duration-700 ease-out" 
                    style={{ height: `${pct}%` }}
                  />
                </div>

                {/* Label below bar */}
                <span className="text-[10px] font-extrabold text-slate-400 block tracking-wider">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
