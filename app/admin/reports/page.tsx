"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  UserCheck, 
  RefreshCw, 
  LogIn, 
  AlertTriangle, 
  ChevronDown, 
  Calendar, 
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import UserStatsCard from "@/components/UserStatsCard";
import { useAuth } from "@/contexts/AuthContext";
import { fetchActivityLogs } from "@/lib/api";

interface LogActor {
  name: string | null;
  email: string | null;
  role: string | null;
}

interface LogItem {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  description: string;
  created_at: string;
  actor: LogActor;
}

/** Returns an icon + colour config for a given action string */
function getLogMeta(action: string): {
  icon: React.ReactNode;
  bgClass: string;
  textClass: string;
  borderClass: string;
  label: string;
} {
  switch (action) {
    case "complaint_assigned":
    case "user_activated":
      return {
        icon: <UserCheck className="w-4.5 h-4.5" />,
        bgClass: "bg-[#e6f4f2]",
        textClass: "text-[#005c55]",
        borderClass: "border-teal-100/60",
        label: action === "complaint_assigned" ? "Worker Assigned" : "User Activated",
      };
    case "status_updated":
    case "category_overridden":
      return {
        icon: <RefreshCw className="w-4 h-4" />,
        bgClass: "bg-[#fef3c7]",
        textClass: "text-[#b45309]",
        borderClass: "border-amber-100/60",
        label: action === "status_updated" ? "Status Change" : "Category Override",
      };
    case "user_login":
    case "user_registered":
      return {
        icon: <LogIn className="w-4 h-4" />,
        bgClass: "bg-[#e0f2fe]",
        textClass: "text-[#0369a1]",
        borderClass: "border-sky-100/60",
        label: action === "user_login" ? "User Login" : "User Registered",
      };
    case "complaint_submitted":
      return {
        icon: <TrendingUp className="w-4 h-4" />,
        bgClass: "bg-[#f0fdf4]",
        textClass: "text-[#166534]",
        borderClass: "border-green-100/60",
        label: "Complaint Submitted",
      };
    case "complaint_deleted":
    case "user_deactivated":
      return {
        icon: <AlertTriangle className="w-4.5 h-4.5" />,
        bgClass: "bg-[#ffe4e6]",
        textClass: "text-[#e11d48]",
        borderClass: "border-red-100/60",
        label: action === "complaint_deleted" ? "Complaint Deleted" : "User Deactivated",
      };
    case "department_created":
    case "department_updated":
    case "department_deleted":
      return {
        icon: <Users className="w-4 h-4" />,
        bgClass: "bg-[#ede9fe]",
        textClass: "text-[#7c3aed]",
        borderClass: "border-violet-100/60",
        label:
          action === "department_created"
            ? "Department Created"
            : action === "department_updated"
            ? "Department Updated"
            : "Department Deleted",
      };
    case "user_role_updated":
      return {
        icon: <ShieldCheck className="w-4.5 h-4.5" />,
        bgClass: "bg-[#e0f2fe]",
        textClass: "text-[#0369a1]",
        borderClass: "border-sky-100/60",
        label: "Role Updated",
      };
    case "profile_updated":
      return {
        icon: <UserCheck className="w-4.5 h-4.5" />,
        bgClass: "bg-[#e6f4f2]",
        textClass: "text-[#005c55]",
        borderClass: "border-teal-100/60",
        label: "Profile Updated",
      };
    default:
      return {
        icon: <RefreshCw className="w-4 h-4" />,
        bgClass: "bg-slate-100",
        textClass: "text-slate-500",
        borderClass: "border-slate-200",
        label: action.replace(/_/g, " "),
      };
  }
}

/** Formats an ISO timestamp into a human-readable relative or absolute string */
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Event-type filter options mapping to API action values ──────────────────

const EVENT_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: "All Activities", value: "" },
  { label: "Worker Assignments", value: "complaint_assigned" },
  { label: "Status Changes", value: "status_updated" },
  { label: "User Logins", value: "user_login" },
  { label: "Critical Escalations", value: "complaint_deleted" },
  { label: "Registrations", value: "user_registered" },
  { label: "Role Updates", value: "user_role_updated" },
  { label: "Department Events", value: "department_created" },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function SystemActivityLogPage() {
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState("reports");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter state
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Data state
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ── Fetch helpers ────────────────────────────────────────────────────────

  const fetchLogs = useCallback(
    async (page: number, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }
      try {
        const data = await fetchActivityLogs({
          page,
          limit: 20,
          action: eventTypeFilter || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });
        const incoming: LogItem[] = data.logs ?? [];
        setTotalPages(data.totalPages ?? 1);
        setCurrentPage(page);
        setLogs((prev) => (append ? [...prev, ...incoming] : incoming));
      } catch (err: any) {
        setError(err.message || "Failed to load activity logs");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [eventTypeFilter, startDate, endDate]
  );

  // Initial load
  useEffect(() => {
    fetchLogs(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleApplyFilters = () => {
    fetchLogs(1, false);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchLogs(currentPage + 1, true);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar */}
      <AdminSidebar 
        activeNav={activeNav} 
        onNavClick={setActiveNav} 
        hidePermissions={true}
        hideDepartments={true}
        settingsPlacement="top"
        newReportPlacement="bottom"
      />

      {/* Main panel */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          {/* Header — name driven by auth context, not hardcoded */}
          <AdminHeader
            variant="logs"
            title="System Activity Log"
            userRole={user?.name ?? "Admin"}
            userSubtitle="City Admin"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Main Container */}
          <main className="px-8 py-6 space-y-6 flex-1">

            {/* Filter Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-wrap items-end gap-5 select-none">

              {/* Event Type Select */}
              <div className="flex-1 min-w-[200px] space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Event Type
                </label>
                <div className="relative">
                  <select
                    value={eventTypeFilter}
                    onChange={(e) => setEventTypeFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] appearance-none cursor-pointer transition-all shadow-sm"
                  >
                    {EVENT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Date Range — Start */}
              <div className="flex-1 min-w-[160px] space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-750 placeholder-slate-400 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] appearance-none cursor-pointer transition-all shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Date Range — End */}
              <div className="flex-1 min-w-[160px] space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-750 placeholder-slate-400 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] appearance-none cursor-pointer transition-all shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                type="button"
                onClick={handleApplyFilters}
                disabled={loading}
                className="h-[43px] inline-flex items-center gap-2 bg-[#005c55] hover:bg-[#004540] text-white text-sm font-bold px-6 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-sm select-none shrink-0 disabled:opacity-60"
              >
                <SlidersHorizontal className="w-4 h-4 text-white" />
                <span>Apply Filters</span>
              </button>

            </div>

            {/* Stats row — kept as-is (static KPIs; swap for real data separately if needed) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 select-none">
              <UserStatsCard
                title="Total Events Today"
                value={String(logs.length)}
                icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
                badgeText=""
                badgeClass="bg-emerald-50 text-emerald-700 border border-emerald-100/50"
                badgePlacement="value"
              />
              <UserStatsCard
                title="Assignments Made"
                value={String(logs.filter((l) => l.action === "complaint_assigned").length)}
                icon={<Users className="w-5 h-5 text-amber-600" />}
              />
              <UserStatsCard
                title="Logins Today"
                value={String(logs.filter((l) => l.action === "user_login").length)}
                icon={<ShieldCheck className="w-5 h-5 text-indigo-650" />}
                badgeText=""
                badgeClass="bg-red-50 text-red-650 border border-red-100/50"
                badgePlacement="icon"
              />
            </div>

            {/* Recent Activity Timeline Feed */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between p-6">

              {/* Feed Header */}
              <div className="pb-6 flex items-center justify-between border-b border-slate-100 select-none">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  Recent Activity
                </h2>
                {/* Export — silent no-op; wire to real CSV export separately */}
                <a
                  href="#export-csv"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-bold text-[#005c55] hover:underline"
                >
                  Export as CSV
                </a>
              </div>

              {/* ── Loading skeleton ────────────────────────────────────── */}
              {loading && (
                <div className="relative pl-12 space-y-8 py-6">
                  <div className="absolute left-[18px] top-8 bottom-8 w-[2px] bg-slate-100" />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="relative flex items-start gap-4 animate-pulse">
                      <div className="absolute -left-[44px] top-0 w-8.5 h-8.5 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="flex items-center justify-between gap-4">
                          <div className="h-3.5 w-36 bg-slate-200 rounded" />
                          <div className="h-3 w-16 bg-slate-100 rounded" />
                        </div>
                        <div className="h-3 w-3/4 bg-slate-100 rounded" />
                        <div className="h-3 w-1/2 bg-slate-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Error state ─────────────────────────────────────────── */}
              {!loading && error && (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                  <p className="text-sm font-bold text-slate-700">Failed to load activity logs</p>
                  <p className="text-xs text-slate-400 max-w-xs">{error}</p>
                  <button
                    onClick={() => fetchLogs(1, false)}
                    className="inline-flex items-center gap-2 bg-[#005c55] hover:bg-[#004540] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {/* ── Empty state ─────────────────────────────────────────── */}
              {!loading && !error && logs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <ShieldCheck className="w-10 h-10 text-slate-300" />
                  <p className="text-sm font-bold text-slate-500">No activity logs found</p>
                  <p className="text-xs text-slate-400">Try adjusting your filters</p>
                </div>
              )}

              {/* ── Real log timeline ────────────────────────────────────── */}
              {!loading && !error && logs.length > 0 && (
                <div className="relative pl-12 space-y-8 py-6">
                  {/* Vertical connecting line */}
                  <div className="absolute left-[18px] top-8 bottom-8 w-[2px] bg-slate-100" />

                  {logs.map((log) => {
                    const meta = getLogMeta(log.action);
                    return (
                      <div key={log.id} className="relative flex items-start gap-4">
                        {/* Left Circle Icon */}
                        <div
                          className={`absolute -left-[44px] top-0 w-8.5 h-8.5 rounded-full ${meta.bgClass} ${meta.textClass} border ${meta.borderClass} flex items-center justify-center shadow-sm select-none`}
                        >
                          {meta.icon}
                        </div>
                        {/* Content body */}
                        <div className="flex-1 space-y-1.5 pt-0.5">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-extrabold text-slate-805">
                              {meta.label}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 select-none shrink-0">
                              {formatTime(log.created_at)}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-600 leading-normal">
                            {log.actor?.name && (
                              <span className="font-extrabold text-slate-800">
                                {log.actor.name}
                                {log.actor.role ? ` (${log.actor.role.replace(/_/g, " ")})` : ""}
                              </span>
                            )}{" "}
                            {log.description}
                          </p>
                          {/* Entity type badge */}
                          <div className="flex flex-wrap items-center gap-2 select-none pt-1">
                            {log.entity_type && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-slate-100 text-slate-500">
                                {log.entity_type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Load More Button */}
              {!loading && !error && currentPage < totalPages && (
                <div className="border-t border-slate-100 pt-5 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-[#005c55] hover:text-[#004540] transition-colors cursor-pointer select-none disabled:opacity-60"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Activities</span>
                        <ChevronDown className="w-4 h-4 text-current mt-0.5" />
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>

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
            &copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}
