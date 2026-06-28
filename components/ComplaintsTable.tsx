"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ComplaintItem {
  id: string;
  title: string;
  subtitle: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  category: string;
  reported: string;
  location: string;
}

interface ComplaintsTableProps {
  items: ComplaintItem[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  totalCount?: number;
  onAssignClick?: (item: ComplaintItem) => void;
}

export default function ComplaintsTable({
  items,
  selectedIds,
  onSelectionChange,
  totalCount = 28,
  onAssignClick,
}: ComplaintsTableProps) {
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectionChange(items.map((item) => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((rowId) => rowId !== id));
    }
  };

  const isAllSelected = items.length > 0 && selectedIds.length === items.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < items.length;

  // Custom priority badge helper
  const renderPriorityBadge = (priority: ComplaintItem["priority"]) => {
    const styles = {
      Critical: "bg-red-50 text-red-600 border-red-100",
      High: "bg-amber-50 text-amber-600 border-amber-100",
      Medium: "bg-teal-50 text-teal-600 border-teal-100",
      Low: "bg-slate-50 text-slate-500 border-slate-200",
    };

    const dotColors = {
      Critical: "bg-red-500",
      High: "bg-amber-500",
      Medium: "bg-teal-500",
      Low: "bg-slate-400",
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border select-none ${styles[priority]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[priority]}`} />
        {priority}
      </span>
    );
  };

  // Custom category badge helper
  const renderCategoryBadge = (category: string) => {
    const isWater = category.toLowerCase().includes("water");
    const styleClass = isWater
      ? "bg-blue-50 text-blue-700 border-blue-100/50"
      : "bg-slate-100/80 text-slate-700 border-slate-200/50";
    return (
      <span className={`inline-block px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border select-none ${styleClass}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-150 shadow-sm overflow-hidden font-sans w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto min-w-[700px]">
          {/* Table Header */}
          <thead className="bg-[#f8fafc] border-b border-slate-100 select-none">
            <tr>
              <th className="py-4 pl-6 pr-4 w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = isPartiallySelected;
                    }
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded text-brand-teal focus:ring-brand-teal border-gray-300 cursor-pointer"
                />
              </th>
              <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-36">
                Priority
              </th>
              <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Complaint Details
              </th>
              <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">
                Category
              </th>
              <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-32">
                Reported
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">
                Location
              </th>
              {onAssignClick && (
                <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest w-24">
                  Action
                </th>
              )}
            </tr>
          </thead>

          {/* Table Rows */}
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <tr
                  key={item.id}
                  className={`transition-colors duration-150 hover:bg-slate-50/50 ${
                    isSelected ? "bg-brand-teal/[0.02]" : ""
                  }`}
                >
                  <td className="py-4.5 pl-6 pr-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                      className="w-4 h-4 rounded text-brand-teal focus:ring-brand-teal border-gray-300 cursor-pointer"
                    />
                  </td>
                  <td className="py-4.5 px-4 vertical-middle">
                    {renderPriorityBadge(item.priority)}
                  </td>
                  <td className="py-4.5 px-4">
                    <span className="text-sm font-bold text-slate-800 leading-tight block">
                      {item.title}
                    </span>
                    <span className="text-xxs sm:text-xs text-gray-450 font-semibold leading-relaxed block mt-0.5 line-clamp-1">
                      {item.subtitle}
                    </span>
                  </td>
                  <td className="py-4.5 px-4 vertical-middle">
                    {renderCategoryBadge(item.category)}
                  </td>
                  <td className="py-4.5 px-4 text-xs font-bold text-slate-500">
                    {item.reported}
                  </td>
                  <td className="py-4.5 px-6 text-xs font-bold text-slate-500">
                    {item.location}
                  </td>
                  {onAssignClick && (
                    <td className="py-4.5 px-6 vertical-middle">
                      <button
                        onClick={() => onAssignClick(item)}
                        className="text-brand-teal hover:underline font-bold text-xs cursor-pointer select-none active:scale-[0.98]"
                      >
                        Assign
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-[#f8fafc] border-t border-slate-100 px-6 py-4 flex items-center justify-between select-none">
        <span className="text-xs font-bold text-slate-400">
          Showing 1 to {items.length} of {totalCount} unassigned complaints
        </span>

        {/* Page controls */}
        <div className="flex items-center gap-1.5">
          <button className="p-1 text-slate-450 hover:text-brand-teal hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0">
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
          
          <button className="bg-brand-teal text-white rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer">
            1
          </button>
          <button className="text-slate-450 hover:text-brand-teal hover:bg-slate-100 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition-colors">
            2
          </button>
          <button className="text-slate-450 hover:text-brand-teal hover:bg-slate-100 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition-colors">
            3
          </button>

          <button className="p-1 text-slate-450 hover:text-brand-teal hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0">
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
