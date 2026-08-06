"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navigation, Sparkles, AlertTriangle, ArrowLeft, Loader2, Info, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const TrafficMap = dynamic(() => import("@/components/TrafficMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-slate-100 rounded-3xl border border-gray-150 flex items-center justify-center animate-pulse">
      <p className="text-gray-400 text-xs font-bold font-sans">Loading AI Routing Engine...</p>
    </div>
  )
});

const SCENARIOS = [
  {
    id: "sc-1",
    name: "GEC Circle - Severe Waterlogging",
    blockLat: 22.3592,
    blockLng: 91.8152,
    startLat: 22.3487,
    startLng: 91.8192, // Lalkhan Bazar
    endLat: 22.3687,
    endLng: 91.8252, // 2 Gate
    redRoute: [
      [22.3487, 91.8192],
      [22.3592, 91.8152],
      [22.3687, 91.8252]
    ] as [number, number][],
    greenRoute: [
      [22.3487, 91.8192],
      [22.3510, 91.8100],
      [22.3550, 91.8020],
      [22.3620, 91.8080],
      [22.3687, 91.8252]
    ] as [number, number][],
    blockReason: "Water depth is 1.2 meters at GEC intersection. Entire circle is closed for traffic.",
    originalDuration: "45 mins",
    bypassDuration: "12 mins",
    distanceDiff: "+1.4 km",
    description: "Gemini AI bypassed the flooded GEC Circle by routing through Tiger Pass and Khulshi Residential Area. Alternate route is fully dry, has average traffic flow, and saves ~33 minutes.",
  },
  {
    id: "sc-2",
    name: "Panchlaish Road - Active Construction",
    blockLat: 22.3630,
    blockLng: 91.8280,
    startLat: 22.3592,
    startLng: 91.8152, // GEC Circle
    endLat: 22.3670,
    endLng: 91.8410, // Bahaddarhat
    redRoute: [
      [22.3592, 91.8152],
      [22.3630, 91.8280],
      [22.3670, 91.8410]
    ] as [number, number][],
    greenRoute: [
      [22.3592, 91.8152],
      [22.3530, 91.8310],
      [22.3580, 91.8380],
      [22.3670, 91.8410]
    ] as [number, number][],
    blockReason: "Road excavation and sewer pipe laying works by WASA near Panchlaish Police Station.",
    originalDuration: "35 mins",
    bypassDuration: "14 mins",
    distanceDiff: "+0.8 km",
    description: "Gemini AI detected heavy congestion due to WASA construction at Panchlaish. The route is re-calculated through Chawkbazar Sub-Roads and Sholosahar Bypass to ensure continuous movement.",
  }
];

export default function SmartRoutingPage() {
  const { user } = useAuth();
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
  const [calculating, setCalculating] = useState(false);

  const handleScenarioChange = (scenario: typeof SCENARIOS[0]) => {
    setCalculating(true);
    setTimeout(() => {
      setActiveScenario(scenario);
      setCalculating(false);
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar activeNav="dashboard" isDashboard />

      {/* Main Container */}
      <div className="flex flex-col md:flex-row flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Content Area */}
        <main className="flex-1 space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight flex items-center gap-2">
                <Navigation className="w-8 h-8 text-[#005c55]" />
                AI Smart Traffic & Route Assist
              </h1>
              <p className="text-gray-500 text-sm font-semibold mt-1">
                Real-time roadblock updates and AI-driven detour route planning.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-brand-teal transition-colors uppercase tracking-wider gap-1.5 shrink-0"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              Back to Dashboard
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Console Panel (5/12 width) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Active Roadblocks List */}
              <div className="bg-white rounded-3xl border border-gray-150 p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Active City Roadblocks</h3>
                <div className="space-y-3">
                  {SCENARIOS.map((s) => {
                    const isActive = s.id === activeScenario.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => handleScenarioChange(s)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                          isActive
                            ? "bg-rose-50/20 border-rose-200 ring-1 ring-rose-500/5 shadow-xs"
                            : "bg-white border-gray-150 hover:bg-slate-50/80"
                        }`}
                      >
                        <div className="p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0 mt-0.5 border border-rose-100">
                          <AlertTriangle className="w-4.5 h-4.5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-gray-800 leading-tight">{s.name}</h4>
                          <p className="text-[10px] text-gray-500 font-semibold line-clamp-2 leading-relaxed">
                            {s.blockReason}
                          </p>
                          {isActive && (
                            <span className="inline-block text-[8px] font-black uppercase bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded border border-rose-200 mt-1">
                              Selected Scenario
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Routing Analysis panel */}
              <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-brand-teal">
                      <Sparkles className="w-5 h-5 text-brand-teal animate-pulse" />
                      <h3 className="text-xs font-black uppercase tracking-wider">Gemini AI Path Optimizer</h3>
                    </div>
                    {calculating ? (
                      <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                        <Loader2 className="w-3 h-3 animate-spin text-brand-teal" />
                        Recalculating...
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                        Route Optimised
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 pt-2 text-[10px] font-bold">
                    <div className="p-2.5 bg-rose-50/20 border border-rose-100 rounded-xl space-y-1">
                      <span className="text-[8px] font-black text-rose-600 uppercase tracking-wider block">Blocked ETA</span>
                      <div className="flex items-center gap-1 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-rose-500" />
                        <span>{activeScenario.originalDuration}</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-emerald-50/20 border border-emerald-100 rounded-xl space-y-1">
                      <span className="text-[8px] font-black text-emerald-600 uppercase tracking-wider block">AI Bypass ETA</span>
                      <div className="flex items-center gap-1 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{activeScenario.bypassDuration}</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-blue-50/20 border border-blue-100 rounded-xl space-y-1">
                      <span className="text-[8px] font-black text-blue-600 uppercase tracking-wider block">Distance Diff</span>
                      <div className="flex items-center gap-1 text-slate-700">
                        <span>{activeScenario.distanceDiff}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-50 space-y-2">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider block">AI Decision Reasoning</span>
                    {calculating ? (
                      <div className="space-y-2 py-2">
                        <div className="h-3 bg-slate-100 rounded-md animate-pulse w-full" />
                        <div className="h-3 bg-slate-100 rounded-md animate-pulse w-5/6" />
                        <div className="h-3 bg-slate-100 rounded-md animate-pulse w-4/6" />
                      </div>
                    ) : (
                      <p className="text-xs text-gray-650 font-semibold leading-relaxed">
                        {activeScenario.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-teal-50/20 border border-teal-100 rounded-2xl flex items-start space-x-3 mt-4">
                  <Info className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                  <p className="text-[10px] text-brand-teal font-semibold leading-relaxed">
                    Citizens can request automated rerouting for active community complaints by setting their start and target destinations.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Map Panel (7/12 width) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-150 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              
              <div className="flex justify-between items-center select-none flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 tracking-tight">Interactive Detour Map</h3>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                    Red dashed line shows blocked path. Green line shows the recommended AI bypass.
                  </p>
                </div>

                <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-full border border-white shadow-xxs" />
                    <span>Blocked path</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white shadow-xxs" />
                    <span>AI Detour</span>
                  </span>
                </div>
              </div>

              <div className="h-[450px] relative rounded-2xl overflow-hidden border border-gray-100 bg-slate-50">
                {calculating ? (
                  <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
                    <span className="text-xs font-bold text-gray-500">Recalculating alternative path...</span>
                  </div>
                ) : null}
                <TrafficMap activeScenario={activeScenario} />
              </div>

            </div>

          </div>

        </main>
      </div>

      <footer className="bg-slate-100/50 border-t border-slate-200 mt-auto">
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-4">
          <span>&copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#departments" className="hover:text-brand-teal transition-colors">Departments</a>
            <a href="#privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-brand-teal transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
