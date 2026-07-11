"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import AdminHeader from "@/components/AdminHeader";
import LocationMap from "@/components/LocationMap";
import ActivityTimeline from "@/components/ActivityTimeline";

export default function EditComplaintPage() {
  const [isLocked, setIsLocked] = useState(false);
  
  // Form fields state
  const [category, setCategory] = useState("Road Repairs & Potholes");
  const [incidentDate, setIncidentDate] = useState("10/15/2024");
  const [locationDetail, setLocationDetail] = useState("Agrabad Commercial Area, near GEC Circle");
  const [description, setDescription] = useState(
    "Large pothole forming in the middle of the service road. It's causing significant traffic slowdowns during peak hours and is hazardous for motorcyclists at night due to poor lighting in this specific stretch."
  );

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    alert("Complaint updated successfully!");
  };

  const handleCancel = () => {
    if (isLocked) return;
    if (confirm("Are you sure you want to cancel this complaint?")) {
      alert("Complaint successfully cancelled!");
    }
  };

  const toggleSimulation = () => {
    setIsLocked(!isLocked);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 flex flex-col font-sans">
      {/* Global Header - full-width stretching across the top */}
      <AdminHeader 
        variant="logs" 
        title="MuniFix Ctg" 
        userRole="Rahat Hossain" 
        userSubtitle="City Admin" 
      />

      {/* Breadcrumb section */}
      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-8 pt-8">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 select-none">
          <Link href="/dashboard" className="text-[#005c55] hover:underline transition-colors">
            My Reports
          </Link>
          <span className="text-slate-300 font-semibold">&rsaquo;</span>
          <span className="text-slate-600">Edit Complaint</span>
        </div>
      </div>

      {/* Title & Status Area */}
      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-8 pt-4 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none select-all">
          Complaint #CTG-88421
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
            
            {/* Category and Incident Date row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Category selector */}
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
                    <option value="Road Repairs & Potholes">Road Repairs & Potholes</option>
                    <option value="Waste Disposal">Waste Disposal</option>
                    <option value="Waterlogging">Waterlogging</option>
                    <option value="Streetlight">Streetlight</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Incident date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
                  Incident Date
                </label>
                <input
                  disabled={isLocked}
                  type="text"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] transition-all shadow-sm ${
                    isLocked ? "bg-slate-50 text-slate-450 border-slate-200 cursor-not-allowed" : "border-slate-205 hover:border-slate-300 bg-white"
                  }`}
                />
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

          {/* Simulate State Card */}
          <div className="bg-[#e0e7ff]/40 border border-indigo-100 rounded-3xl p-5 shadow-sm font-sans space-y-3.5 select-none">
            <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest leading-none">
              Simulate State
            </h4>
            <button
              onClick={toggleSimulation}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-4 border border-slate-200 rounded-xl transition-all cursor-pointer select-none active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
            >
              {isLocked ? <FileEdit className="w-4 h-4 text-[#005c55]" /> : <Lock className="w-4 h-4 text-amber-500" />}
              <span>Toggle Locked/Pending State</span>
            </button>
          </div>
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
