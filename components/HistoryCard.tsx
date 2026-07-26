"use client";

import React from "react";
import { History } from "lucide-react";

export default function HistoryCard() {
  return (
    <button className="bg-[#eff6ff]/30 hover:bg-[#eff6ff]/60 border-2 border-dashed border-blue-200/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[300px] h-full transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-teal/40">
      {/* Icon container */}
      <div className="w-14 h-14 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
        <History className="w-6 h-6 text-blue-600 stroke-[2]" />
      </div>
      
      {/* Text details */}
      <div className="space-y-1.5 max-w-[240px]">
        <h3 className="text-base font-bold text-slate-800 group-hover:text-brand-teal transition-colors">
          View Report History
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
          Access all your 12 previous submissions and their full timelines.
        </p>
      </div>
    </button>
  );
}
