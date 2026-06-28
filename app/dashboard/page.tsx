"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Loader2,
  PlusCircle,
  MapPin,
  RotateCcw
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { fetchComplaints } from "@/lib/api";
import dynamic from "next/dynamic";

const DashboardMap = dynamic(() => import("@/components/DashboardMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] bg-slate-100 rounded-3xl border border-gray-150 flex items-center justify-center animate-pulse">
      <p className="text-gray-400 text-xs font-bold">Loading Complaints Overview Map...</p>
    </div>
  )
});

export default function CitizenDashboard() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await fetchComplaints();
        if (data.success) {
          setComplaints(data.complaints);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalCount = complaints.length;
  const resolvedCount = complaints.filter(c => c.status === "resolved").length;
  const inProgressCount = complaints.filter(c => c.status === "in_progress" || c.status === "assigned").length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Global Header */}
      <Navbar activeNav="dashboard" isDashboard />

      {/* Main Container Layout */}
      <div className="flex flex-col md:flex-row flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar Nav */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Content Area */}
        <main className="flex-1 space-y-8">
        
        {/* Banner Section */}
        <div className="bg-[#0c6b62] text-white rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-12 relative shadow-md">
          <div className="space-y-6 max-w-xl z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Improve Chattogram<br />Together.
            </h1>
            <p className="text-teal-50 text-sm md:text-base leading-relaxed opacity-90">
              Spotted an issue in your neighborhood? Report waterlogging, broken streetlights, or waste management problems directly to the City Corporation.
            </p>
            <Link
              href="/complaints/new"
              className="inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-[#e08e00] text-white font-extrabold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-[0.98] select-none cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
              <span>Report an Issue</span>
            </Link>
          </div>
          <div className="hidden md:block w-72 h-48 lg:w-96 lg:h-64 relative rounded-2xl overflow-hidden shrink-0 border-4 border-white/10 shadow-lg">
            <img
              src="/city_aerial_banner.png"
              alt="Chattogram Smart Block"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-[#0c6b62] px-3 py-1 rounded-full text-[10px] font-bold shadow-sm tracking-wider uppercase select-none">
              Live Tracking
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-150 shadow-sm animate-pulse">
            <Loader2 className="w-10 h-10 text-brand-teal animate-spin" />
            <p className="text-gray-500 text-sm font-bold mt-4">Connecting to Neon DB...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-150 shadow-sm text-center px-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
            <p className="text-gray-900 font-bold mt-4">Failed to load dashboard statistics</p>
            <p className="text-gray-500 text-xs mt-1 max-w-sm">{error}</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* TOTAL FILED */}
              <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between min-h-[110px]">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Filed</p>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-black text-gray-800">{totalCount}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">+2 this month</span>
                </div>
              </div>

              {/* RESOLVED */}
              <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between min-h-[110px]">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resolved</p>
                <div className="space-y-2 mt-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-gray-800">{resolvedCount}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-brand-teal h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${totalCount > 0 ? (resolvedCount / totalCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* IN PROGRESS */}
              <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between min-h-[110px]">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In Progress</p>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-black text-gray-800">{inProgressCount}</span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">Active focus</span>
                </div>
              </div>

              {/* AVG. RESPONSE */}
              <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between min-h-[110px]">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Response</p>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-black text-gray-800">4.2</span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">Days</span>
                </div>
              </div>
            </div>

            {/* Complaints Overview Map Section */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-150 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-black text-gray-800 tracking-tight">Active Reports Map</h3>
                <p className="text-gray-500 text-xs font-semibold mt-0.5">
                  Click any pin to see details and track reported community issues live.
                </p>
              </div>
              <div className="h-[350px] rounded-3xl overflow-hidden relative border border-gray-100">
                <DashboardMap
                  complaints={complaints}
                  onSelectComplaint={(id) => router.push(`/complaints/${id}`)}
                />
              </div>
            </div>

            {/* Recent Reports section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-850 tracking-tight">Recent Reports</h2>
                <div className="flex items-center gap-3">
                  <button onClick={() => router.push("/complaints")} className="border border-gray-200 hover:bg-slate-50 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-[0.98] select-none cursor-pointer">
                    Filter
                  </button>
                  <button onClick={() => router.push("/complaints")} className="border border-gray-200 hover:bg-slate-50 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-[0.98] select-none cursor-pointer">
                    Sort
                  </button>
                </div>
              </div>

              {/* Grid of complaint cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {complaints.slice(0, 4).map((c) => {
                  // Map database categories to caps labels
                  let categoryLabel = "OTHER";
                  if (c.category === "Waterlogging") categoryLabel = "WATERLOGGING";
                  else if (c.category === "Road Repair") categoryLabel = "BROKEN ROAD";
                  else if (c.category === "Waste Management") categoryLabel = "WASTE DISPOSAL";
                  else if (c.category === "Electricity") categoryLabel = "STREETLIGHT";

                  // Map status overlays
                  let statusOverlayClass = "bg-slate-500/80 text-white";
                  let statusText = "PENDING";
                  if (c.status === "resolved") {
                    statusOverlayClass = "bg-emerald-600/90 text-white";
                    statusText = "RESOLVED";
                  } else if (c.status === "in_progress") {
                    statusOverlayClass = "bg-amber-600/90 text-white";
                    statusText = "IN PROGRESS";
                  } else if (c.status === "assigned") {
                    statusOverlayClass = "bg-blue-600/90 text-white";
                    statusText = "ASSIGNED";
                  }

                  const formattedDate = new Date(c.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });

                  return (
                    <div
                      key={c.id}
                      onClick={() => router.push(`/complaints/${c.id}`)}
                      className="bg-white rounded-[1.5rem] border border-gray-150 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.005] cursor-pointer flex flex-col justify-between min-h-[350px]"
                    >
                      {/* Card Image area with Status Overlay */}
                      <div className="h-44 w-full relative bg-slate-100 border-b border-gray-100 shrink-0">
                        <img
                          src={c.image_url || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop"}
                          alt={c.category}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm ${statusOverlayClass}`}>
                          {statusText}
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-gray-650">{categoryLabel}</span>
                            <span>&bull;</span>
                            <span>{formattedDate}</span>
                          </div>
                          <h3 className="text-base font-bold text-gray-800 tracking-tight line-clamp-1 leading-snug">
                            {c.category} Issue - {c.citizen_name || "Citizen Report"}
                          </h3>
                          <p className="text-gray-500 text-xs font-semibold leading-relaxed line-clamp-2">
                            {c.description}
                          </p>
                        </div>

                        {/* Card footer */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 text-[11px] font-bold text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                            {c.latitude && c.longitude ? `${parseFloat(c.latitude).toFixed(4)}, ${parseFloat(c.longitude).toFixed(4)}` : "Chattogram Area"}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* View Report History Card (Dashed Border Card at index 5) */}
                <div
                  onClick={() => router.push("/complaints")}
                  className="bg-slate-50/50 hover:bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-gray-250 flex flex-col items-center justify-center p-6 text-center shadow-inner cursor-pointer transition-all duration-300 hover:scale-[1.005] hover:border-brand-teal/50 group min-h-[350px]"
                >
                  <div className="p-4 bg-white text-gray-500 rounded-full shadow-sm mb-4 transition-colors group-hover:text-brand-teal">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 tracking-tight">
                    View Report History
                  </h3>
                  <p className="text-gray-400 text-[11px] font-semibold mt-1.5 max-w-[200px] leading-relaxed">
                    Access all your {totalCount} previous submissions and their full timelines.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        </main>
      </div>

      {/* Global Simple Footer */}
      <footer className="bg-slate-100/50 border-t border-slate-200 mt-auto">
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-4">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <span className="text-brand-teal font-black text-sm">MuniFix Ctg</span>
            <span>Empowering the citizens of Chattogram with efficient municipal reporting.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <div className="flex flex-col gap-1.5 text-center md:text-left">
              <span className="text-gray-900 font-extrabold uppercase tracking-wider text-[10px]">Platform</span>
              <a href="#departments" className="hover:text-brand-teal transition-colors">Departments</a>
              <a href="#how" className="hover:text-brand-teal transition-colors">How it Works</a>
            </div>
            <div className="flex flex-col gap-1.5 text-center md:text-left">
              <span className="text-gray-900 font-extrabold uppercase tracking-wider text-[10px]">Connect</span>
              <a href="https://ccc.gov.bd" className="hover:text-brand-teal transition-colors">Contact Support</a>
              <a href="https://facebook.com" className="hover:text-brand-teal transition-colors">Official Facebook</a>
            </div>
            <div className="flex flex-col gap-1.5 text-center md:text-left">
              <span className="text-gray-900 font-extrabold uppercase tracking-wider text-[10px]">Legal</span>
              <a href="#privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-brand-teal transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-150 py-4 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-semibold text-gray-400 gap-2">
          <span>&copy; 2026 MuniFix Ctg. All rights reserved.</span>
          <span>Official platform for <strong className="text-gray-700">Chattogram City Corporation</strong></span>
        </div>
      </footer>
    </div>
  );
}
