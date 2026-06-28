"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  ClipboardList, 
  Briefcase, 
  AlertTriangle, 
  CheckCircle,
  Filter,
  ArrowUpDown
} from "lucide-react";
import WorkerSidebar from "@/components/WorkerSidebar";
import WorkerHeader from "@/components/WorkerHeader";
import WorkerStatCard from "@/components/WorkerStatCard";
import WorkerTaskCard from "@/components/WorkerTaskCard";

export default function FieldWorkerDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  // Mock list of assigned worker tasks matching the screenshot
  const mockTasks = [
    {
      id: "task-1",
      title: "Main Pipe Burst at GEC Circle",
      location: "GEC Circle Intersection, Nasirabad, Chattogram",
      image: "/clogged-drain.png",
      priority: "Critical" as const,
      status: "In Progress" as const,
      reportedTime: "Reported 45m ago",
      assignedWorkers: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
      ],
      totalWorkersCount: 3
    },
    {
      id: "task-2",
      title: "Multiple Street Light Failure",
      location: "CDA Avenue, Block B, Dampara",
      description: "Residents report 3 lights are out between pole #442 and #445. The block feels unsafe at night.",
      image: "/street-light.png",
      priority: "High" as const,
      status: "Assigned" as const,
      reportedTime: "Reported 3h ago",
      assignedWorkers: [],
      totalWorkersCount: 0
    },
    {
      id: "task-3",
      title: "Waste Overflow Collection",
      location: "Opposite Central Mosque, Ward 15, Chattogram",
      image: "/garbage-overflow.png",
      priority: "Medium" as const,
      status: "In Progress" as const,
      reportedTime: "Reported 6h ago",
      assignedWorkers: [],
      totalWorkersCount: 0
    },
    {
      id: "task-4",
      title: "Sidewalk Surface Patching",
      location: "Agrabad Residential Area, Park Street, Chattogram",
      image: "/road-pothole.png",
      priority: "Low" as const,
      status: "Assigned" as const,
      reportedTime: "Reported yesterday",
      assignedWorkers: [],
      totalWorkersCount: 0
    }
  ];

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Sidebar - Navigation panel on the left */}
      <WorkerSidebar activeNav={activeNav} onNavClick={setActiveNav} />

      {/* Main Panel Content Area */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        
        {/* Main Content wrapper */}
        <main className="px-6 sm:px-8 py-6 space-y-8 flex-1">
          {/* Header Row */}
          <WorkerHeader />

          {/* Stats Metrics Row */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <WorkerStatCard
              label="Total Assigned"
              value="12"
              borderClass="border-t-brand-teal"
              iconBgClass="bg-teal-50 text-brand-teal"
              icon={<ClipboardList className="w-5 h-5 stroke-[2.2]" />}
              subtext={
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +2 from yesterday
                </span>
              }
            />

            <WorkerStatCard
              label="In Progress"
              value="04"
              borderClass="border-t-amber-500"
              iconBgClass="bg-amber-50 text-amber-500"
              icon={<Briefcase className="w-5 h-5 stroke-[2.2]" />}
              subtext={
                <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: "40%" }} />
                </div>
              }
            />

            <WorkerStatCard
              label="Critical Priority"
              value="03"
              borderClass="border-t-red-600"
              iconBgClass="bg-red-50 text-red-500"
              icon={<AlertTriangle className="w-5 h-5 stroke-[2.2]" />}
              subtext={
                <span className="text-[10px] font-bold text-slate-400">
                  Requires immediate action
                </span>
              }
            />

            <WorkerStatCard
              label="Completed Today"
              value="05"
              borderClass="border-t-emerald-500"
              iconBgClass="bg-emerald-50 text-emerald-500"
              icon={<CheckCircle className="w-5 h-5 stroke-[2.2]" />}
              subtext={
                <span className="text-[10px] font-bold text-slate-400">
                  Target: 08 tasks
                </span>
              }
            />
          </section>

          {/* Tasks Grid Section */}
          <section className="space-y-6">
            {/* Subsection Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">
                  My Tasks
                </h2>
                <p className="text-gray-500 text-xs font-semibold mt-0.5">
                  Currently active tasks in your assigned ward.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-600 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none active:scale-[0.98]">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filter</span>
                </button>
                <button className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-600 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none active:scale-[0.98]">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>Priority</span>
                </button>
              </div>
            </div>

            {/* Grid display of task cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockTasks.map((task) => (
                <WorkerTaskCard
                  key={task.id}
                  id={task.id}
                  image={task.image}
                  title={task.title}
                  location={task.location}
                  description={task.description}
                  priority={task.priority}
                  status={task.status}
                  reportedTime={task.reportedTime}
                  assignedWorkers={task.assignedWorkers}
                  totalWorkersCount={task.totalWorkersCount}
                />
              ))}
            </div>
          </section>
        </main>

        {/* Global Footer */}
        <footer className="bg-slate-100/50 border-t border-slate-200/60 py-6 px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-4">
          <span>&copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#departments" className="hover:text-brand-teal transition-colors">Departments</a>
            <a href="#privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-brand-teal transition-colors">Terms of Service</a>
            <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-brand-teal transition-colors">
              Chattogram City Corporation
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
}
