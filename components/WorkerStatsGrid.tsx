"use client";

import React from "react";
import { CheckCircle2, Clock, Star, TrendingUp } from "lucide-react";

interface WorkerStatsGridProps {
  tasksCompleted: number;
  tasksTrend: string;
  avgResolution: string;
  rating: number;
  badge?: string;
}

export default function WorkerStatsGrid({
  tasksCompleted,
  tasksTrend,
  avgResolution,
  rating,
  badge = "Top 5% of Department",
}: WorkerStatsGridProps) {
  // Performance rating percentage relative to 5.0 scale
  const ratingProgress = (rating / 5.0) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full font-sans select-none">
      {/* Tasks Completed Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between h-40 transition-all duration-350 hover:shadow-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Tasks Completed
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-3xl font-black text-slate-800 tracking-tight leading-none">
            {tasksCompleted}
          </span>
          <span className="inline-flex items-center gap-0.5 text-xs font-black text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            {tasksTrend}
          </span>
        </div>
      </div>

      {/* Avg. Resolution Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between h-40 transition-all duration-350 hover:shadow-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Avg. Resolution
          </span>
        </div>

        <div className="flex items-baseline gap-1 mt-4">
          <span className="text-3xl font-black text-slate-800 tracking-tight leading-none">
            {avgResolution}
          </span>
          <span className="text-xs font-bold text-slate-400">
            hours
          </span>
        </div>
      </div>

      {/* Performance Rating Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between h-40 transition-all duration-350 hover:shadow-md relative overflow-hidden">
        {/* Rating Badge */}
        {badge && (
          <span className="absolute top-6 right-6 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">
            {badge}
          </span>
        )}

        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5 stroke-[2.2] fill-amber-500 text-amber-500" />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Performance Rating
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-800 tracking-tight leading-none">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-400">
              / 5.0
            </span>
          </div>

          {/* Progress Slider */}
          <div className="space-y-1">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${ratingProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] font-black text-slate-400 tracking-widest uppercase">
              <span>Excellent</span>
              <span>Limitless</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
