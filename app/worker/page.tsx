"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ClipboardList,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Filter,
  ArrowUpDown,
  Loader2,
  RefreshCw
} from "lucide-react";
import WorkerSidebar from "@/components/WorkerSidebar";
import WorkerHeader from "@/components/WorkerHeader";
import WorkerStatCard from "@/components/WorkerStatCard";
import WorkerTaskCard from "@/components/WorkerTaskCard";
import { fetchWorkerTasks, fetchMyProfile } from "@/lib/api";

// Map priority/status from DB values to display values
function mapPriority(p: string): "Critical" | "High" | "Medium" | "Low" {
  const map: Record<string, "Critical" | "High" | "Medium" | "Low"> = {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  };
  return map[p?.toLowerCase()] ?? "Low";
}

function mapStatus(s: string): "In Progress" | "Assigned" | "Resolved" {
  const map: Record<string, "In Progress" | "Assigned" | "Resolved"> = {
    in_progress: "In Progress",
    assigned: "Assigned",
    resolved: "Resolved",
    pending: "Assigned", // pending shown as assigned from worker's perspective
    cancelled: "Resolved",
  };
  return map[s?.toLowerCase()] ?? "Assigned";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Reported ${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Reported ${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `Reported ${days}d ago`;
}

// Category → default fallback image
function categoryImage(category: string): string {
  const map: Record<string, string> = {
    "Waterlogging": "/clogged-drain.png",
    "Road Repair": "/road-pothole.png",
    "Waste Management": "/garbage-overflow.png",
    "Electricity": "/street-light.png",
    "Street Light": "/street-light.png",
  };
  return map[category] ?? "/road-pothole.png";
}

export default function FieldWorkerDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [tasks, setTasks] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);
      const [taskData, profileData] = await Promise.all([
        fetchWorkerTasks(),
        fetchMyProfile(),
      ]);
      setTasks(taskData.tasks ?? taskData.complaints ?? []);
      setProfile(profileData.user ?? profileData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  // Compute stats from live task data
  const totalAssigned = tasks.length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "in_progress" || t.status === "assigned"
  ).length;
  const criticalCount = tasks.filter((t) => t.priority === "critical").length;

  // "Completed today" = resolved within the last 24 hours
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = tasks.filter(
    (t) => t.status === "resolved" && new Date(t.updated_at ?? t.created_at) >= today
  ).length;

  // Only show active tasks (not resolved/cancelled) in the task list
  const activeTasks = tasks.filter(
    (t) => t.status !== "resolved" && t.status !== "cancelled"
  );

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

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-[#005c55] animate-spin" />
              <p className="text-slate-500 text-sm font-bold">Loading your tasks...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <AlertTriangle className="w-10 h-10 text-red-400" />
              <p className="text-slate-700 font-bold text-sm">Failed to load tasks</p>
              <p className="text-slate-400 text-xs max-w-xs">{error}</p>
              <button
                onClick={loadDashboard}
                className="inline-flex items-center gap-2 bg-[#005c55] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#004540] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          ) : (
            <>
              {/* Stats Metrics Row */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <WorkerStatCard
                  label="Total Assigned"
                  value={String(totalAssigned).padStart(2, "0")}
                  borderClass="border-t-brand-teal"
                  iconBgClass="bg-teal-50 text-brand-teal"
                  icon={<ClipboardList className="w-5 h-5 stroke-[2.2]" />}
                  subtext={
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Live from backend
                    </span>
                  }
                />

                <WorkerStatCard
                  label="In Progress"
                  value={String(inProgressCount).padStart(2, "0")}
                  borderClass="border-t-amber-500"
                  iconBgClass="bg-amber-50 text-amber-500"
                  icon={<Briefcase className="w-5 h-5 stroke-[2.2]" />}
                  subtext={
                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${totalAssigned > 0 ? (inProgressCount / totalAssigned) * 100 : 0}%` }}
                      />
                    </div>
                  }
                />

                <WorkerStatCard
                  label="Critical Priority"
                  value={String(criticalCount).padStart(2, "0")}
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
                  value={String(completedToday).padStart(2, "0")}
                  borderClass="border-t-emerald-500"
                  iconBgClass="bg-emerald-50 text-emerald-500"
                  icon={<CheckCircle className="w-5 h-5 stroke-[2.2]" />}
                  subtext={
                    <span className="text-[10px] font-bold text-slate-400">
                      Target: {Math.max(8, totalAssigned)} tasks
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
                      {activeTasks.length > 0
                        ? `${activeTasks.length} active task${activeTasks.length !== 1 ? "s" : ""} in your assigned ward.`
                        : "No active tasks right now. Check back later."}
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

                {activeTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center gap-3">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                    <p className="text-slate-700 font-bold text-sm">All caught up!</p>
                    <p className="text-slate-400 text-xs">No active tasks assigned to you.</p>
                  </div>
                ) : (
                  /* Grid display of task cards */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeTasks.map((task) => (
                      <WorkerTaskCard
                        key={task.id}
                        id={task.id}
                        image={
                          (task.images && task.images[0]) ??
                          task.image_url ??
                          categoryImage(task.category)
                        }
                        title={task.category ? `${task.category} Issue` : task.title ?? "Assigned Task"}
                        location={
                          task.address ??
                          (task.latitude && task.longitude
                            ? `${parseFloat(task.latitude).toFixed(4)}, ${parseFloat(task.longitude).toFixed(4)}`
                            : "Chattogram Area")
                        }
                        description={task.description}
                        priority={mapPriority(task.priority)}
                        status={mapStatus(task.status)}
                        reportedTime={timeAgo(task.created_at)}
                        assignedWorkers={[]}
                        totalWorkersCount={0}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
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
