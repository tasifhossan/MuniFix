"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, MessageSquare, Loader2 } from "lucide-react";
import WorkerSidebar from "@/components/WorkerSidebar";
import LoadingScreen from "@/components/LoadingScreen";

// Import reusable components
import WorkerProfileHero from "@/components/WorkerProfileHero";
import WorkerStatsGrid from "@/components/WorkerStatsGrid";
import WorkerResolvedTasks from "@/components/WorkerResolvedTasks";
import WorkerCredentialsCard from "@/components/WorkerCredentialsCard";
import WorkerStatusTracker from "@/components/WorkerStatusTracker";

export default function WorkerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("profile");

  // Mock initial worker details
  const [workerData, setWorkerData] = useState({
    name: "Mohammed Tanvir Hasan",
    department: "Water & Sewerage Department",
    zone: "Zone 5, Agrabad",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop",
    employeeId: "MF-2024-WT-089",
    employmentStatus: "Permanent / Full-Time",
    joiningDate: "March 12, 2021 (3.5 years)",
    certifications: ["OSHA Safety", "Advanced Plumbing", "Hazmat Response"],
    locationStatus: "On Active Duty",
    locationDetails: "Patrolling Sector 5 (Agrabad)",
  });

  // Mock resolved tasks
  const resolvedTasks = [
    {
      id: "res-1",
      title: "Main Water Line Burst Repair",
      description: "Sector 2, Road 14 - Emergency plumbing and pipe replacement.",
      category: "water" as const,
      date: "Oct 24, 2024",
      duration: "2h 15m duration",
    },
    {
      id: "res-2",
      title: "Clogged Drainage Clearance",
      description: "Agrabad Access Road - Routine maintenance and high-pressure cleaning.",
      category: "drainage" as const,
      date: "Oct 23, 2024",
      duration: "1h 40m duration",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateLocation = async () => {
    // Simulate location updating
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setWorkerData((prev) => ({
          ...prev,
          locationDetails: `Updated GPS: Sector 5, Agrabad (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
        }));
        resolve();
      }, 1500);
    });
  };

  const handleEditProfile = () => {
    alert("Profile editing feature is opening...");
  };

  const handlePrintBadge = () => {
    window.print();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // Supervisor details for header
  const supervisor = {
    name: "Arifur Rahman",
    role: "FIELD SUPERVISOR",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans">
      {/* Sidebar Navigation */}
      <WorkerSidebar activeNav={activeNav} onNavClick={setActiveNav} />

      {/* Main split layout container */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        
        {/* Main Content wrapper */}
        <main className="px-6 sm:px-8 py-6 space-y-8 flex-1">
          
          {/* Header Row */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200/60">
            {/* Search Input Box */}
            <div className="relative w-72 select-none hidden sm:block">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Search complaints..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 focus:border-brand-teal text-xs font-semibold focus:outline-none transition-all text-gray-800 placeholder-slate-400 bg-white"
              />
            </div>

            {/* Supervisor Profile & Actions */}
            <div className="flex items-center justify-end gap-6 ml-auto">
              <div className="flex items-center gap-4 select-none">
                {/* Notifications Bell */}
                <button className="relative p-2 text-slate-400 hover:text-brand-teal hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-55 rounded-full ring-2 ring-white" />
                </button>

                {/* Message Icon */}
                <button className="p-2 text-slate-400 hover:text-brand-teal hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>

              {/* Supervisor Info block */}
              <div className="flex items-center gap-4.5 pl-2 border-l border-slate-200 select-none">
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-800 tracking-tight block leading-tight">
                    {supervisor.name}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 block -mt-0.5 tracking-wider">
                    {supervisor.role}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm hover:scale-105 transition-transform duration-300">
                  <img
                    src={supervisor.avatar}
                    alt={supervisor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Hero Block */}
          <WorkerProfileHero
            name={workerData.name}
            department={workerData.department}
            zone={workerData.zone}
            avatar={workerData.avatar}
            coverImage={workerData.coverImage}
            onEditProfile={handleEditProfile}
            onPrintBadge={handlePrintBadge}
          />

          {/* Metrics Stats Section */}
          <WorkerStatsGrid
            tasksCompleted={128}
            tasksTrend="+12%"
            avgResolution="4.2"
            rating={4.9}
          />

          {/* Double Column Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Recent Resolved Tasks List (2/3 width) */}
            <div className="lg:col-span-2">
              <WorkerResolvedTasks tasks={resolvedTasks} />
            </div>

            {/* Right Column: Credentials & Current Status (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              <WorkerCredentialsCard
                employeeId={workerData.employeeId}
                employmentStatus={workerData.employmentStatus}
                joiningDate={workerData.joiningDate}
                certifications={workerData.certifications}
              />
              <WorkerStatusTracker
                status={workerData.locationStatus}
                details={workerData.locationDetails}
                onUpdateLocation={handleUpdateLocation}
              />
            </div>
          </div>
        </main>

        {/* Global Footer */}
        <footer className="bg-slate-100/50 border-t border-slate-200/60 py-6 px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-slate-500 gap-4 mt-8">
          <span>&copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 select-none">
            <a href="#departments" className="hover:text-brand-teal transition-colors">Departments</a>
            <a href="#privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-brand-teal transition-colors">Terms of Service</a>
            <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-brand-teal transition-colors">
              Chattogram City Corporation
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
