"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";

export default function IncidentHotspots() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm font-sans flex flex-col justify-between flex-1 min-w-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 select-none">
        <h3 className="text-base font-extrabold text-slate-855">
          Incident Hotspots
        </h3>
        {/* Map Legend */}
        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
            <span>Med</span>
          </div>
        </div>
      </div>

      {/* Map visualizer */}
      <div className="w-full h-56 bg-[#111827] rounded-2xl relative overflow-hidden shrink-0 shadow-inner flex items-center justify-center border border-slate-800">
        
        {/* Real-world dark mode map background generated with AI */}
        <img
          src="/chattogram_map.png"
          alt="Chattogram Map Network"
          className="absolute inset-0 w-full h-full object-cover opacity-45 pointer-events-none select-none transition-opacity duration-300"
        />

        {/* High Hotspot (Red glow) - Concentric rings with smooth radial glow */}
        <div className="absolute top-[52%] left-[60%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center select-none">
          {/* Concentric red animated waves */}
          <span className="absolute inline-flex h-20 w-20 rounded-full bg-red-500/10 animate-ping border border-red-500/20" />
          <span className="absolute inline-flex h-14 w-14 rounded-full bg-red-500/15 border border-red-500/30 blur-[1px]" />
          <span className="absolute inline-flex h-9 w-9 rounded-full bg-red-500/25 border border-red-500/40 blur-[2px]" />
          {/* Main marker icon */}
          <div className="w-4 h-4 bg-red-650 rounded-full border-2 border-white shadow-lg relative flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          </div>
        </div>

        {/* Medium Hotspot 1 (Amber glow) */}
        <div className="absolute top-[40%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center select-none">
          <span className="absolute inline-flex h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/25 blur-[1px]" />
          <span className="absolute inline-flex h-8 w-8 rounded-full bg-amber-500/20 border border-amber-500/35 blur-[2px]" />
          <div className="w-3.5 h-3.5 bg-amber-500 rounded-full border border-white shadow-md flex items-center justify-center">
            <span className="w-1 h-1 bg-white rounded-full" />
          </div>
        </div>

        {/* Medium Hotspot 2 (Amber glow) */}
        <div className="absolute top-[65%] left-[54%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center select-none">
          <span className="absolute inline-flex h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/25 blur-[1px]" />
          <span className="absolute inline-flex h-8 w-8 rounded-full bg-amber-500/20 border border-amber-500/35 blur-[2px]" />
          <div className="w-3.5 h-3.5 bg-amber-500 rounded-full border border-white shadow-md flex items-center justify-center">
            <span className="w-1 h-1 bg-white rounded-full" />
          </div>
        </div>

        {/* Floating Zoom Controls - Left */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 select-none z-10 shadow-lg">
          <button 
            type="button"
            onClick={() => alert("Zooming in...")}
            className="w-8 h-8 bg-slate-900/90 border border-slate-700 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer active:scale-90"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={() => alert("Zooming out...")}
            className="w-8 h-8 bg-slate-900/90 border border-slate-700 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer active:scale-90"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Floating badge bottom right: Live Monitoring Active */}
        <div className="absolute right-4 bottom-4 bg-[#064e3b]/85 border border-[#047857]/50 rounded-full px-3 py-1 flex items-center gap-1.5 select-none z-10 shadow-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[9px] font-black text-emerald-100 uppercase tracking-widest leading-none">
            Live Monitoring Active
          </span>
        </div>

      </div>
    </div>
  );
}
