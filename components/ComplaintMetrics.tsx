"use client";

import React from "react";
import { Clock, Users } from "lucide-react";

interface ComplaintMetricsProps {
  responseTime?: string;
  citizensImpacted?: string;
}

export default function ComplaintMetrics({
  responseTime = "Pending",
  citizensImpacted = "Pending"
}: ComplaintMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Response Time Card */}
      <div className="bg-slate-50 border border-gray-150 rounded-2xl p-5 flex items-center space-x-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
          <Clock className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
            Response Time
          </span>
          <p className="text-lg font-black text-gray-800 mt-0.5">
            {responseTime}
          </p>
        </div>
      </div>

      {/* Citizens Impacted Card */}
      <div className="bg-slate-50 border border-gray-150 rounded-2xl p-5 flex items-center space-x-4">
        <div className="p-3 bg-teal-100 text-brand-teal rounded-xl shrink-0">
          <Users className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
            Citizens Impacted
          </span>
          <p className="text-lg font-black text-gray-800 mt-0.5">
            {citizensImpacted}
          </p>
        </div>
      </div>
    </div>
  );
}
