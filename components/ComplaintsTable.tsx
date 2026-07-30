"use client";

import React from "react";
import { ChevronLeft, ChevronRight, AlertTriangle, UserCheck, Trash2 } from "lucide-react";

export interface ComplaintItem {
  id: string; // e.g. "FIX-8842"
  category: string; // e.g. "Water Leakage"
  department: string; // e.g. "Water Supply"
  departmentId?: number;
  departmentDotColor: string; // e.g. "bg-sky-500"
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Assigned" | "Resolved" | "Under Review";
  dateReported: string; // e.g. "Oct 24, 2024, 09:12 AM"
  thumbnail: string; // e.g. "/water.png"
  aiConfidence?: number | null;
}

interface ComplaintsTableProps {
  items: ComplaintItem[];
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onAssignClick?: (item: ComplaintItem) => void;
  onStatusChange?: (id: string, newStatus: string) => void;
  onDeleteClick?: (id: string) => void;
}

export default function ComplaintsTable({
  items,
  totalCount = 1248,
  currentPage = 1,
  onPageChange,
  onAssignClick,
  onStatusChange,
  onDeleteClick,
}: ComplaintsTableProps) {
  
  // Custom Priority Badge with dot
  const renderPriority = (priority: ComplaintItem["priority"]) => {
    const styles = {
      Critical: { bg: "bg-[#ffe4e6]", text: "text-[#e11d48]", dot: "bg-[#ef4444]" },
      High: { bg: "bg-[#ffedd5]", text: "text-[#d97706]", dot: "bg-[#f97316]" },
      Medium: { bg: "bg-[#fef3c7]", text: "text-[#b45309]", dot: "bg-[#eab308]" },
      Low: { bg: "bg-[#f1f5f9]", text: "text-[#475569]", dot: "bg-[#64748b]" },
    };
    const current = styles[priority] || styles.Low;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase select-none ${current.bg} ${current.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
        {priority}
      </span>
    );
  };

  // Custom Status Badges matching the screenshot
  const renderStatus = (status: ComplaintItem["status"]) => {
    const styles = {
      "Pending": { bg: "bg-[#dbeafe]", text: "text-[#1d4ed8]" },
      "In Progress": { bg: "bg-[#ffedd5]", text: "text-[#d97706]" },
      "Resolved": { bg: "bg-[#d1fae5]", text: "text-[#047857]" },
      "Under Review": { bg: "bg-[#f3e8ff]", text: "text-[#6b21a8]" },
      "Assigned": { bg: "bg-[#e0f2fe]", text: "text-[#0369a1]" },
    };
    const current = styles[status] || styles.Pending;
    return (
      <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase select-none leading-none ${current.bg} ${current.text}`}>
        {status}
      </span>
    );
  };

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden font-sans w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto min-w-[800px]">
          {/* Table Header */}
          <thead className="bg-[#f8fafc] border-b border-slate-200/60 select-none">
            <tr>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Complaint ID
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                Media
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Category
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Department
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
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
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
                {/* Complaint ID */}
                <td className="py-4.5 px-6 vertical-middle">
                  <span className="text-sm font-extrabold text-[#0f766e] block leading-tight select-all">
                    #{item.id}
                  </span>
                </td>

                {/* Media */}
                <td className="py-4.5 px-6">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-150 shadow-sm shrink-0 bg-slate-50">
                    <img
                      src={item.thumbnail}
                      alt={item.category}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </td>

                {/* Category */}
                <td className="py-4.5 px-6 vertical-middle">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-800 leading-tight">
                      {item.category}
                    </span>
                    {item.aiConfidence !== undefined && item.aiConfidence !== null && item.aiConfidence < 70 && (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-650 px-2 py-0.5 rounded text-[9px] font-black tracking-wide uppercase max-w-max border border-red-100/60 leading-none">
                        <AlertTriangle className="w-2.5 h-2.5 text-red-500 shrink-0" />
                        <span>Needs Manual Review</span>
                      </span>
                    )}
                  </div>
                </td>

                {/* Department */}
                <td className="py-4.5 px-6 vertical-middle">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.departmentDotColor}`} />
                    <span className="text-sm font-bold text-slate-700">
                      {item.department}
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
                <td className="py-4.5 px-6 text-xs font-bold text-slate-500 vertical-middle">
                  {item.dateReported}
                </td>

                {/* Actions */}
                <td className="py-4.5 px-6 text-right vertical-middle">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onAssignClick?.(item)}
                      className="p-1.5 text-slate-400 hover:text-[#005c55] hover:bg-slate-50 rounded-lg transition-all cursor-pointer inline-flex active:scale-90"
                      title="Assign Field Worker"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                    <select
                      value={item.status}
                      onChange={(e) => onStatusChange?.(item.id, e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700 font-bold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Under Review">Under Review</option>
                    </select>
                    <button
                      onClick={() => onDeleteClick?.(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-655 hover:bg-red-50 rounded-lg transition-all cursor-pointer inline-flex active:scale-90"
                      title="Delete Complaint"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-white border-t border-slate-200/60 px-6 py-4.5 flex items-center justify-between select-none">
        <span className="text-xs font-bold text-slate-500">
          Showing 1 to {items.length} of {totalCount} entries
        </span>

        {/* Page controls */}
        <div className="flex items-center gap-1.5">
          <button 
            disabled={currentPage === 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#005c55] hover:bg-slate-50 transition-colors cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {pages.map((p) => {
            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                onClick={() => onPageChange?.(p)}
                className={`rounded-lg w-8 h-8 flex items-center justify-center text-xs font-extrabold cursor-pointer transition-all ${
                  isCurrent
                    ? "bg-[#005c55] text-white shadow-sm shadow-[#005c55]/20"
                    : "bg-white border border-slate-200 text-slate-700 hover:text-[#005c55] hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#005c55] hover:bg-slate-50 transition-colors cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

