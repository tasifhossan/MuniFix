"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, SlidersHorizontal, Plus, AlertTriangle, X, Loader2, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import FilterBar from "@/components/FilterBar";
import ComplaintCard from "@/components/ComplaintCard";
import { searchComplaints } from "@/lib/api";

export default function SearchPage() {
  const router = useRouter();
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
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
  const itemsPerPage = 5;

  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search/filter results whenever debounced query or filters change
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Build dynamic parameters (only include non-empty values)
        const params: any = {};
        if (debouncedSearchQuery.trim() !== "") params.q = debouncedSearchQuery;
        if (filters.category) params.category = filters.category;
        if (filters.priority) params.priority = filters.priority;
        if (filters.status) params.status = filters.status;
        if (filters.date) params.date = filters.date;

        const data = await searchComplaints(params);
        if (data.success) {
          const rawList = data.complains ?? data.complaints ?? [];
          const mapped = rawList.map((c: any) => ({
            id: c.id,
            title: c.category + " Issue - " + (c.citizen_name || "Citizen Report"),
            description: c.description,
            priority: c.priority === "critical" || c.priority === "high" ? "CRITICAL" : c.priority === "low" ? "LOW" : "MEDIUM",
            status: c.status === "assigned" ? "Dispatched" : c.status === "in_progress" ? "In Progress" : c.status === "resolved" ? "Resolved" : c.status === "cancelled" ? "Cancelled" : "Pending Approval",
            location: c.latitude && c.longitude ? `${c.latitude}, ${c.longitude}` : "Chattogram City",
            time: `Reported on ${new Date(c.created_at).toLocaleDateString()} • ${new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            image: Array.isArray(c.image_url) && c.image_url.length > 0 ? c.image_url[0] : (typeof c.image_url === "string" ? c.image_url : "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop"),
            category: c.category,
            date: c.created_at,
            reporter: c.citizen_name,
            upvotes: c.upvotes || 0,
            original: c
          }));
          setComplaints(mapped);
        } else {
          setError(data.message || "Failed to load complaints");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load complaints");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [debouncedSearchQuery, filters]);

  // Sorting logic
  const sortedComplaints = useMemo(() => {
    const list = [...complaints];
    if (sortBy === "newest") {
      return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "oldest") {
      return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "upvotes") {
      return list.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    }
    return list;
  }, [complaints, sortBy]);

  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setFilters({ category: "", priority: "", status: "", date: "" });
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Global Header */}
      <Navbar activeNav="" isDashboard />

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
                Search Complaints
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm font-semibold mt-1">
                Explore registered municipal tasks and civic challenges
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
            disabled={loading}
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
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-150 rounded-2xl shadow-xl z-20 p-2">
                  <button
                    onClick={() => { setSortBy("newest"); setSortDropdownOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                      sortBy === "newest" ? "bg-teal-50/70 text-brand-teal" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Newest First
                  </button>
                  <button
                    onClick={() => { setSortBy("oldest"); setSortDropdownOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                      sortBy === "oldest" ? "bg-teal-50/70 text-brand-teal" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Oldest First
                  </button>
                  <button
                    onClick={() => { setSortBy("upvotes"); setSortDropdownOpen(false); }}
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

          {/* Main List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl border border-slate-150 p-6 flex flex-col sm:flex-row gap-6 animate-pulse">
                  <div className="w-full sm:w-56 h-40 sm:h-36 bg-slate-100 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-5/6" />
                    <div className="flex gap-4 pt-4">
                      <div className="h-3 bg-slate-100 rounded w-24" />
                      <div className="h-3 bg-slate-100 rounded w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-3xl border border-gray-150 p-12 text-center shadow-sm">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-base font-extrabold text-gray-800">Failed to Load Results</h3>
              <p className="text-gray-400 text-xs mt-1">{error}</p>
            </div>
          ) : sortedComplaints.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-150 p-16 text-center shadow-sm space-y-3">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-gray-800 tracking-tight">No Results Found</h3>
              <p className="text-gray-500 text-xs max-w-sm mx-auto leading-relaxed">
                We couldn't find any reports matching your search or filters. Try adjusting them or clear all filters.
              </p>
              {searchQuery || Object.values(filters).some(Boolean) ? (
                <button
                  onClick={handleClearAll}
                  className="mt-2 text-xs font-bold text-brand-teal hover:underline cursor-pointer"
                >
                  Clear all search parameters
                </button>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedComplaints.map((item) => (
                <ComplaintCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  priority={item.priority}
                  status={item.status}
                  location={item.location}
                  time={item.time}
                  image={item.image}
                  upvotes={item.upvotes}
                  onClick={() => router.push(`/complaints/${item.id}`)}
                />
              ))}
            </div>
          )}

        </main>
      </div>
      
      {/* Global Simple Footer */}
      <footer className="bg-slate-100/50 border-t border-slate-200 mt-auto">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-4">
          <span>&copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</span>
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
