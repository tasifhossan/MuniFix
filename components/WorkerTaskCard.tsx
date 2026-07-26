"use client";

import React from "react";
import { MapPin, Maximize2 } from "lucide-react";
import Link from "next/link";

interface WorkerTaskCardProps {
  id?: string;
  image: string;
  title: string;
  location: string;
  description?: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "In Progress" | "Assigned" | "Resolved";
  reportedTime: string;
  assignedWorkers?: string[];
  totalWorkersCount?: number;
  onViewDetails?: () => void;
}

export default function WorkerTaskCard({
  id,
  image,
  title,
  location,
  description,
  priority,
  status,
  reportedTime,
  assignedWorkers = [],
  totalWorkersCount = 0,
  onViewDetails,
}: WorkerTaskCardProps) {
  // Styles for Priority badges
  const priorityStyles = {
    Critical: "bg-red-600 text-white",
    High: "bg-amber-500 text-white",
    Medium: "bg-gray-100 text-gray-700 border border-gray-200/50",
    Low: "bg-sky-50 text-sky-700 border border-sky-100/50",
  };

  // Styles for Status badges
  const statusStyles = {
    "In Progress": "bg-blue-600 text-white",
    Assigned: "bg-indigo-600 text-white",
    Resolved: "bg-emerald-600 text-white",
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-150 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden font-sans group">
      {/* Top Cover Image with Badges */}
      <div className="relative w-full h-44 sm:h-40 bg-slate-100 overflow-hidden shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Ambient Dark Overlay on image top for visual contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent opacity-60" />

        {/* Action Expand Button (Absolute Right) */}
        <button className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/45 text-white rounded-xl backdrop-blur-xs transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm cursor-pointer active:scale-95">
          <Maximize2 className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>

        {/* Status & Priority Badges (Absolute Left Stacked) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm select-none ${priorityStyles[priority]}`}>
            {priority}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm select-none ${statusStyles[status]}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* Card Title */}
          <h3 className="text-base sm:text-md font-black text-gray-900 tracking-tight leading-snug group-hover:text-brand-teal transition-colors">
            {title}
          </h3>

          {/* Location details */}
          <div className="flex items-start text-xs font-semibold text-gray-500 leading-normal">
            <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{location}</span>
          </div>

          {/* Optional Short Description */}
          {description && (
            <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2 pt-1">
              {description}
            </p>
          )}

          {/* Assigned Workers row */}
          {assignedWorkers.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <div className="flex -space-x-2.5 overflow-hidden">
                {assignedWorkers.map((avatar, idx) => (
                  <div key={idx} className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white bg-slate-100 shadow-inner">
                    <img src={avatar} className="w-full h-full object-cover" alt="Worker avatar" />
                  </div>
                ))}
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                +{totalWorkersCount} Workers Assigned
              </span>
            </div>
          )}
        </div>

        {/* Card Footer actions */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
          <span className="text-xxs sm:text-xs font-semibold text-gray-400">
            {reportedTime}
          </span>
          {id ? (
            <Link href={`/worker/tasks/${id}`}>
              <button className="bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-brand-teal/5 select-none active:scale-[0.98] cursor-pointer">
                View Details
              </button>
            </Link>
          ) : (
            <button
              onClick={onViewDetails}
              className="bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-brand-teal/5 select-none active:scale-[0.98] cursor-pointer"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
