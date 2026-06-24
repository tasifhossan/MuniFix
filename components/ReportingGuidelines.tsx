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
    <div className="bg-indigo-50/20 border border-indigo-150 rounded-3xl p-6 space-y-4">
      <h3 className="text-base font-bold text-gray-805 tracking-tight">
        Reporting Guidelines
      </h3>
      <ul className="space-y-3">
        {guidelines.map((text, i) => (
          <li key={i} className="flex items-start space-x-2.5 text-xs font-semibold text-gray-600">
            <CheckCircle2 className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
