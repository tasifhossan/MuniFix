"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Filter,
  ArrowUpDown,
  Loader2,
  RefreshCw
} from "lucide-react";
import WorkerSidebar from "@/components/WorkerSidebar";
import WorkerHeader from "@/components/WorkerHeader";
import WorkerTaskCard from "@/components/WorkerTaskCard";
import { fetchWorkerTasks } from "@/lib/api";

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
    pending: "Assigned",
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

export default function WorkerComplaintsPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTasks() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWorkerTasks();
      setTasks(data.tasks ?? data.complaints ?? data.complains ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const activeTasks = tasks.filter(
    (t) => t.status !== "resolved" && t.status !== "cancelled"
  );

  return (
    <div className="min-h-screen bg-white flex font-sans">
      <WorkerSidebar activeNav="complaints" />

      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <main className="px-6 sm:px-8 py-6 space-y-8 flex-1">
          <WorkerHeader />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-4 animate-pulse">
                  <div className="w-full aspect-[4/3] bg-slate-200 rounded-2xl" />
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                  <div className="h-10 bg-slate-200 rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <AlertTriangle className="w-10 h-10 text-red-400" />
              <p className="text-slate-700 font-bold text-sm">Failed to load tasks</p>
              <p className="text-slate-400 text-xs max-w-xs">{error}</p>
              <button
                onClick={loadTasks}
                className="inline-flex items-center gap-2 bg-[#005c55] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#004540] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          ) : (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">
                    Active Complaints
                  </h2>
                  <p className="text-gray-500 text-xs font-semibold mt-0.5">
                    {activeTasks.length > 0
                      ? `You have ${activeTasks.length} active complaint${activeTasks.length !== 1 ? "s" : ""} assigned.`
                      : "No active complaints assigned to you."}
                  </p>
                </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {activeTasks.map((task) => (
                    <WorkerTaskCard
                      key={task.id}
                      id={task.id}
                      image={
                        (task.images && task.images[0]) ??
                        (Array.isArray(task.image_url) ? task.image_url[0] : task.image_url) ??
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
          )}
        </main>

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
