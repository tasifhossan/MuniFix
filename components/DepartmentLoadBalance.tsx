"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

export interface LoadBalanceItem {
  id: string;
  name: string;
  capacity: number; // e.g. 82
  colorClass: string; // e.g. bg-[#005c55]
}

interface DepartmentLoadBalanceProps {
  items?: LoadBalanceItem[];
}

export default function DepartmentLoadBalance({ items }: DepartmentLoadBalanceProps) {
  // Default values matching the screenshot
  const defaultItems: LoadBalanceItem[] = [
    { id: "lb-1", name: "Water & Sewerage", capacity: 82, colorClass: "bg-[#005c55]" },
    { id: "lb-2", name: "Waste Management", capacity: 45, colorClass: "bg-[#1d4ed8]" },
    { id: "lb-3", name: "Public Lighting", capacity: 95, colorClass: "bg-[#dc2626]" },
  ];

  const displayItems = items || defaultItems;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm font-sans flex-1 min-w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 select-none">
        <h3 className="text-base font-extrabold text-slate-850">
          Departmental Load Balance
        </h3>
        <TrendingUp className="w-5 h-5 text-emerald-500" />
      </div>

      {/* Progress list */}
      <div className="space-y-5">
        {displayItems.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span className="select-none">{item.name}</span>
              <span className="select-all">{item.capacity}% Capacity</span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${item.colorClass}`}
                style={{ width: `${item.capacity}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
