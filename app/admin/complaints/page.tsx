"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AssignmentControls from "@/components/AssignmentControls";
import ComplaintsTable from "@/components/ComplaintsTable";
import AssignWorkerModal from "@/components/AssignWorkerModal";

export default function AdminComplaintsPage() {
  const [activeNav, setActiveNav] = useState("complaints");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeAssignComplaint, setActiveAssignComplaint] = useState<any>(null);

  // Mock list of unassigned complaints matching the screenshot
  const mockComplaints = [
    {
      id: "comp-1",
      priority: "Critical" as const,
      title: "Burst Main Pipe - Agrabad Access Rd",
      subtitle: "Severe flooding affecting residential blocks near the main access road intersection.",
      category: "Water & Sewerage",
      reported: "2 Hours Ago",
      location: "Agrabad Ward 24"
    },
    {
      id: "comp-2",
      priority: "High" as const,
      title: "Street Light Outage - GEC Circle",
      subtitle: "Three poles inactive, creating safety hazard for commuters and pedestrians alike.",
      category: "Electrical",
      reported: "5 Hours Ago",
      location: "Nasirabad Ward 15"
    },
    {
      id: "comp-3",
      priority: "Medium" as const,
      title: "Pothole Collection - Muradpur",
      subtitle: "Large pothole damaging small vehicles near flyover ramp.",
      category: "Roads & Maintenance",
      reported: "1 Day Ago",
      location: "Panchlaish Ward 8"
    },
    {
      id: "comp-4",
      priority: "Low" as const,
      title: "Garbage Pileup - Oxygen Mor",
      subtitle: "Secondary collection point overflowing onto the side walkway.",
      category: "Waste Management",
      reported: "1 Day Ago",
      location: "Oxygen Ward 2"
    }
  ];

  // Handle mock bulk assignment submit
  const handleAssignSubmit = (workerName: string) => {
    setSelectedIds([]);
  };

  // Filter complaints list based on search term
  const filteredComplaints = mockComplaints.filter((comp) =>
    comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/30 flex font-sans">
      {/* Sidebar - Admin navigation panel on left */}
      <AdminSidebar activeNav={activeNav} onNavClick={setActiveNav} />

      {/* Main Panel Content Area */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        
        {/* Main Content scrollable wrapper */}
        <main className="px-6 sm:px-8 py-6 space-y-6 flex-1">
          {/* Header Row */}
          <div className="flex items-center justify-between py-4 border-b border-slate-200/60 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">
                Assignment Queue
              </h2>
              <p className="text-gray-500 text-xs font-semibold mt-1.5">
                Manage and bulk assign unallocated municipal complaints.
              </p>
            </div>

            {/* Profile Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bulk Action Controls */}
          <AssignmentControls
            selectedCount={selectedIds.length}
            onAssign={handleAssignSubmit}
            onSearchChange={setSearchTerm}
          />

          {/* Complaints Table display */}
          <ComplaintsTable
            items={filteredComplaints}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            totalCount={28}
            onAssignClick={setActiveAssignComplaint}
          />
        </main>

        {/* Global Footer */}
        <footer className="bg-slate-100/50 border-t border-slate-200/60 py-6 px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-4 mt-8">
          <span>&copy; {new Date().getFullYear()} Chattogram City Corporation. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-brand-teal transition-colors">Terms of Service</a>
            <a href="#faq" className="hover:text-brand-teal transition-colors">FAQ</a>
          </div>
        </footer>

      </div>

      {/* Assign Field Worker Modal Dialog */}
      <AssignWorkerModal
        isOpen={activeAssignComplaint !== null}
        onClose={() => setActiveAssignComplaint(null)}
        complaintId={activeAssignComplaint?.id.replace("comp-", "882") || "8821"}
        priority={activeAssignComplaint?.priority || "High"}
        category={activeAssignComplaint?.category || "Waste Management"}
        location={activeAssignComplaint?.location || "South Agrabad, Block G"}
        onConfirm={(worker) => {
          alert(`Worker "${worker}" successfully assigned to Complaint #${activeAssignComplaint?.id}!`);
        }}
      />
    </div>
  );
}
