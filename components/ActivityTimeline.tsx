"use client";

import React from "react";
import { Check, Clock } from "lucide-react";

export default function ActivityTimeline() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm font-sans flex-1 min-w-[280px] space-y-5">
      {/* Header */}
      <h3 className="text-base font-extrabold text-slate-850 select-none">
        Activity Timeline
      </h3>

      {/* Timeline List */}
      <div className="relative pl-8 space-y-6 select-none">
        {/* Connector vertical line */}
        <div className="absolute left-[13px] top-6 bottom-3 w-[2px] bg-slate-200" />

        {/* Step 1 */}
        <div className="relative">
          {/* Circle Icon */}
          <div className="absolute -left-[30px] top-0.5 w-6.5 h-6.5 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-sm">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-850 block leading-tight">
              Submitted
            </span>
            <span className="text-xs text-slate-400 font-semibold block mt-1">
              Oct 15, 2024 &bull; 09:42 AM
            </span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative">
          {/* Circle Icon */}
          <div className="absolute -left-[30px] top-0.5 w-6.5 h-6.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-500 block leading-tight">
              Pending Department Assignment
            </span>
            <span className="text-xs text-slate-400 font-semibold block mt-1">
              Expected in 24 hours
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
