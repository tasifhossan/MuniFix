"use client";

import React from "react";
import { ShieldCheck, Award } from "lucide-react";

interface ProfileSummaryCardProps {
  name: string;
  avatar?: string;
  verified?: boolean;
  filedCount: number;
  resolvedCount: number;
  points: number;
  level: number;
}

export default function ProfileSummaryCard({
  name,
  avatar = "/ahmed-avatar.png",
  verified = true,
  filedCount,
  resolvedCount,
  points,
  level,
}: ProfileSummaryCardProps) {
  // Calculate progress percentage for current level (just a mock logic e.g., points % 1000 / 10)
  const levelProgress = 65; // hardcoded or calculated

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center transition-all duration-350 hover:shadow-md">
      {/* Avatar Wrapper with double rings */}
      <div className="relative group mb-4">
        <div className="absolute inset-0 bg-brand-teal/10 rounded-full scale-105 animate-pulse group-hover:scale-110 transition-transform duration-300" />
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-brand-teal p-1 bg-white shadow-inner select-none">
          <img
            src={avatar}
            alt={name}
            className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback to a placeholder gradient avatar if image fails to load
              e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=005c55`;
            }}
          />
        </div>
      </div>

      {/* Name and Status */}
      <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-tight mb-1">
        {name}
      </h2>
      
      {verified && (
        <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100/50 mb-6">
          <ShieldCheck className="w-3.5 h-3.5 fill-emerald-50" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">
            Verified Citizen
          </span>
        </div>
      )}

      {/* Stats Blocks Grid */}
      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        {/* Filed Stats */}
        <div className="bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/30 rounded-2xl p-3 text-center transition-colors duration-200">
          <span className="block text-2xl font-extrabold text-indigo-600 mb-0.5">
            {filedCount < 10 ? `0${filedCount}` : filedCount}
          </span>
          <span className="text-xs font-bold text-slate-500 tracking-wide">
            Filed
          </span>
        </div>

        {/* Resolved Stats */}
        <div className="bg-brand-teal hover:bg-brand-teal-hover rounded-2xl p-3 text-center transition-colors duration-200 group cursor-default">
          <span className="block text-2xl font-extrabold text-white mb-0.5 transition-transform group-hover:scale-105 duration-200">
            {resolvedCount < 10 ? `0${resolvedCount}` : resolvedCount}
          </span>
          <span className="text-xs font-bold text-teal-100 tracking-wide">
            Resolved
          </span>
        </div>
      </div>

      {/* Community Impact Card */}
      <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 w-full text-left">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-extrabold text-amber-800 tracking-wide flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600 stroke-[2.5]" />
            Community Impact
          </span>
          <span className="text-xs font-bold text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded-md">
            Level {level}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-amber-100 h-1.5 rounded-full overflow-hidden mb-3">
          <div 
            className="bg-amber-500 h-full rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${levelProgress}%` }}
          />
        </div>

        <p className="text-[11px] font-medium text-amber-800 leading-normal">
          {points.toLocaleString()} points earned through active reporting.
        </p>
      </div>
    </div>
  );
}
