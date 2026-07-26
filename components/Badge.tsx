import React from "react";
import { Check } from "lucide-react";

interface BadgeProps {
  type: "priority" | "status";
  value: string;
}

export default function Badge({ type, value }: BadgeProps) {
  const normValue = value.toLowerCase().trim();

  if (type === "priority") {
    switch (normValue) {
      case "critical":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
            Critical
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-250">
            Low
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-gray-100 text-gray-600">
            {value}
          </span>
        );
    }
  }

  // Status indicators
  switch (normValue) {
    case "in progress":
      return (
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 bg-sky-50 border border-sky-100/50">
          <span className="w-2 h-2 rounded-full bg-brand-orange mr-2 animate-pulse" />
          In Progress
        </span>
      );
    case "resolved":
      return (
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100/50">
          <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
          Resolved
        </span>
      );
    case "pending approval":
      return (
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold text-sky-800 bg-sky-100/70 border border-sky-200/50">
          Pending Approval
        </span>
      );
    case "dispatched":
      return (
        <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50/50 px-3 py-1.5 rounded-full border border-emerald-100/50">
          <Check className="w-4 h-4 mr-1.5 stroke-[3px]" />
          Dispatched
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {value}
        </span>
      );
  }
}
