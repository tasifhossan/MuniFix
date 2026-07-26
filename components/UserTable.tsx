"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export interface UserItem {
  id: string;
  name: string;
  avatarUrl: string;
  memberSince: string;
  email: string;
  role: "Super Admin" | "Field Worker" | "Citizen" | "Dept Admin";
  status: "Active" | "Inactive";
}

interface UserTableProps {
  items: UserItem[];
  totalCount?: number;
  onEditClick?: (user: UserItem) => void;
}

export default function UserTable({
  items,
  totalCount = 12842,
  onEditClick,
}: UserTableProps) {
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Banned">("All");

  // Render role badges matching the screenshot colors
  const renderRoleBadge = (role: UserItem["role"]) => {
    switch (role) {
      case "Super Admin":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200/50 select-none">
            Super Admin
          </span>
        );
      case "Field Worker":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100/55 select-none">
            Field Worker
          </span>
        );
      case "Citizen":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 select-none">
            Citizen
          </span>
        );
      case "Dept Admin":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-[#4f46e5] bg-[#e0e7ff] border border-indigo-100 select-none">
            Dept Admin
          </span>
        );
      default:
        return null;
    }
  };

  // Render status indicator with dot
  const renderStatus = (status: UserItem["status"]) => {
    if (status === "Active") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-600 bg-red-50 border border-red-100/50 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Inactive
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden font-sans w-full">
      {/* Table Header Section with Tabs and Counts */}
      <div className="px-6 py-4 flex flex-wrap items-center justify-between border-b border-slate-100 select-none">
        {/* Tabs */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("All")}
            className={`text-sm font-extrabold pb-3 pt-2 relative transition-colors ${
              activeTab === "All" ? "text-[#005c55]" : "text-slate-450 hover:text-[#005c55]"
            }`}
          >
            All Users
            {activeTab === "All" && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#005c55] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("Pending")}
            className={`text-sm font-extrabold pb-3 pt-2 relative transition-colors ${
              activeTab === "Pending" ? "text-[#005c55]" : "text-slate-450 hover:text-[#005c55]"
            }`}
          >
            Pending Approval
            {activeTab === "Pending" && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#005c55] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("Banned")}
            className={`text-sm font-extrabold pb-3 pt-2 relative transition-colors ${
              activeTab === "Banned" ? "text-[#005c55]" : "text-slate-450 hover:text-[#005c55]"
            }`}
          >
            Banned
            {activeTab === "Banned" && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#005c55] rounded-full" />
            )}
          </button>
        </div>

        {/* Count details */}
        <span className="text-xs font-bold text-slate-400">
          Showing 1-10 of {totalCount.toLocaleString()}
        </span>
      </div>

      {/* The Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto min-w-[700px]">
          <thead className="bg-[#f8fafc] border-b border-slate-200/50 select-none">
            <tr>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-64">
                User Info
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Email
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Role
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Status
              </th>
              <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-150/70">
            {items.map((item) => (
              <tr key={item.id} className="transition-colors duration-150 hover:bg-slate-50/40">
                {/* User Info */}
                <td className="py-4.5 px-6 vertical-middle">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                      <img
                        src={item.avatarUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-slate-850 block leading-tight">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-450 font-bold block mt-1">
                        {item.memberSince}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4.5 px-6 text-sm font-bold text-slate-500 select-all vertical-middle">
                  {item.email}
                </td>

                {/* Role */}
                <td className="py-4.5 px-6 vertical-middle">
                  {renderRoleBadge(item.role)}
                </td>

                {/* Status */}
                <td className="py-4.5 px-6 vertical-middle">
                  {renderStatus(item.status)}
                </td>

                {/* Actions */}
                <td className="py-4.5 px-6 text-right vertical-middle">
                  {onEditClick && (
                    <button
                      onClick={() => onEditClick(item)}
                      className="p-1.5 text-slate-400 hover:text-[#005c55] hover:bg-slate-50 rounded-lg transition-all cursor-pointer inline-flex active:scale-90"
                      title="Actions"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="bg-[#f8fafc] border-t border-slate-200/60 px-6 py-4 flex items-center justify-between select-none">
        <span className="text-xs font-bold text-slate-450">
          Rows per page: 10
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
            128
          </button>

          <button className="p-1 text-slate-400 hover:text-[#005c55] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
