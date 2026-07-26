"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import ComplaintFilters from "@/components/ComplaintFilters";
import ComplaintsTable, { ComplaintItem } from "@/components/ComplaintsTable";

export default function AdminComplaintsPage() {
  const [activeNav, setActiveNav] = useState("complaints");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Select dates...");

  // Exact mock data matching the screenshot
  const mockComplaints: ComplaintItem[] = [
    {
      id: "FIX-8842",
      category: "Water Leakage",
      department: "Water Supply",
      departmentDotColor: "bg-blue-500",
      priority: "Critical",
      status: "In Progress",
      dateReported: "Oct 24, 2024, 09:12 AM",
      thumbnail: "/water.png",
    },
    {
      id: "FIX-8841",
      category: "Garbage Overflow",
      department: "Waste Mgmt",
      departmentDotColor: "bg-green-500",
      priority: "Medium",
      status: "Pending",
      dateReported: "Oct 23, 2024, 04:45 PM",
      thumbnail: "/garbage.png",
    },
    {
      id: "FIX-8839",
      category: "Road Pothole",
      department: "Infrastructure",
      departmentDotColor: "bg-orange-500",
      priority: "High",
      status: "Resolved",
      dateReported: "Oct 22, 2024, 11:30 AM",
      thumbnail: "/pothole.png",
    },
    {
      id: "FIX-8835",
      category: "Broken Street Light",
      department: "Public Safety",
      departmentDotColor: "bg-red-500",
      priority: "Medium",
      status: "Under Review",
      dateReported: "Oct 21, 2024, 08:20 PM",
      thumbnail: "/street_light.png",
    },
  ];

  // Reset Filters logic
  const handleResetFilters = () => {
    setDepartmentFilter("All");
    setPriorityFilter("All");
    setStatusFilter("All");
    setDateRange("Select dates...");
    setSearchTerm("");
  };

  // Filter complaints based on user selections
  const filteredComplaints = mockComplaints.filter((comp) => {
    // Search Term matching (ID, category, department)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesId = comp.id.toLowerCase().includes(term);
      const matchesCategory = comp.category.toLowerCase().includes(term);
      const matchesDept = comp.department.toLowerCase().includes(term);
      if (!matchesId && !matchesCategory && !matchesDept) {
        return false;
      }
    }

    // Department filter
    if (departmentFilter !== "All" && comp.department !== departmentFilter) {
      return false;
    }

    // Priority filter
    if (priorityFilter !== "All" && comp.priority !== priorityFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== "All" && comp.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 flex font-sans">
      {/* Sidebar - Left panel */}
      <AdminSidebar 
        activeNav={activeNav} 
        onNavClick={setActiveNav} 
        hideUsersAndDepartments={true}
        settingsPlacement="top"
        newReportPlacement="bottom"
      />

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          {/* Reusable Header bar */}
          <AdminHeader 
            variant="overview" 
            title="Complaint Overview" 
            userRole="Super Administrator"
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />

          {/* Main Container */}
          <main className="px-8 py-6 space-y-6 flex-1">
            {/* Filter controls */}
            <ComplaintFilters
              department={departmentFilter}
              setDepartment={setDepartmentFilter}
              status={statusFilter}
              setStatus={setStatusFilter}
              priority={priorityFilter}
              setPriority={setPriorityFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
              onApply={() => {
                // Apply filter feedback or actions
              }}
              onExport={() => {
                alert("Exporting data as CSV/Excel...");
              }}
            />

            {/* Complaints Table */}
            <ComplaintsTable
              items={filteredComplaints}
              totalCount={1248}
            />
          </main>
        </div>

        {/* Global Footer */}
        <footer className="bg-transparent py-6 px-8 flex flex-col justify-center items-center text-xs font-semibold text-slate-500 gap-3 mt-8">
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
