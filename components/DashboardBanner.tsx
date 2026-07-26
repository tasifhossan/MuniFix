"use client";

import React from "react";
import Image from "next/image";
import { PlusCircle } from "lucide-react";

export default function DashboardBanner() {
  return (
    <section className="w-full">
      <div className="bg-[#0b4f45] rounded-3xl p-8 sm:p-12 lg:p-14 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Decorative background light rays */}
        <div className="absolute top-[-40%] left-[-20%] w-[500px] h-[500px] bg-teal-850/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-40%] right-[-20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Left Column - Content */}
        <div className="flex-1 space-y-6 text-left max-w-xl relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Improve Chattogram <br /> Together.
          </h2>
          <p className="text-teal-100/90 text-sm sm:text-base leading-relaxed font-medium">
            Spotted an issue in your neighborhood? Report waterlogging, broken streetlights, or waste management problems directly to the City Corporation.
          </p>
          <button className="inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-brand-orange/10 hover:shadow-brand-orange/20 active:scale-[0.98]">
            <PlusCircle className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            <span>Report an Issue</span>
          </button>
        </div>

        {/* Right Column - Premium Map Card */}
        <div className="w-full lg:w-[460px] shrink-0 relative z-10">
          <div className="bg-white rounded-2xl p-4 shadow-2xl border border-slate-100/10 text-slate-800 flex flex-col gap-4">
            {/* Map image wrapper */}
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-100">
              <Image
                src="/dashboard-map.png"
                alt="City Map Tracker"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Skeleton Loading Simulation */}
            <div className="space-y-2.5 px-1">
              <div className="h-2 w-full bg-slate-100 rounded-full" />
              <div className="h-2 w-3/5 bg-slate-100 rounded-full" />
            </div>
            {/* Bottom details with toggle */}
            <div className="flex items-center justify-between border-t border-slate-50 pt-3 px-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#e6f4ea] text-[#137333] uppercase tracking-wider">
                Live Tracking
              </span>
              {/* Toggle switch simulation */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 p-1 rounded-full">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#fef7e0]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
