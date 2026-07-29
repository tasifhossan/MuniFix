"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Building,
  FileText,
  ShieldCheck,
  Users,
  Calendar,
  FileDown,
  TrendingUp,
  Loader2,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import AnalyticsStatsCard from "@/components/AnalyticsStatsCard";
import ComplaintsChart from "@/components/ComplaintsChart";
import StatusDistribution from "@/components/StatusDistribution";
import CriticalActivityLog from "@/components/CriticalActivityLog";
import IncidentHotspots from "@/components/IncidentHotspots";
import {
  fetchComplaints,
  fetchAdminDepartments,
  fetchAdminWorkers,
  fetchMyProfile,
} from "@/lib/api";

export default function AdminDashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if loaded on the raw /admin path
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/admin" && user) {
      router.replace(user.role === "super_admin" ? "/dashboard/superadmin" : "/dashboard/admin");
    }
  }, [user, router]);

  // Live data state
  const [profile, setProfile] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileData, complaintData, deptData] = await Promise.all([
        fetchMyProfile(),
        fetchComplaints(),
        fetchAdminDepartments(),
      ]);

      setProfile(profileData.user ?? profileData);
      setComplaints(complaintData.complaints ?? []);
      setDepartments(deptData.departments ?? deptData ?? []);

      // Workers only available for dept_admin / super_admin — try but don't crash
      try {
        const workerData = await fetchAdminWorkers();
        setWorkers(workerData.workers ?? workerData ?? []);
      } catch {
        setWorkers([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Compute derived stats
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter((c) => c.status === "resolved").length;
  const resolutionRate =
    totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : "0.0";

  // User object for Navbar
  const navUser = profile
    ? { name: profile.name ?? profile.username ?? "Admin", avatar: profile.avatar_url ?? undefined }
    : undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
        <Navbar activeNav="" />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[#005c55] animate-spin" />
            <p className="text-slate-500 text-sm font-bold">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
        <Navbar activeNav="" />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center max-w-sm">
            <AlertTriangle className="w-10 h-10 text-red-400" />
            <p className="text-slate-700 font-bold">Failed to load dashboard</p>
            <p className="text-slate-400 text-xs">{error}</p>
            <button
              onClick={loadDashboard}
              className="inline-flex items-center gap-2 bg-[#005c55] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#004540] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar user={navUser} activeNav="" />

      {/* Main split layout container */}
      <div className="flex flex-1 w-full">
        {/* Left Sidebar */}
        <AdminSidebar role={profile?.role === "super_admin" ? "superadmin" : "admin"} activeNav={activeNav} onNavClick={setActiveNav} />

        {/* Right Content panel */}
        <div className="flex-1 min-h-screen flex flex-col justify-between">
          <main className="px-8 py-6 space-y-6 flex-1">
            {/* Title & Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                  Analytics Overview
                </h1>
                <p className="text-slate-500 text-sm font-semibold mt-2 select-none">
                  Real-time municipal performance monitoring for Chattogram.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 select-none">
                <button className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-sm">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Last 30 Days</span>
                </button>
                <button className="inline-flex items-center gap-1.5 bg-[#005c55] hover:bg-[#004540] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-md shadow-[#005c55]/10">
                  <FileDown className="w-4 h-4 text-white" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/* Live Analytical Stats Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <AnalyticsStatsCard
                icon={<Building className="w-5 h-5 text-emerald-600" />}
                iconBgClass="bg-emerald-50 border border-emerald-100/50"
                badgeText="Active"
                badgeClass="bg-emerald-100 text-emerald-700 font-extrabold"
                title="Total Departments"
                value={String(departments.length)}
                footerElement={
                  <>
                    <span className="text-emerald-500">&bull;</span>
                    <span>{departments.length} registered</span>
                  </>
                }
              />
              <AnalyticsStatsCard
                icon={<FileText className="w-5 h-5 text-amber-600" />}
                iconBgClass="bg-amber-50 border border-amber-100/50"
                badgeText={totalComplaints > 0 ? "Live" : "0"}
                badgeClass="bg-amber-100 text-amber-700 font-extrabold"
                title="Total Complaints"
                value={totalComplaints.toLocaleString()}
                footerElement={
                  <>
                    <span className="text-emerald-500 font-bold">&#8593;</span>
                    <span>{resolvedComplaints} resolved</span>
                  </>
                }
              />
              <AnalyticsStatsCard
                icon={<ShieldCheck className="w-5 h-5 text-indigo-600" />}
                iconBgClass="bg-indigo-50 border border-indigo-100/50"
                badgeText="Target 90%"
                badgeClass="bg-indigo-100 text-indigo-700 font-extrabold"
                title="Resolution Rate"
                value={`${resolutionRate}%`}
                footerElement={
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span>
                      {parseFloat(resolutionRate) >= 80
                        ? "On track"
                        : "Needs improvement"}
                    </span>
                  </>
                }
              />
              <AnalyticsStatsCard
                icon={<Users className="w-5 h-5 text-sky-600" />}
                iconBgClass="bg-sky-50 border border-sky-100/50"
                badgeText="Live"
                badgeClass="bg-sky-100 text-sky-700 font-extrabold"
                title="Active Workers"
                value={workers.length > 0 ? String(workers.length) : "—"}
                footerElement={
                  <>
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>Across all sectors</span>
                  </>
                }
              />
            </div>

            {/* Middle Section: Bar Chart & Donut Chart (static charts — future phase) */}
            {profile?.role === "super_admin" && (
              <div className="flex flex-col lg:flex-row gap-6">
                <ComplaintsChart />
                <StatusDistribution />
              </div>
            )}

            {/* Bottom Section: Critical Activity & Incident Hotspots */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 flex">
                <CriticalActivityLog />
              </div>
              <div className="lg:col-span-2 flex">
                <IncidentHotspots />
              </div>
            </div>
          </main>

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
              &copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
