"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, SlidersHorizontal, Plus, AlertTriangle, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import FilterBar from "@/components/FilterBar";
import ComplaintCard from "@/components/ComplaintCard";
import EmergencyCallout from "@/components/EmergencyCallout";
import Pagination from "@/components/Pagination";
import { initialComplaints, Complaint } from "@/lib/mockData";

export default function ComplaintsPage() {
  const router = useRouter();
  const [activeSidebarTab, setActiveSidebarTab] = useState("complaints");
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    priority: "",
    status: "",
    date: "",
  });
  
  // Sorting state
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "upvotes">("newest");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Emergency Modal state
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencySubmitted, setEmergencySubmitted] = useState(false);



  // Filtering and searching logic
  const filteredComplaints = useMemo(() => {
    return initialComplaints.filter((item) => {
      // Search text match (title, description, location)
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Category match
      const matchesCategory =
        !filters.category || item.category === filters.category;

      // Priority match
      const matchesPriority =
        !filters.priority || item.priority.toLowerCase() === filters.priority;

      // Status match
      const matchesStatus =
        !filters.status || item.status.toLowerCase() === filters.status;

      // Date match
      const matchesDate = !filters.date || item.date === filters.date;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesDate;
    });
  }, [searchQuery, filters]);

  // Sorting logic
  const sortedComplaints = useMemo(() => {
    const list = [...filteredComplaints];
    if (sortBy === "newest") {
      return list.sort((a, b) => b.id.localeCompare(a.id, undefined, { numeric: true, sensitivity: "base" }));
    } else if (sortBy === "oldest") {
      return list.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: "base" }));
    } else if (sortBy === "upvotes") {
      return list.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    }
    return list;
  }, [filteredComplaints, sortBy]);

  // Pagination logic
  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedComplaints.slice(start, start + itemsPerPage);
  }, [sortedComplaints, currentPage]);

  const totalPages = Math.ceil(sortedComplaints.length / itemsPerPage) || 1;

  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setFilters({ category: "", priority: "", status: "", date: "" });
    setCurrentPage(1);
  };

  const handleSelectSort = (mode: "newest" | "oldest" | "upvotes") => {
    setSortBy(mode);
    setSortDropdownOpen(false);
  };

  const handleReportEmergency = () => {
    setShowEmergencyModal(true);
    setEmergencySubmitted(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Global Header */}
      <Navbar activeNav="complaints" isDashboard />

      {/* Main Container Layout */}
      <div className="flex flex-col md:flex-row flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar Nav */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Content Area */}
        <main className="flex-1 space-y-8">
          
          {/* Header Row */}
          <div className="flex items-center justify-between pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Complaints Dashboard
              </h1>
              <p className="text-gray-500 text-sm font-medium mt-1">
                Monitor, search, and manage local municipal issues.
              </p>
            </div>
            
            <Link
              href="/complaints/new"
              className="bg-brand-teal text-white flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold hover:bg-brand-teal-hover transition-all shadow-md shadow-brand-teal/10 hover:shadow-brand-teal/20"
            >
              <Plus className="w-5 h-5 stroke-[3px]" />
              New Complaint
            </Link>
          </div>

          {/* Search Box and Filter Panel */}
          <FilterBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />

          {/* Complaints Header (Count + Sort) */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200/60">
            <h2 className="text-lg font-black text-gray-800 tracking-tight">
              Search Results ({sortedComplaints.length})
            </h2>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center space-x-1.5 text-sm font-bold text-gray-600 hover:text-gray-900 select-none py-1.5"
              >
                <span>Sort by:</span>
                <span className="text-brand-teal font-extrabold">
                  {sortBy === "newest" && "Newest First"}
                  {sortBy === "oldest" && "Oldest First"}
                  {sortBy === "upvotes" && "Most Upvoted"}
                </span>
                <ChevronDown className="w-4.5 h-4.5 text-gray-400 stroke-[2.5px]" />
              </button>

              {sortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-150 rounded-2xl shadow-xl z-20 p-2 animate-fade-in animate-duration-150">
                  <button
                    onClick={() => handleSelectSort("newest")}
                    className={`w-full text-left px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                      sortBy === "newest" ? "bg-teal-50/70 text-brand-teal" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Newest First
                  </button>
                  <button
                    onClick={() => handleSelectSort("oldest")}
                    className={`w-full text-left px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                      sortBy === "oldest" ? "bg-teal-50/70 text-brand-teal" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Oldest First
                  </button>
                  <button
                    onClick={() => handleSelectSort("upvotes")}
                    className={`w-full text-left px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                      sortBy === "upvotes" ? "bg-teal-50/70 text-brand-teal" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Most Upvoted
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cards Grid Layout */}
          {paginatedComplaints.length > 0 ? (
            <div className="grid grid-cols-6 gap-6">
              
              {/* Card 1 & Emergency Callout Box */}
              {currentPage === 1 && paginatedComplaints[0] && (
                <>
                  <div className="col-span-6 lg:col-span-4">
                    <ComplaintCard
                      size="large"
                      {...paginatedComplaints[0]}
                      onClick={() => router.push(`/complaints/${paginatedComplaints[0].id}`)}
                    />
                  </div>
                  <div className="col-span-6 lg:col-span-2">
                    <EmergencyCallout onReportEmergency={handleReportEmergency} />
                  </div>
                </>
              )}

              {/* Card 2 (Full Width) */}
              {currentPage === 1 && paginatedComplaints[1] && (
                <div className="col-span-6">
                  <ComplaintCard
                    size="medium"
                    {...paginatedComplaints[1]}
                    onClick={() => router.push(`/complaints/${paginatedComplaints[1].id}`)}
                  />
                </div>
              )}

              {/* Card 3 & 4 (Side by Side) */}
              {currentPage === 1 && paginatedComplaints.slice(2, 4).map((item) => (
                <div key={item.id} className="col-span-6 lg:col-span-3">
                  <ComplaintCard
                    size="small"
                    {...item}
                    onClick={() => router.push(`/complaints/${item.id}`)}
                  />
                </div>
              ))}

              {/* Fallback for subsequent pages or filtered lists (render as medium list) */}
              {(currentPage > 1 || sortedComplaints.length !== initialComplaints.length) && 
                sortedComplaints.map((item, idx) => {
                  // If page size is filtered, just render them in a clean stacked list
                  // unless it's the first item which we can still show as large or medium
                  const isFirst = idx === 0;
                  return (
                    <div key={item.id} className="col-span-6">
                      <ComplaintCard
                        size={isFirst ? "large" : "medium"}
                        {...item}
                        onClick={() => router.push(`/complaints/${item.id}`)}
                      />
                    </div>
                  );
                })
              }

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-150 py-16 px-6 text-center shadow-sm">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4 stroke-[1.5]" />
              <h3 className="text-lg font-bold text-gray-900">No complaints found</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
                We couldn't find any reports matching your search or filters. Try adjusting them or clear all filters.
              </p>
              <button
                onClick={handleClearAll}
                className="mt-6 bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {sortedComplaints.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}

        </main>
      </div>

      {/* Interactive Emergency Report Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-slate-100 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setShowEmergencyModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>

            {!emergencySubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEmergencySubmitted(true);
                }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 text-red-600">
                  <div className="p-2 bg-red-50 rounded-xl">
                    <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-gray-900">
                    Submit Emergency Report
                  </h3>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed">
                  For immediate hazards (flooding, electrical risk, collapsing structures). MuniFix special response teams will be dispatched in 2 hours.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">
                      Location / Ward
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. GEC Circle intersection, Ward 15"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Explain the hazard in detail..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEmergencyModal(false)}
                    className="flex-1 py-3.5 text-sm font-semibold border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 text-sm font-bold bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl shadow-lg shadow-brand-orange/10 hover:shadow-brand-orange/20 transition-colors"
                  >
                    Dispatch Team
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <svg className="w-8 h-8 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">Emergency Dispatch Sent</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                    MuniFix Emergency Response Unit is now reviewing this report. Dispatch notification was sent to Chattogram City Corporation ward supervisor.
                  </p>
                </div>
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="w-full bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold py-3.5 rounded-xl shadow-md transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Simple Footer */}
      <footer className="bg-slate-100/50 border-t border-slate-200 mt-auto">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-4">
          <span>&copy; 2024 MuniFix Ctg. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#departments" className="hover:text-brand-teal transition-colors">Departments</a>
            <a href="#privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-brand-teal transition-colors">Terms of Service</a>
            <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-brand-teal transition-colors">
              Chattogram City Corporation
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
