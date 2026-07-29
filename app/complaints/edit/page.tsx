"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  Lock, 
  MapPin, 
  Camera, 
  Save, 
  XCircle,
  FileEdit,
  ChevronDown
} from "lucide-react";
import Navbar from "@/components/Navbar";
import LocationMap from "@/components/LocationMap";
import ActivityTimeline from "@/components/ActivityTimeline";
import { fetchComplaintById, editComplaint, updateComplaintStatus } from "@/lib/api";

export default function EditComplaintPage() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  
  // Form fields state
  const [category, setCategory] = useState("Other");
  const [locationDetail, setLocationDetail] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get("id");
      if (idParam) {
        setId(idParam);
      } else {
        setError("Missing complaint ID.");
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    async function loadComplaint() {
      try {
        setLoading(true);
        const res = await fetchComplaintById(id);
        if (res.success) {
          const c = res.complaint;
          if (c.status !== "pending") {
            alert("Only pending complaints can be edited.");
            router.replace(`/complaints/${c.id}`);
            return;
          }
          setCategory(c.category);
          setDescription(c.description);
          setLocationDetail(c.latitude && c.longitude ? `${parseFloat(c.latitude).toFixed(6)}, ${parseFloat(c.longitude).toFixed(6)}` : "Chattogram Area");
          setIsLocked(false);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load complaint.");
      } finally {
        setLoading(false);
      }
    }
    loadComplaint();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    try {
      setLoading(true);
      
      let lat: number | undefined;
      let lng: number | undefined;
      const parts = locationDetail.split(",");
      if (parts.length === 2) {
        const parsedLat = parseFloat(parts[0].trim());
        const parsedLng = parseFloat(parts[1].trim());
        if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
          lat = parsedLat;
          lng = parsedLng;
        }
      }

      const res = await editComplaint(id, {
        category,
        description,
        latitude: lat,
        longitude: lng
      });
      if (res.success) {
        alert("Complaint updated successfully!");
        router.push(`/complaints/${id}`);
      }
    } catch (err: any) {
      alert(`Failed to update complaint: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (isLocked) return;
    if (confirm("Are you sure you want to cancel this complaint?")) {
      try {
        setLoading(true);
        const res = await updateComplaintStatus(id, {
          status: "cancelled",
          notes: "Cancelled by citizen on edit screen.",
        });
        if (res.success) {
          alert("Complaint successfully cancelled!");
          router.push(`/complaints/${id}`);
        }
      } catch (err: any) {
        alert(`Failed to cancel complaint: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <Navbar activeNav="complaints" isDashboard />
        <div className="flex-grow flex flex-col items-center justify-center py-20">
          <Clock className="w-10 h-10 text-[#005c55] animate-spin" />
          <p className="text-gray-500 text-sm font-bold mt-4 animate-pulse">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (error || !id) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <Navbar activeNav="complaints" isDashboard />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="bg-white rounded-3xl border border-gray-150 py-16 px-6 text-center shadow-sm max-w-md w-full">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4 stroke-[1.5]" />
            <h3 className="text-lg font-bold text-gray-900">Failed to Load Complaint</h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">{error || "No ID specified."}</p>
            <Link href="/dashboard">
              <button className="mt-6 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 flex flex-col font-sans">
      {/* Global Header - full-width stretching across the top */}
      <Navbar activeNav="complaints" isDashboard />

      {/* Breadcrumb section */}
      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-8 pt-8">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 select-none">
          <Link href="/dashboard" className="text-[#005c55] hover:underline transition-colors">
            My Reports
          </Link>
          <span className="text-slate-300 font-semibold">&rsaquo;</span>
          <span className="text-slate-605">Edit Complaint</span>
        </div>
      </div>

      {/* Title & Status Area */}
      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-8 pt-4 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none select-all">
          Complaint #{id}
        </h1>

        {/* Dynamic status badge */}
        <div className="select-none">
          {isLocked ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-slate-500 bg-slate-200/80 border border-slate-350">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Under Review (Locked)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-100/50">
              <Clock className="w-3.5 h-3.5 text-amber-550" />
              <span>Pending Review</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid container */}
      <div className="flex flex-col lg:flex-row flex-1 max-w-[1200px] w-full mx-auto px-6 sm:px-8 py-4 gap-8 mb-8">
        
        {/* Left Column: Form card */}
        <div className="flex-1">
          <form onSubmit={handleUpdate} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Category selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
                Complaint Category
              </label>
              <div className="relative">
                <select
                  disabled={isLocked}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full bg-white border rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] appearance-none cursor-pointer transition-all shadow-sm ${
                    isLocked ? "bg-slate-50 text-slate-450 border-slate-200 cursor-not-allowed" : "border-slate-205 hover:border-slate-300"
                  }`}
                >
                  <option value="Waterlogging">Waterlogging</option>
                  <option value="Road Repair">Road Repair</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Location detail */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
                Location Detail
              </label>
              <div className="relative">
                <MapPin className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none w-5 h-5 my-auto" />
                <input
                  disabled={isLocked}
                  type="text"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] transition-all shadow-sm ${
                    isLocked ? "bg-slate-50 text-slate-450 border-slate-200 cursor-not-allowed" : "border-slate-205 hover:border-slate-300 bg-white"
                  }`}
                />
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
                Detailed Description
              </label>
              <textarea
                disabled={isLocked}
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-semibold text-slate-755 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] transition-all resize-none leading-relaxed shadow-sm ${
                  isLocked ? "bg-slate-50 text-slate-450 border-slate-200 cursor-not-allowed" : "border-slate-205 hover:border-slate-300 bg-white"
                }`}
              />
            </div>

            {/* Attached media */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
                Attached Media (2)
              </label>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                {/* Photo 1 */}
                <div className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200 group shadow-sm">
                  <img
                    src="/pothole.png"
                    alt="Evidence 1"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Photo 2 */}
                <div className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200 group shadow-sm">
                  <img
                    src="/street_light.png"
                    alt="Evidence 2"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Add Photo placeholder */}
                <button
                  type="button"
                  disabled={isLocked}
                  className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 text-slate-400 transition-all select-none ${
                    isLocked 
                      ? "border-slate-200 bg-slate-50 cursor-not-allowed" 
                      : "border-slate-300 hover:border-[#005c55] hover:text-[#005c55] bg-white cursor-pointer active:scale-[0.97]"
                  }`}
                >
                  <Camera className="w-5 h-5 text-current" />
                  <span className="text-[10px] font-bold">Add</span>
                </button>
              </div>
            </div>

            {/* Divider line */}
            <div className="border-t border-slate-100 pt-5" />

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="submit"
                disabled={isLocked}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm select-none ${
                  isLocked 
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                    : "bg-[#005c55] hover:bg-[#004540] text-white cursor-pointer active:scale-95"
                }`}
              >
                <Save className="w-4.5 h-4.5" />
                <span>Update Complaint</span>
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLocked}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all select-none ${
                  isLocked 
                    ? "border-slate-200 text-slate-350 bg-slate-50 cursor-not-allowed" 
                    : "border-red-200 hover:border-red-300 text-red-500 hover:bg-red-50/20 cursor-pointer active:scale-95 bg-white"
                }`}
              >
                <XCircle className="w-4.5 h-4.5" />
                <span>Cancel Complaint</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Information visual details */}
        <div className="w-full lg:w-80 space-y-6 shrink-0 flex flex-col">
          {/* Location Map visual */}
          <LocationMap />

          {/* Activity Timeline list */}
          <ActivityTimeline />
        </div>

      </div>

      {/* Global Simple Footer */}
      <footer className="bg-slate-100/50 border-t border-slate-200 mt-auto select-none">
        <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-slate-500 gap-4">
          <span>&copy; 2024 MuniFix Ctg. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#departments" className="hover:text-[#005c55] transition-colors">Departments</a>
            <a href="#privacy" className="hover:text-[#005c55] transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#005c55] transition-colors">Terms of Service</a>
            <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-[#005c55] transition-colors">
              Chattogram City Corporation
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
