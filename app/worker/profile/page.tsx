"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, MessageSquare, Loader2, AlertTriangle } from "lucide-react";
import WorkerSidebar from "@/components/WorkerSidebar";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { fetchMyProfile, updateMyProfile, fetchWorkerTasks, fetchDepartments } from "@/lib/api";

// Import reusable components
import WorkerProfileHero from "@/components/WorkerProfileHero";
import WorkerStatsGrid from "@/components/WorkerStatsGrid";
import WorkerResolvedTasks from "@/components/WorkerResolvedTasks";
import WorkerCredentialsCard from "@/components/WorkerCredentialsCard";
import WorkerStatusTracker from "@/components/WorkerStatusTracker";

export default function WorkerProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("profile");
  
  const [profileData, setProfileData] = useState<any>(null);
  const [resolvedTasks, setResolvedTasks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    completed: 0,
    active: 0,
    critical: 0
  });
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication access control
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Concurrent fetches
      const [profileRes, tasksRes, deptsRes] = await Promise.all([
        fetchMyProfile(),
        fetchWorkerTasks().catch(() => ({ success: true, tasks: [] })),
        fetchDepartments().catch(() => ({ success: true, departments: [] }))
      ]);

      const profile = profileRes.user || profileRes.profile || profileRes;
      setProfileData(profile);

      const deptList = deptsRes.departments ?? deptsRes ?? [];
      setDepartments(deptList);

      const rawTasks = tasksRes.tasks ?? tasksRes.complaints ?? tasksRes.complains ?? tasksRes ?? [];
      
      // Calculate Stats
      const resolved = rawTasks.filter((t: any) => t.status === "resolved");
      const active = rawTasks.filter((t: any) => t.status !== "resolved" && t.status !== "cancelled");
      const critical = rawTasks.filter((t: any) => t.priority === "critical" && t.status !== "resolved");
      
      setStats({
        completed: resolved.length,
        active: active.length,
        critical: critical.length
      });

      // Filter resolved tasks for display (up to 5 items)
      const mappedResolved = resolved.slice(0, 5).map((t: any) => {
        let cat: "water" | "drainage" | "other" = "other";
        const categoryName = (t.category || "").toLowerCase();
        if (categoryName.includes("water")) cat = "water";
        else if (categoryName.includes("drainage") || categoryName.includes("waste")) cat = "drainage";

        return {
          id: String(t.id),
          title: t.description ? t.description.slice(0, 45) + (t.description.length > 45 ? "..." : "") : "Assigned Task",
          description: t.description || "No description provided.",
          category: cat,
          date: t.updated_at ? new Date(t.updated_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "Recently",
          duration: t.priority ? `${t.priority} priority` : "Normal priority"
        };
      });

      setResolvedTasks(mappedResolved);

    } catch (err: any) {
      console.error("Failed to load worker profile data:", err);
      setError(err.message || "Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleUpdateLocation = async () => {
    const newAddress = prompt("Enter your current location / patrol area:", profileData?.address || "");
    if (newAddress === null) return; // Cancelled
    
    try {
      setError(null);
      const res = await updateMyProfile({
        name: profileData.name,
        phone: profileData.phone,
        address: newAddress
      } as any);

      const updatedUser = res.user || res.profile || res;
      setProfileData((prev: any) => ({
        ...prev,
        address: updatedUser.address || newAddress
      }));

      setToastMessage("Location updated successfully!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      console.error("Location update failed:", err);
      alert(err.message || "Failed to update location.");
    }
  };

  const handleEditProfile = () => {
    const newName = prompt("Edit your name:", profileData?.name || "");
    if (newName === null || newName.trim() === "") return;
    const newPhone = prompt("Edit your phone:", profileData?.phone || "");
    if (newPhone === null) return;

    updateMyProfile({
      name: newName,
      phone: newPhone,
      address: profileData?.address
    } as any)
      .then((res) => {
        const updated = res.user || res.profile || res;
        setProfileData((prev: any) => ({
          ...prev,
          name: updated.name || newName,
          phone: updated.phone || newPhone
        }));
        setToastMessage("Profile updated successfully!");
        setTimeout(() => setToastMessage(null), 3000);
      })
      .catch((err) => {
        alert(err.message || "Failed to update profile info.");
      });
  };

  const handlePrintBadge = () => {
    window.print();
  };

  if (authLoading || (user && loading)) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800 mb-2">Error Loading Profile</h2>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button
            onClick={loadData}
            className="w-full bg-brand-teal text-white py-3 rounded-xl font-bold text-xs hover:bg-brand-teal-hover transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Map Department Name
  const matchedDept = departments.find(d => String(d.id) === String(profileData?.department_id));
  const deptName = matchedDept ? matchedDept.name : "Field Operations Department";

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans">
      {/* Sidebar Navigation */}
      <WorkerSidebar activeNav={activeNav} onNavClick={setActiveNav} />

      {/* Main split layout container */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        
        {/* Main Content wrapper */}
        <main className="px-6 sm:px-8 py-6 space-y-8 flex-1">
          {toastMessage && (
            <div className="fixed bottom-6 right-6 bg-brand-teal text-white px-5 py-3 rounded-2xl shadow-lg text-xs font-bold z-50 animate-bounce">
              {toastMessage}
            </div>
          )}

          {/* Header Row */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200/60">
            <h1 className="text-xl font-black text-slate-850 tracking-tight">Worker Dashboard</h1>
            <div className="flex items-center gap-6 ml-auto">
              <div className="flex items-center gap-4 select-none">
                <button className="relative p-2 text-slate-400 hover:text-brand-teal hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer">
                  <Bell className="w-5 h-5" />
                  {stats.critical > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </button>
              </div>

              {/* Worker Header Info */}
              <div className="flex items-center gap-4.5 pl-2 border-l border-slate-200 select-none">
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-800 tracking-tight block leading-tight">
                    {profileData?.name}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 block -mt-0.5 tracking-wider uppercase">
                    {profileData?.role}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm bg-brand-teal/10 flex items-center justify-center font-bold text-brand-teal">
                  {profileData?.name ? profileData.name.charAt(0) : "W"}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Hero Block */}
          <WorkerProfileHero
            name={profileData?.name || "Field Worker"}
            department={deptName}
            zone={profileData?.address || "Chattogram, BD"}
            avatar={profileData?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData?.name || "Worker")}&backgroundColor=005c55`}
            coverImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop"
            onEditProfile={handleEditProfile}
            onPrintBadge={handlePrintBadge}
          />

          {/* Metrics Stats Section */}
          <WorkerStatsGrid
            tasksCompleted={stats.completed}
            tasksTrend={`Active: ${stats.active}`}
            avgResolution={stats.critical > 0 ? "Urgent Duty" : "Normal Duty"}
            rating={4.8}
          />

          {/* Double Column Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Recent Resolved Tasks List (2/3 width) */}
            <div className="lg:col-span-2">
              <WorkerResolvedTasks 
                tasks={resolvedTasks} 
                onViewAllHistory={() => router.push("/worker/reports")}
              />
            </div>

            {/* Right Column: Credentials & Current Status (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              <WorkerCredentialsCard
                employeeId={`MF-2026-WT-0${profileData?.id || "X"}`}
                employmentStatus={profileData?.is_active !== false ? "Active / Full-Time" : "Inactive"}
                joiningDate={profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString([], { month: "long", year: "numeric" }) : "Recent"}
                certifications={["Municipal Safety", "Agrabad Zone Maintenance"]}
              />
              <WorkerStatusTracker
                status={profileData?.is_active !== false ? "On Active Duty" : "Offline"}
                details={profileData?.address || "Chattogram, BD"}
                onUpdateLocation={handleUpdateLocation}
              />
            </div>
          </div>
        </main>

        {/* Global Footer */}
        <footer className="bg-slate-100/50 border-t border-slate-200/60 py-6 px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-slate-500 gap-4 mt-8">
          <span>&copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 select-none">
            <a href="/privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-brand-teal transition-colors">Terms of Service</a>
            <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-brand-teal transition-colors">
              Chattogram City Corporation
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

