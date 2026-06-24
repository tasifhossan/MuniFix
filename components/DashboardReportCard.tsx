"use client";

import React from "react";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";

interface DashboardReportCardProps {
  image: string;
  status: "RESOLVED" | "IN PROGRESS" | "ASSIGNED" | "PENDING";
  category: string;
  date: string;
  title: string;
  description: string;
  location: string;
}

export default function DashboardReportCard({
  image,
  status,
  category,
  date,
  title,
  description,
  location
}: DashboardReportCardProps) {
  const statusStyles = {
    RESOLVED: "bg-[#e6f4ea] text-[#137333]",
    "IN PROGRESS": "bg-[#fef7e0] text-[#b06000]",
    ASSIGNED: "bg-[#e8f0fe] text-[#1a73e8]",
    PENDING: "bg-[#f1f3f4] text-[#5f6368]"
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      {/* Top Image & Status Overlay */}
      <div className="relative w-full h-48 overflow-hidden bg-slate-50">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-102"
        />
        <div className="absolute top-4 left-4 z-10">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${statusStyles[status]}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Category & Date */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-600 uppercase tracking-wider">
              {category}
            </span>
            <span className="text-xs text-slate-400 font-semibold">{date}</span>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-teal transition-colors">
              {title}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        {/* Divider & Footer Location details */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-600">
            <MapPin className="w-4 h-4 text-brand-teal" />
            <span className="text-xs font-bold text-slate-700">{location}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}
