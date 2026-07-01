"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Edit, CheckCircle } from "lucide-react";

export interface ComplaintItem {
  id: string; // e.g. "CTG-8821"
  category: string; // e.g. "Road Maintenance"
  citizenName: string;
  citizenInitials: string;
  citizenBg: string; // e.g. bg-[#e0e7ff] text-[#4f46e5]
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Assigned" | "Assigned (Purple)";
  dateReported: string; // e.g. "Oct 14, 2024"
  thumbnail: string; // e.g. "/pothole.png"
}

interface ComplaintsTableProps {
  items: ComplaintItem[];
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onActionClick?: (item: ComplaintItem) => void;
}

export default function ComplaintsTable({
  items,
  totalCount = 245,
  currentPage = 1,
  onPageChange,
  onActionClick,
}: ComplaintsTableProps) {
  
  // Custom Priority Badge with dot
  const renderPriority = (priority: ComplaintItem["priority"]) => {
    const dotColors = {
      Critical: "bg-red-500",
      High: "bg-amber-500",
      Medium: "bg-teal-500",
      Low: "bg-slate-400",
    };

    const textColors = {
      Critical: "text-red-600",
      High: "text-amber-600",
      Medium: "text-teal-600",
      Low: "text-slate-500",
    };

    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${textColors[priority]} select-none`}>
        <span className={`w-2 h-2 rounded-full ${dotColors[priority]}`} />
        {priority}
      </span>
    );
  };

  // Custom Premium Status Badges matching the screenshot
  const renderStatus = (status: ComplaintItem["status"]) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-extrabold text-[#e11d48] bg-[#ffe4e6] tracking-wide select-none leading-none">
            PENDING
          </span>
        );
      case "In Progress":
        return (
          <div className="relative inline-flex items-center justify-center w-24 h-8 bg-[#e0f2fe] rounded-full overflow-hidden select-none border border-sky-100">
            {/* Custom half-oval/slanted shape on the right */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-sky-200/50 rounded-l-full transform translate-x-2" />
            <div className="relative flex flex-col items-center justify-center text-[9px] font-black text-sky-850 leading-tight">
              <span>IN</span>
              <span>PROGRESS</span>
            </div>
          </div>
        );
      case "Assigned":
        return (
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-md text-xs font-extrabold text-white bg-[#005c55] tracking-wide select-none leading-none shadow-sm">
            ASSIGNED
          </span>
        );
      case "Assigned (Purple)":
        return (
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-extrabold text-[#4f46e5] bg-[#e0e7ff] tracking-wide select-none leading-none">
            ASSIGNED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden font-sans w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto min-w-[800px]">
          {/* Table Header */}
          <thead className="bg-[#f8fafc] border-b border-slate-200/60 select-none">
            <tr>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-28">
                Thumbnail
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Complaint ID & Category
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Citizen
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Priority
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Status
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Date Reported
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24 text-right">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-150/70">
            {items.map((item) => (
              <tr
                key={item.id}
                className="transition-colors duration-150 hover:bg-slate-50/40"
              >
                {/* Thumbnail */}
                <td className="py-4.5 px-6">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm shrink-0 bg-slate-50">
                    <img
                      src={item.thumbnail}
                      alt={item.category}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </td>

                {/* Complaint ID & Category */}
                <td className="py-4.5 px-6">
                  <span className="text-sm font-extrabold text-slate-900 block leading-tight select-all">
                    #{item.id}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold block mt-1">
                    {item.category}
                  </span>
                </td>

                {/* Citizen */}
                <td className="py-4.5 px-6 vertical-middle">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black select-none shrink-0 shadow-inner ${item.citizenBg}`}>
                      {item.citizenInitials}
                    </div>
                    <span className="text-sm font-bold text-slate-805">
                      {item.citizenName}
                    </span>
                  </div>
                </td>

                {/* Priority */}
                <td className="py-4.5 px-6 vertical-middle">
                  {renderPriority(item.priority)}
                </td>

                {/* Status */}
                <td className="py-4.5 px-6 vertical-middle">
                  {renderStatus(item.status)}
                </td>

                {/* Date Reported */}
                <td className="py-4.5 px-6 text-sm font-bold text-slate-500 vertical-middle">
                  {item.dateReported}
                </td>

                {/* Actions */}
                <td className="py-4.5 px-6 text-right vertical-middle">
                  <button
                    onClick={() => onActionClick && onActionClick(item)}
                    className="p-1.5 text-slate-400 hover:text-[#005c55] hover:bg-slate-50 rounded-lg transition-all cursor-pointer inline-flex active:scale-90"
                    title="Actions"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-[#f8fafc] border-t border-slate-200/60 px-6 py-4.5 flex items-center justify-between select-none">
        <span className="text-xs font-bold text-slate-400">
          Showing 1-10 of {totalCount} complaints
        </span>

        {/* Page controls */}
        <div className="flex items-center gap-1">
          <button className="p-1 text-slate-400 hover:text-[#005c55] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button className="bg-[#005c55] text-white rounded-lg w-8 h-8 flex items-center justify-center text-xs font-extrabold cursor-pointer shadow-sm shadow-[#005c55]/20">
            1
          </button>
          <button className="text-slate-500 hover:text-[#005c55] hover:bg-slate-100 rounded-lg w-8 h-8 flex items-center justify-center text-xs font-extrabold cursor-pointer transition-colors">
            2
          </button>
          <button className="text-slate-500 hover:text-[#005c55] hover:bg-slate-100 rounded-lg w-8 h-8 flex items-center justify-center text-xs font-extrabold cursor-pointer transition-colors">
            3
          </button>
          
          <span className="text-slate-405 text-xs font-bold px-1 select-none">...</span>

          <button className="text-slate-500 hover:text-[#005c55] hover:bg-slate-100 rounded-lg w-8 h-8 flex items-center justify-center text-xs font-extrabold cursor-pointer transition-colors">
            25
          </button>

          <button className="p-1 text-slate-400 hover:text-[#005c55] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
