"use client";

import React from "react";
import { ArrowRight, Megaphone } from "lucide-react";

interface EmergencyCalloutProps {
  onReportEmergency?: () => void;
}

export default function EmergencyCallout({ onReportEmergency }: EmergencyCalloutProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#02443d] to-[#04332d] text-white rounded-3xl p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] group h-full min-h-[250px] lg:min-h-0">
      {/* Background Graphic */}
      <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none transform rotate-12 transition-transform group-hover:scale-110 duration-500">
        <Megaphone className="w-40 h-40 fill-current" />
      </div>

      <div className="space-y-3 z-10">
        <h3 className="text-xl font-bold tracking-tight">Need urgent fix?</h3>
        <p className="text-teal-100/90 text-sm leading-relaxed max-w-[240px]">
          Priority reports are processed within 24 hours by the special response team.
        </p>
      </div>

      <div className="z-10 mt-6 sm:mt-8">
        <button
          onClick={onReportEmergency}
          className="w-full flex items-center justify-between bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-3.5 rounded-2xl transition-all duration-300 transform select-none active:scale-[0.98] outline-none shadow-md shadow-amber-500/10 hover:shadow-amber-500/20"
        >
          <span>Report Emergency</span>
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 duration-200" />
        </button>
      </div>
    </div>
  );
}
