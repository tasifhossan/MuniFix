"use client";

import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface ActivityItem {
  id: string;
  photo: string;
  categoryTitle: string;
  categorySubtitle: string;
  citizenName: string;
  citizenInitials: string;
  citizenBgClass?: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "PENDING REVIEW" | "ASSIGNED" | "RESOLVED";
}

interface RecentActivityTableProps {
  items: ActivityItem[];
  totalReviews?: number;
  onRowClick?: (id: string) => void;
}

export default function RecentActivityTable({
  items,
  totalReviews = 84,
  onRowClick,
}: RecentActivityTableProps) {
  
  // Custom status badge styling
  const renderStatusBadge = (status: ActivityItem["status"]) => {
    const styles = {
      "PENDING REVIEW": "bg-amber-50 text-amber-800 border-amber-100/50",
      ASSIGNED: "bg-teal-50 text-teal-800 border-teal-100/50",
      RESOLVED: "bg-blue-50 text-blue-800 border-blue-100/50",
    };
    return (
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border select-none ${styles[status]}`}>
        {status}
      </span>
    );
  };

  // Custom priority badge styling
  const renderPriorityBadge = (priority: ActivityItem["priority"]) => {
    const dotColors = {
      Critical: "bg-red-500",
      High: "bg-amber-500",
      Medium: "bg-slate-400",
      Low: "bg-slate-300",
    };

    const textColors = {
      Critical: "text-red-650",
      High: "text-amber-600",
      Medium: "text-slate-500",
      Low: "text-slate-400",
    };

    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${textColors[priority]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[priority]}`} />
        {priority}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-150 shadow-sm overflow-hidden font-sans w-full">
      {/* Table Title and Actions header row */}
      <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight leading-none">
          Recent Activity
        </h3>
        <a 
          href="/admin/complaints" 
          className="text-xs font-bold text-brand-teal hover:underline select-none transition-all"
        >
          View All Complaints
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto min-w-[750px]">
          {/* Table Header columns */}
          <thead className="bg-[#f8fafc] border-b border-slate-100 select-none">
            <tr>
              <th className="py-3.5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest w-28">
                Report Photo
              </th>
              <th className="py-3.5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Category
              </th>
              <th className="py-3.5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-48">
                Citizen
              </th>
              <th className="py-3.5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-32">
                Priority
              </th>
              <th className="py-3.5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">
                Status
              </th>
              <th className="py-3.5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest w-20 text-center">
                Action
              </th>
            </tr>
          </thead>

          {/* Table Body rows */}
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr 
                key={item.id}
                onClick={() => onRowClick && onRowClick(item.id)}
                className={`transition-colors duration-150 hover:bg-slate-50/50 ${onRowClick ? "cursor-pointer" : ""}`}
              >
                <td className="py-4 px-6">
                  <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-150 shadow-inner">
                    <img
                      src={item.photo}
                      alt={item.categoryTitle}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-bold text-slate-800 leading-tight block">
                    {item.categoryTitle}
                  </span>
                  <span className="text-xxs sm:text-xs text-gray-405 font-semibold leading-relaxed block mt-0.5">
                    {item.categorySubtitle}
                  </span>
                </td>
                <td className="py-4 px-4 vertical-middle">
                  <div className="flex items-center">
                    <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-[10px] font-black uppercase shadow-inner shrink-0 ${
                      item.citizenBgClass || "bg-sky-50 text-sky-700"
                    }`}>
                      {item.citizenInitials}
                    </div>
                    <span className="text-xs font-bold text-slate-700 ml-2.5 truncate max-w-[120px]">
                      {item.citizenName}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 vertical-middle">
                  {renderPriorityBadge(item.priority)}
                </td>
                <td className="py-4 px-4 vertical-middle">
                  {renderStatusBadge(item.status)}
                </td>
                <td className="py-4 px-6 text-center vertical-middle">
                  <button className="text-brand-teal hover:text-brand-teal-hover transition-colors p-1 rounded-lg hover:bg-teal-50 cursor-pointer active:scale-90 inline-flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-[#f8fafc] border-t border-slate-100 px-6 py-4 flex items-center justify-between select-none">
        <span className="text-xs font-bold text-slate-400">
          Showing {items.length} of {totalReviews} pending reviews
        </span>
        
        {/* Pagination controls chevron indicators */}
        <div className="flex items-center gap-2">
          <button className="p-1 text-slate-400 hover:text-brand-teal hover:bg-slate-100 rounded-lg cursor-pointer transition-colors active:scale-90 shrink-0">
            <ChevronLeft className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
          <button className="p-1 text-slate-400 hover:text-brand-teal hover:bg-slate-100 rounded-lg cursor-pointer transition-colors active:scale-90 shrink-0">
            <ChevronRight className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
        </div>
      </div>

    </div>
  );
}
