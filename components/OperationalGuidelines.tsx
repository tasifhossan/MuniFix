"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

interface OperationalGuidelinesProps {
  onViewProtocols?: () => void;
}

export default function OperationalGuidelines({ onViewProtocols }: OperationalGuidelinesProps) {
  return (
    <div className="bg-[#f0f9ff]/70 border border-sky-100 rounded-3xl p-6 shadow-sm font-sans flex-1 min-w-[280px] flex flex-col justify-between">
      {/* Content Section */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-850 select-none">
          Operational Guidelines
        </h3>
        <p className="text-sm text-slate-600 font-semibold leading-relaxed">
          Ensure all departmental heads review the updated 2024 municipal transparency protocols by Friday.
        </p>
      </div>

      {/* Button CTA */}
      <div className="pt-5 select-none">
        <button
          onClick={onViewProtocols}
          className="inline-flex items-center gap-2 bg-[#e0e7ff] hover:bg-[#c7d2fe] text-[#312e81] text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
        >
          <ShieldCheck className="w-4 h-4 text-[#4f46e5]" />
          <span>View Protocols</span>
        </button>
      </div>
    </div>
  );
}
