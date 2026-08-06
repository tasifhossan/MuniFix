"use client";

import React from "react";
import { Users, MessageSquare } from "lucide-react";

interface ComplaintMetricsProps {
  citizensImpacted?: string;
  communityEngagement?: string;
}

export default function ComplaintMetrics({
  citizensImpacted = "Pending",
  communityEngagement = "0 interactions",
}: ComplaintMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

      {/* Citizens Impacted Card */}
      <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4 flex items-center space-x-3.5">
        <div className="p-2.5 bg-teal-100 text-brand-teal rounded-xl shrink-0">
          <Users className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
            Citizens Impacted
          </span>
          <p className={`text-sm font-black mt-0.5 ${citizensImpacted === "Pending" ? "text-gray-400 italic" : "text-gray-800"}`}>
            {citizensImpacted}
          </p>
        </div>
      </div>

      {/* Community Engagement Card */}
      <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4 flex items-center space-x-3.5">
        <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl shrink-0">
          <MessageSquare className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
            Engagement
          </span>
          <p className="text-sm font-black text-gray-800 mt-0.5">
            {communityEngagement}
          </p>
        </div>
      </div>
    </div>
  );
}
