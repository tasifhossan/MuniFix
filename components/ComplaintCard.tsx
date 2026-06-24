"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Clock, ThumbsUp } from "lucide-react";
import Badge from "./Badge";

interface ComplaintCardProps {
  id: string;
  title: string;
  description: string;
  priority: "CRITICAL" | "MEDIUM" | "LOW";
  status: "In Progress" | "Resolved" | "Pending Approval" | "Dispatched";
  location: string;
  time: string;
  image?: string;
  avatars?: string[]; // for small cards
  upvotes?: number; // for small cards
  size?: "large" | "medium" | "small";
  onClick?: () => void;
}

export default function ComplaintCard({
  title,
  description,
  priority,
  status,
  location,
  time,
  image,
  avatars = [],
  upvotes,
  size = "medium",
  onClick
}: ComplaintCardProps) {
  // Border highlight class based on priority
  const borderClasses = {
    CRITICAL: "border-l-[6px] border-l-red-600",
    MEDIUM: "border-l-[6px] border-l-amber-500",
    LOW: "border-l-[6px] border-l-slate-400"
  };

  const borderClass = borderClasses[priority] || "border-l-[6px] border-l-slate-200";

  // Large & Medium layout (horizontal row)
  if (size === "large" || size === "medium") {
    return (
      <div
        onClick={onClick}
        className={`bg-white rounded-3xl border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.005] overflow-hidden flex flex-col sm:flex-row p-5 sm:p-6 gap-6 cursor-pointer ${borderClass}`}
      >
        {image && (
          <div className="w-full sm:w-56 h-40 sm:h-36 relative rounded-2xl overflow-hidden shrink-0 bg-slate-100 shadow-inner">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-snug">
                {title}
              </h3>
              <Badge type="priority" value={priority} />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 max-w-2xl">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-2 border-t border-slate-50">
            <div className="flex items-center space-x-4 text-xs font-semibold text-gray-500">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                {location}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                {time}
              </span>
            </div>
            <div>
              <Badge type="status" value={status} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Small layout (vertical box for side-by-side display)
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.005] p-6 flex flex-col justify-between cursor-pointer min-h-[220px] ${borderClass}`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-gray-900 leading-snug tracking-tight">
            {title}
          </h3>
          <Badge type="priority" value={priority} />
        </div>
        <span className="flex items-center text-xs font-semibold text-gray-500">
          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
          {location}
        </span>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1.5">
          {avatars.length > 0 ? (
            <div className="flex -space-x-2.5 overflow-hidden">
              {avatars.map((init, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-teal-100 text-brand-teal text-[10px] font-black border-2 border-white uppercase"
                >
                  {init}
                </div>
              ))}
            </div>
          ) : (
            status === "Dispatched" && <Badge type="status" value="Dispatched" />
          )}
        </div>

        <div>
          {upvotes !== undefined ? (
            <span className="flex items-center text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <ThumbsUp className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
              {upvotes} Upvotes
            </span>
          ) : (
            status !== "Dispatched" && <Badge type="status" value={status} />
          )}
        </div>
      </div>
    </div>
  );
}
