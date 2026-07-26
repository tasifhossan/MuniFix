"use client";

import React from "react";
import { AlertTriangle, Info, CheckCircle, Droplet, Trash, Zap } from "lucide-react";

interface ActivityLogItem {
  id: string;
  title: string;
  subtitle: string;
  leftStripClass: string;
  icon: React.ReactNode;
  badges: Array<{
    label: string;
    styleClass: string;
  }>;
}

export default function CriticalActivityLog() {
  const activities: ActivityLogItem[] = [
    {
      id: "act-1",
      title: "Major Water Main Break - Agrabad Access Rd",
      subtitle: "Reported by: Citizen #4122 • 12 mins ago",
      leftStripClass: "bg-red-500",
      icon: <AlertTriangle className="w-4.5 h-4.5 text-red-500" />,
      badges: [
        { label: "High Priority", styleClass: "bg-red-50 text-red-600 border border-red-100/50" },
        { label: "Water Dept", styleClass: "bg-slate-100 text-slate-650 border border-slate-200/50" },
      ],
    },
    {
      id: "act-2",
      title: "Waste Accumulation - Lalkhan Bazar",
      subtitle: "Reported by: Health Inspector • 1 hour ago",
      leftStripClass: "bg-amber-500",
      icon: <Trash className="w-4.5 h-4.5 text-amber-500" />,
      badges: [
        { label: "Moderate", styleClass: "bg-amber-50 text-amber-600 border border-amber-100/50" },
        { label: "Waste Mgmt", styleClass: "bg-slate-100 text-slate-650 border border-slate-200/50" },
      ],
    },
    {
      id: "act-3",
      title: "Street Light Restored - GEC Circle",
      subtitle: "Resolved by: Electrical Team B • 3 hours ago",
      leftStripClass: "bg-emerald-500",
      icon: <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />,
      badges: [
        { label: "Completed", styleClass: "bg-emerald-50 text-emerald-600 border border-emerald-100/50" },
        { label: "Power Dept", styleClass: "bg-slate-100 text-slate-650 border border-slate-200/50" },
      ],
    },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm font-sans flex flex-col justify-between flex-1 min-w-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 select-none">
        <h3 className="text-base font-extrabold text-slate-850">
          Critical Activity
        </h3>
        <a 
          href="#logs" 
          onClick={(e) => { e.preventDefault(); alert("Viewing all logs..."); }} 
          className="text-[#005c55] hover:underline font-bold text-xs"
        >
          View all log
        </a>
      </div>

      {/* Log Feed */}
      <div className="space-y-4">
        {activities.map((item) => (
          <div 
            key={item.id}
            className="relative flex items-start gap-4 p-4 border border-slate-150/60 rounded-2xl bg-white shadow-sm overflow-hidden"
          >
            {/* Sidebar thick colored strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.leftStripClass}`} />

            {/* Icon */}
            <div className="p-1 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
              {item.icon}
            </div>

            {/* Log details */}
            <div className="flex-1 space-y-2">
              <div>
                <span className="text-sm font-extrabold text-slate-850 block leading-tight select-all">
                  {item.title}
                </span>
                <span className="text-xs text-slate-400 font-semibold block mt-1.5 select-none">
                  {item.subtitle}
                </span>
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap gap-2 select-none">
                {item.badges.map((badge, bIdx) => (
                  <span 
                    key={bIdx}
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${badge.styleClass}`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
