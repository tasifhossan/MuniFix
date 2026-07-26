"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, Droplet, Wrench, ShieldAlert } from "lucide-react";

interface ResolvedTask {
  id: string;
  title: string;
  description: string;
  category: "water" | "drainage" | "other";
  date: string;
  duration: string;
}

interface WorkerResolvedTasksProps {
  tasks: ResolvedTask[];
  onViewAllHistory?: () => void;
}

export default function WorkerResolvedTasks({
  tasks,
  onViewAllHistory,
}: WorkerResolvedTasksProps) {
  const getCategoryIcon = (category: ResolvedTask["category"]) => {
    switch (category) {
      case "water":
        return (
          <div className="w-10 h-10 bg-teal-50 text-brand-teal rounded-xl flex items-center justify-center shrink-0">
            <Droplet className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case "drainage":
        return (
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 w-full font-sans transition-all duration-350 hover:shadow-md">
      {/* Header Row */}
      <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100 select-none">
        <h3 className="text-sm font-bold text-slate-850 tracking-tight">
          Recent Resolved Tasks
        </h3>
        <Link
          href="#history"
          onClick={(e) => {
            e.preventDefault();
            onViewAllHistory?.();
          }}
          className="text-xs font-bold text-brand-teal hover:text-brand-teal-hover transition-colors"
        >
          View All History
        </Link>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-50 rounded-2xl hover:bg-slate-50/50 transition-colors duration-200"
          >
            <div className="flex items-start gap-4">
              {/* Category Icon */}
              {getCategoryIcon(task.category)}

              {/* Task Details */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 select-none">
                  <h4 className="text-xs font-extrabold text-slate-800 leading-tight">
                    {task.title}
                  </h4>
                  {/* Completed Badge */}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-black tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100/30 uppercase leading-none">
                    Completed
                  </span>
                </div>
                
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed max-w-lg">
                  {task.description}
                </p>

                {/* Task Footer Meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold text-slate-400 select-none pt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-350" />
                    {task.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-350" />
                    {task.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
