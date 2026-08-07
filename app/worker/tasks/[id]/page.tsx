"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, 
  Navigation, 
  Search, 
  Bell,
  Loader2,
  AlertTriangle 
} from "lucide-react";
import WorkerSidebar from "@/components/WorkerSidebar";
import WorkerActionCenter from "@/components/WorkerActionCenter";
import { fetchComplaintById, fetchMyProfile, updateComplaintStatus } from "@/lib/api";

export default function WorkerTaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const router = useRouter();

  const [task, setTask] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTaskAndProfile() {
      try {
        setLoading(true);
        setError(null);
        
        const [taskData, profileData] = await Promise.all([
          fetchComplaintById(taskId),
          fetchMyProfile().catch(() => null)
        ]);

        if (taskData.success) {
          setTask(taskData.complaint);
        } else {
          throw new Error(taskData.message || "Failed to load task details");
        }

        if (profileData) {
          setProfile(profileData.user ?? profileData);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load task details");
      } finally {
        setLoading(false);
      }
    }

    if (taskId) {
      loadTaskAndProfile();
    }
  }, [taskId]);

  const handleStatusUpdate = async (data: { status: string; notes: string; file: File | null }) => {
    try {
      let payload: any;
      const dbStatus = data.status.toLowerCase().replace(" ", "_");

      if (data.file) {
        const formData = new FormData();
        formData.append("status", dbStatus);
        formData.append("notes", data.notes);
        formData.append("images", data.file); // Match multer array images key
        if (profile?.id) {
          formData.append("worker_id", profile.id);
        }
        payload = formData;
      } else {
        payload = {
          status: dbStatus,
          notes: data.notes,
          ...(profile?.id ? { worker_id: profile.id } : {})
        };
      }

      const res = await updateComplaintStatus(taskId, payload);
      if (res.success) {
        setTask(res.complaint);
        alert("Task status successfully updated!");
      } else {
        throw new Error(res.message || "Failed to update status");
      }
    } catch (err: any) {
      alert(`Error updating task: ${err.message || "Something went wrong"}`);
      throw err;
    }
  };

  const mapPriority = (p: string) => {
    const map: Record<string, string> = {
      critical: "Critical (Level 1)",
      high: "High",
      medium: "Medium",
      low: "Low",
    };
    return map[p?.toLowerCase()] ?? "Medium";
  };

  const mapStatus = (s: string) => {
    const map: Record<string, "Assigned" | "In Progress" | "Resolved"> = {
      assigned: "Assigned",
      in_progress: "In Progress",
      resolved: "Resolved",
      pending: "Assigned",
      cancelled: "Resolved",
    };
    return map[s?.toLowerCase()] ?? "Assigned";
  };

  const categoryImage = (cat: string): string => {
    const map: Record<string, string> = {
      "Waterlogging": "/clogged-drain.png",
      "Road Repair": "/road-pothole.png",
      "Waste Management": "/garbage-overflow.png",
      "Electricity": "/street-light.png",
      "Street Light": "/street-light.png",
    };
    return map[cat] ?? "/road-pothole.png";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[#005c55] animate-spin" />
            <p className="text-slate-500 text-sm font-bold">Loading task details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center max-w-sm px-6">
            <AlertTriangle className="w-10 h-10 text-red-400" />
            <p className="text-slate-700 font-bold">Failed to load task</p>
            <p className="text-slate-400 text-xs">{error || "Task not found"}</p>
            <button
              onClick={() => router.push("/worker")}
              className="mt-4 bg-[#005c55] text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayId = `Task #${task.id.substring(0, 8)}`;
  const title = task.category ? `${task.category} Issue` : "Assigned Task";
  const location = task.address || task.street || "Chattogram Area";
  const category = task.category;
  const priority = mapPriority(task.priority);
  const status = mapStatus(task.status);
  const statusBadge = task.priority?.toUpperCase();
  const assignedDate = new Date(task.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  // Extract images list safely
  let images: string[] = [];
  if (task.image_url) {
    if (Array.isArray(task.image_url)) {
      images = task.image_url;
    } else if (typeof task.image_url === "string") {
      if (task.image_url.startsWith("[")) {
        try {
          images = JSON.parse(task.image_url);
        } catch {
          images = [task.image_url];
        }
      } else {
        images = [task.image_url];
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar Navigation */}
      <WorkerSidebar activeNav="complaints" />

      {/* Main Panel */}
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        
        <main className="px-6 sm:px-8 py-6 space-y-6 flex-1">
          {/* Breadcrumb Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
            {/* Breadcrumb trail */}
            <div className="flex items-center text-xs font-semibold text-gray-400 select-none">
              <span className="hover:text-brand-teal transition-colors cursor-pointer" onClick={() => router.push("/worker")}>Complaints</span>
              <span className="mx-2 text-slate-300 font-normal">›</span>
              <span className="text-slate-800 font-bold">{displayId}</span>
            </div>

            {/* Header Right utilities */}
            <div className="flex items-center justify-between sm:justify-end gap-5">
              {/* Search Pill */}
              <div className="relative w-60 sm:w-64 md:w-80">
                <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none w-5 h-5 my-auto" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 text-xs font-semibold focus:outline-none focus:border-brand-teal bg-white text-gray-800 placeholder-gray-400 shadow-inner"
                />
              </div>

              {/* Alert Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-brand-teal hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              </button>

              {/* Profile Avatar */}
              <div className="flex items-center space-x-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                  <img
                    src={profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"}
                    alt={profile?.name || "Worker"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                  {profile?.name || "Worker"}
                </span>
              </div>
            </div>
          </div>

          {/* Task Title & Meta Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div>
              {/* Priority badge & Assignment date */}
              <div className="flex items-center">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-sm ${
                  task.priority === "critical" ? "bg-red-100 text-red-700" :
                  task.priority === "high" ? "bg-amber-100 text-amber-700" : "bg-teal-100 text-teal-700"
                }`}>
                  {statusBadge}
                </span>
                <span className="text-xs font-bold text-gray-400 ml-3">
                  Assigned: {assignedDate}
                </span>
              </div>
              
              {/* Task Title */}
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-2.5 leading-snug">
                {title}
              </h2>

              {/* Location */}
              <div className="flex items-center text-xs sm:text-sm font-semibold text-gray-500 mt-2">
                <MapPin className="w-4 h-4 mr-1 text-gray-450 mt-0.5 shrink-0" />
                <span>{location}</span>
              </div>
            </div>

            {/* View Map Action button */}
            <button className="bg-teal-50 hover:bg-teal-100 border border-teal-100/50 text-brand-teal text-xs font-bold px-4 py-2.5 rounded-xl transition-all select-none active:scale-[0.98] cursor-pointer flex items-center gap-1.5 shadow-sm self-start md:self-center">
              <Navigation className="w-3.5 h-3.5 fill-current" />
              <span>View on Map</span>
            </button>
          </div>

          {/* Details Content Grid Layout */}
          <div className="flex flex-col lg:flex-row gap-8 pt-4">
            {/* Left 2/3 Content Column */}
            <div className="flex-1 space-y-6">
              
              {/* Complaint Info details */}
              <div className="bg-white rounded-3xl border border-slate-150 p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Header row */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                    Complaint Information
                  </h3>
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold text-teal-800 bg-teal-50 border border-teal-100/50 shadow-inner">
                    {status}
                  </span>
                </div>

                {/* Categories & Priorities Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                      Category
                    </span>
                    <span className="text-sm font-black text-gray-800">
                      {category}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                      Priority
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-black text-gray-800">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        task.priority === "critical" ? "bg-red-600" :
                        task.priority === "high" ? "bg-amber-500" : "bg-teal-500"
                      }`} />
                      {priority}
                    </span>
                  </div>
                </div>

                {/* Description details */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                    Description
                  </span>
                  <p className="text-sm text-gray-600 font-semibold leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Media Row */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                    Reported Media
                  </span>
                  <div className="grid grid-cols-2 gap-4 max-w-md w-full">
                    {images.length > 0 ? (
                      images.map((imgUrl, idx) => (
                        <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-150 shadow-sm">
                          <img
                            src={imgUrl}
                            alt="Reported media proof"
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-150 shadow-sm">
                        <img
                          src={categoryImage(task.category)}
                          alt="Reported category fallback"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Map Location Card */}
              <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm">
                <div className="w-full h-44 sm:h-52 bg-[#e2f1f5]/55 rounded-2xl relative overflow-hidden border border-slate-100 shadow-inner flex items-center justify-center">
                  
                  {/* Mock Map Grid lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <path d="M -20,40 C 40,60 100,20 220,100" fill="none" stroke="#cbd5e1" strokeWidth="5" />
                    <path d="M 50,-20 L 150,220" fill="none" stroke="#cbd5e1" strokeWidth="4" />
                  </svg>

                  {/* Highlighted Map Pin */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce z-10">
                    <MapPin className="w-8 h-8 text-brand-teal fill-brand-teal/15 stroke-[2.2]" />
                  </div>
                </div>
              </div>

            </div>

            {/* Right 1/3 Side Control Column */}
            <div className="w-full lg:w-auto shrink-0">
              <WorkerActionCenter initialStatus={status} onUpdate={handleStatusUpdate} />
            </div>
          </div>
        </main>

        {/* Global Footer */}
        <footer className="bg-slate-100/50 border-t border-slate-200/60 py-6 px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-4 mt-8">
          <span>&copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#departments" className="hover:text-brand-teal transition-colors">Departments</a>
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
