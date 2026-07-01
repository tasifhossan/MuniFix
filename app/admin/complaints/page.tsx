"use client";

import React, { useState } from "react";
import { Download, ClipboardCheck } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import ComplaintFilters from "@/components/ComplaintFilters";
import ComplaintsTable, { ComplaintItem } from "@/components/ComplaintsTable";

export default function AdminComplaintsPage() {
  const [activeNav, setActiveNav] = useState("complaints");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Oct 1, 2024 - Oct 14, 2024");

  // Exact mock data matching the screenshot
  const mockComplaints: ComplaintItem[] = [
    {
      id: "CTG-8821",
      category: "Road Maintenance",
      citizenName: "Mushfiq Ahmed",
      citizenInitials: "MA",
      citizenBg: "bg-[#e0e7ff] text-[#4f46e5]",
      priority: "Critical",
      status: "Pending",
      dateReported: "Oct 14, 2024",
      thumbnail: "/pothole.png",
    },
    {
      id: "CTG-8794",
      category: "Waste Management",
      citizenName: "Saima Khan",
      citizenInitials: "SK",
      citizenBg: "bg-[#d1fae5] text-[#047857]",
      priority: "High",
      status: "In Progress",
      dateReported: "Oct 12, 2024",
      thumbnail: "/garbage.png",
    },
    {
      id: "CTG-8752",
      category: "Water Supply",
      citizenName: "Rafiq J.",
      citizenInitials: "RJ",
      citizenBg: "bg-[#f1f5f9] text-[#475569]",
      priority: "Medium",
      status: "Assigned",
      dateReported: "Oct 11, 2024",
      thumbnail: "/water.png",
    },
    {
      id: "CTG-8720",
      category: "Street Lighting",
      citizenName: "Tanvir H.",
      citizenInitials: "TH",
      citizenBg: "bg-[#fef3c7] text-[#b45309]",
      priority: "Low",
      status: "Assigned (Purple)",
      dateReported: "Oct 09, 2024",
      thumbnail: "/street_light.png",
    },
  ];

  // Reset Filters logic
  const handleResetFilters = () => {
    setCategoryFilter("All");
    setPriorityFilter("All");
    setStatusFilter("All");
    setDateRange("Oct 1, 2024 - Oct 14, 2024");
    setSearchTerm("");
  };

  // Filter complaints based on user selections
  const filteredComplaints = mockComplaints.filter((comp) => {
    // Search Term matching (ID, citizen, category)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesId = comp.id.toLowerCase().includes(term);
      const matchesCitizen = comp.citizenName.toLowerCase().includes(term);
      const matchesCategory = comp.category.toLowerCase().includes(term);
      if (!matchesId && !matchesCitizen && !matchesCategory) {
        return false;
      }
    }

    // Category filter
    if (categoryFilter !== "All" && comp.category !== categoryFilter) {
      return false;
    }

    // Priority filter
    if (priorityFilter !== "All" && comp.priority !== priorityFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== "All") {
      const statusMap: Record<string, string> = {
        Pending: "Pending",
        "In Progress": "In Progress",
        Assigned: "Assigned",
        Resolved: "Resolved",
      };
      // Combine Assigned and Assigned (Purple) if Status is "Assigned"
      if (statusFilter === "Assigned") {
        if (comp.status !== "Assigned" && comp.status !== "Assigned (Purple)") {
          return false;
        }
      } else if (comp.status !== statusMap[statusFilter]) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/30 flex font-sans">
      {/* Sidebar - Left panel */}
      <AdminSidebar activeNav={activeNav} onNavClick={setActiveNav} />

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          {/* Reusable Header bar */}
          <AdminHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          {/* Main Container */}
          <main className="px-8 py-6 space-y-6 flex-1">
            {/* Page Title & Actions Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                  Complaint Management
                </h1>
                <p className="text-slate-500 text-sm font-semibold mt-2">
                  Review, assign, and resolve municipal issues reported by citizens.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-205 cursor-pointer active:scale-[0.98] shadow-sm select-none">
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Export Data</span>
                </button>
                <button className="inline-flex items-center gap-2 bg-[#005c55] hover:bg-[#004540] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-205 cursor-pointer active:scale-[0.98] shadow-md shadow-[#005c55]/10 select-none">
                  <ClipboardCheck className="w-4 h-4 text-white" />
                  <span>Bulk Assign</span>
                </button>
              </div>
            </div>

            {/* Filter controls */}
            <ComplaintFilters
              category={categoryFilter}
              setCategory={setCategoryFilter}
              priority={priorityFilter}
              setPriority={setPriorityFilter}
              status={statusFilter}
              setStatus={setStatusFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
              onReset={handleResetFilters}
            />

            {/* Complaints Table */}
            <ComplaintsTable
              items={filteredComplaints}
              totalCount={245}
              onActionClick={(item) => {
                alert(`Viewing action details for Complaint #${item.id}`);
              }}
            />
          </main>
        </div>

        {/* Global Footer */}
        <footer className="bg-slate-100/50 border-t border-slate-200/60 py-6 px-8 flex flex-col justify-center items-center text-xs font-semibold text-slate-500 gap-3 mt-8">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 select-none">
            <a href="#departments" className="hover:text-[#005c55] transition-colors">Departments</a>
            <a href="#privacy" className="hover:text-[#005c55] transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#005c55] transition-colors">Terms of Service</a>
            <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-[#005c55] transition-colors">
              Chattogram City Corporation
            </a>
          </div>
          <span className="select-none text-slate-400 mt-1">
            &copy; 2024 MuniFix Ctg. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}
