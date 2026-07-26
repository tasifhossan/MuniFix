"use client";

import React from "react";
import { Map, MapPin } from "lucide-react";

export default function LocationMap() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm font-sans flex-1 min-w-[280px] space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 select-none">
        <Map className="w-5 h-5 text-[#005c55]" />
        <h3 className="text-base font-extrabold text-slate-850">
          Report Location
        </h3>
      </div>

      {/* Map visualizer */}
      <div className="w-full h-52 bg-slate-100 rounded-2xl border border-slate-150 relative overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
        {/* Mock Map roads and paths using SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Main roads */}
          <path d="M0,30 C30,45 60,15 100,20" fill="none" stroke="#cbd5e1" strokeWidth="3" />
          <path d="M0,65 L100,55" fill="none" stroke="#cbd5e1" strokeWidth="4" />
          {/* Side streets */}
          <path d="M30,0 L25,100" fill="none" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M75,0 Q65,40 85,100" fill="none" stroke="#e2e8f0" strokeWidth="1.8" />
          <path d="M0,85 Q40,75 100,85" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
          {/* Water body */}
          <path d="M0,0 Q20,15 40,0 Z" fill="#e0f2fe" opacity="0.6" />
          {/* Park area */}
          <rect x="50" y="65" width="20" height="25" rx="4" fill="#d1fae5" opacity="0.5" />
        </svg>

        {/* Central green map pin representing the location */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center">
          <span className="absolute inline-flex h-12 w-12 rounded-full bg-[#005c55]/15 animate-ping" />
          <div className="bg-[#005c55] text-white p-2.5 rounded-full shadow-lg border border-white">
            <MapPin className="w-5 h-5 fill-white text-[#005c55]" />
          </div>
        </div>
      </div>
    </div>
  );
}
