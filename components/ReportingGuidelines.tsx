"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function ReportingGuidelines() {
  const guidelines = [
    "One issue per report",
    "Ensure lighting is adequate in photos",
    "Avoid including personal identity in photos"
  ];

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4">
      <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">
        Reporting Guidelines
      </h3>
      <ul className="space-y-3">
        {guidelines.map((text, i) => (
          <li key={i} className="flex items-start space-x-2.5 text-xs font-bold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
