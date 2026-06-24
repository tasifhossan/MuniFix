"use client";

import React, { useState } from "react";
import { Filter, ArrowUpDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DashboardBanner from "@/components/DashboardBanner";
import DashboardStatCard from "@/components/DashboardStatCard";
import DashboardReportCard from "@/components/DashboardReportCard";
import HistoryCard from "@/components/HistoryCard";
import DashboardFooter from "@/components/DashboardFooter";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");

  // Mock logged-in user data
  const mockUser = {
    name: "Ahmed Khan",
    avatar: "/ahmed-avatar.png",
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Navigation Header with logged-in user details */}
      <Navbar activeNav={activeNav} user={mockUser} />

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 space-y-10">
          
          {/* Dashboard Welcome Banner */}
          <DashboardBanner />

          {/* Stats Summary Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardStatCard
              label="Total Filed"
              value="12"
              suffix={
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                  +2 this month
                </span>
              }
            />
            <DashboardStatCard
              label="Resolved"
              value="8"
              accentBorder={true}
            >
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-brand-teal h-full rounded-full transition-all duration-500" style={{ width: "66%" }} />
              </div>
            </DashboardStatCard>
            <DashboardStatCard
              label="In Progress"
              value="3"
              suffix={
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100/50">
                  Active focus
                </span>
              }
            />
            <DashboardStatCard
              label="Avg. Response"
              value="4.2"
              suffix={
                <span className="text-xs font-bold text-slate-400">
                  Days
                </span>
              }
            />
          </section>

          {/* Recent Reports Section */}
          <section className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Recent Reports
              </h3>
              {/* Filter & Sort Actions */}
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-600 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer active:scale-[0.98]">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Filter</span>
                </button>
                <button className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-600 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer active:scale-[0.98]">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sort</span>
                </button>
              </div>
            </div>

            {/* Grid of Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <DashboardReportCard
                image="/road-pothole.png"
                status="RESOLVED"
                category="Broken Road"
                date="Nov 12, 2024"
                title="Pothole on CDA Avenue"
                description="Large pothole forming near the main intersection, causing traffic delays and posing safety hazards for motorbikes."
                location="GEC Circle Area"
              />
              <DashboardReportCard
                image="/clogged-drain.png"
                status="IN PROGRESS"
                category="Waterlogging"
                date="Nov 18, 2024"
                title="Clogged Drain in Agrabad"
                description="Sewerage line blockage causing minor overflow onto the sidewalk near the market area. Repair team dispatched."
                location="Agrabad C/A"
              />
              <DashboardReportCard
                image="/street-light.png"
                status="ASSIGNED"
                category="Streetlight"
                date="Nov 20, 2024"
                title="Broken Light - Lane 4"
                description="Streetlight has been flickering for days and finally went out completely last night. It's pitch black and unsafe."
                location="Nasirabad Housing"
              />
              <DashboardReportCard
                image="/garbage-overflow.png"
                status="PENDING"
                category="Waste Disposal"
                date="Today"
                title="Garbage Overflow"
                description="Main collection bin has not been cleared for three days. Foul smell is spreading in the residential block."
                location="Chawkbazar"
              />
              <HistoryCard />
            </div>
          </section>
        </main>
      </div>

      {/* Footer Section */}
      <DashboardFooter />
    </div>
  );
}
