"use client";

import React from "react";
import { 
  Filter, 
  Download, 
  Pencil, 
  Trash2, 
  Droplet, 
  Zap, 
  Trash, 
  Wrench 
} from "lucide-react";

export interface DepartmentItem {
  id: string;
  name: string;
  subtitle: string;
  iconType: "water" | "light" | "waste" | "road";
  iconColorClass: string;
  headName: string;
  headAvatarUrl?: string;
  headInitials?: string;
  headBgClass?: string;
  totalStaff: number;
  activeComplaints: number;
  complaintBadgeColorClass: string; // e.g. bg-[#ffe4e6] text-[#e11d48]
}

interface DepartmentTableProps {
  items: DepartmentItem[];
  onEdit?: (item: DepartmentItem) => void;
  onDelete?: (item: DepartmentItem) => void;
  onFilterClick?: () => void;
  onExportClick?: () => void;
}

export default function DepartmentTable({
  items,
  onEdit,
  onDelete,
  onFilterClick,
  onExportClick,
}: DepartmentTableProps) {
  
  // Render department-specific icon
  const renderDeptIcon = (type: DepartmentItem["iconType"], colorClass: string) => {
    const baseStyle = `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${colorClass}`;
    switch (type) {
      case "water":
        return (
          <div className={baseStyle}>
            <Droplet className="w-5 h-5" />
          </div>
        );
      case "light":
        return (
          <div className={baseStyle}>
            <Zap className="w-5 h-5" />
          </div>
        );
      case "waste":
        return (
          <div className={baseStyle}>
            <Trash className="w-5 h-5" />
          </div>
        );
      case "road":
        return (
          <div className={baseStyle}>
            <Wrench className="w-5 h-5" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden font-sans w-full">
      {/* Table Header Section */}
      <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 select-none">
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            Active Departments
          </h3>
          <p className="text-slate-500 text-xs font-semibold mt-1">
            Oversee municipal divisions and resource allocation
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onFilterClick}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-350 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter</span>
          </button>
          <button
            onClick={onExportClick}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-350 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* The Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto min-w-[700px]">
          <thead className="bg-[#f8fafc] border-b border-slate-200/50 select-none">
            <tr>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Department Name
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Head of Department
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Total Staff
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Active Complaints
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-150/70">
            {items.map((item) => (
              <tr key={item.id} className="transition-colors duration-150 hover:bg-slate-50/40">
                {/* Department Name */}
                <td className="py-4 px-6 vertical-middle">
                  <div className="flex items-center gap-3.5">
                    {renderDeptIcon(item.iconType, item.iconColorClass)}
                    <div>
                      <span className="text-sm font-extrabold text-slate-850 block leading-tight">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-550 font-semibold block mt-1.5">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Head of Department */}
                <td className="py-4 px-6 vertical-middle">
                  <div className="flex items-center gap-3">
                    {item.headAvatarUrl ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                        <img
                          src={item.headAvatarUrl}
                          alt={item.headName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black select-none shrink-0 shadow-inner ${item.headBgClass}`}>
                        {item.headInitials}
                      </div>
                    )}
                    <span className="text-sm font-bold text-slate-800">
                      {item.headName}
                    </span>
                  </div>
                </td>

                {/* Total Staff */}
                <td className="py-4 px-6 text-sm font-bold text-slate-650 vertical-middle">
                  {item.totalStaff} Members
                </td>

                {/* Active Complaints */}
                <td className="py-4 px-6 vertical-middle">
                  <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide select-none leading-none ${item.complaintBadgeColorClass}`}>
                    {item.activeComplaints} Pending
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right vertical-middle">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit && onEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-[#005c55] hover:bg-slate-50 rounded-lg transition-all cursor-pointer inline-flex active:scale-90"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(item)}
                      className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-all cursor-pointer inline-flex active:scale-90"
                      title="Delete"
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

      {/* Table Pagination Footer */}
      <div className="bg-[#f8fafc] border-t border-slate-200/60 px-6 py-4 flex items-center justify-between select-none">
        <span className="text-xs font-bold text-slate-400">
          Showing 1-{items.length} of 12 departments
        </span>

        {/* Previous and Next buttons */}
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-400 cursor-not-allowed select-none">
            Previous
          </button>
          <button className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-650 cursor-pointer active:scale-95 transition-all select-none">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
