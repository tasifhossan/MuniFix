"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Clock, 
  Lock, 
  MapPin, 
  Camera, 
  Save, 
  XCircle,
  FileEdit,
  Trash2
} from "lucide-react";
import Navbar from "@/components/Navbar";
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

  // Mock citizen user profile
  const mockUser = {
    name: "Ahmed Khan",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    alert("Complaint updated successfully!");
  };

  const handleCancel = () => {
    if (isLocked) return;
    if (confirm("Are you sure you want to cancel/delete this complaint?")) {
      alert("Complaint successfully cancelled!");
    }
  };

  const toggleSimulation = () => {
    setIsLocked(!isLocked);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Global Header */}
      <Navbar user={mockUser} activeNav="" />

      {/* Breadcrumb section */}
      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-8 pt-8">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 select-none">
          <Link href="/dashboard" className="hover:text-[#005c55] transition-colors">
            My Reports
          </Link>
          <span>&rsaquo;</span>
          <span className="text-slate-600">Edit Complaint</span>
        </div>
      </div>

      {/* Title area */}
      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-8 pt-4 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none select-all">
          Complaint #CTG-88421
        </h1>

        {/* Dynamic status badge */}
        <div className="select-none">
          {isLocked ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-slate-500 bg-slate-200/80 border border-slate-300/50">
              <Lock className="w-3.5 h-3.5 text-slate-550" />
              <span>Under Review (Locked)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-100/50">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Pending Review</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid container */}
      <div className="flex flex-col lg:flex-row flex-1 max-w-[1200px] w-full mx-auto px-6 sm:px-8 py-4 gap-8 mb-8">
        
        {/* Left Column: Form card */}
        <div className="flex-1">
          <form onSubmit={handleUpdate} className="bg-white rounded-3xl border border-slate-205 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Category and Incident Date row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest select-none">
                  Complaint Category
                </label>
                <select
                  disabled={isLocked}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%25236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat cursor-pointer transition-all ${
                    isLocked ? "bg-slate-50 text-slate-450 border-slate-200 cursor-not-allowed" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <option value="Road Repairs & Potholes">Road Repairs & Potholes</option>
                  <option value="Waste Disposal">Waste Disposal</option>
                  <option value="Waterlogging">Waterlogging</option>
                  <option value="Streetlight">Streetlight</option>
                </select>
              </div>

              {/* Incident date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest select-none">
                  Incident Date
                </label>
                <input
                  disabled={isLocked}
                  type="text"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] transition-all ${
                    isLocked ? "bg-slate-50 text-slate-450 border-slate-200 cursor-not-allowed" : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                />
              </div>
            </div>

            {/* Location detail */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest select-none">
                Location Detail
              </label>
              <div className="relative">
                <MapPin className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450 pointer-events-none w-5 h-5 my-auto" />
                <input
                  disabled={isLocked}
                  type="text"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] transition-all ${
                    isLocked ? "bg-slate-50 text-slate-450 border-slate-200 cursor-not-allowed" : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                />
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest select-none">
                Detailed Description
              </label>
              <textarea
                disabled={isLocked}
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55] transition-all resize-none leading-relaxed ${
                  isLocked ? "bg-slate-50 text-slate-450 border-slate-200 cursor-not-allowed" : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              />
            </div>

            {/* Attached media */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest select-none">
                Attached Media (2)
              </label>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                {/* Photo 1 */}
                <div className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100 group shadow-sm">
                  <img
                    src="/pothole.png"
                    alt="Evidence 1"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Photo 2 */}
                <div className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100 group shadow-sm">
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
                  className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-slate-450 transition-all select-none ${
                    isLocked 
                      ? "border-slate-200 bg-slate-50 cursor-not-allowed" 
                      : "border-slate-300 hover:border-[#005c55] hover:text-[#005c55] bg-white cursor-pointer active:scale-95"
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Add</span>
                </button>
              </div>
            </div>

            {/* Divider line */}
            <div className="border-t border-slate-100 pt-5" />

            {/* Action buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isLocked}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md select-none ${
                  isLocked 
                    ? "bg-slate-200 text-slate-450 cursor-not-allowed shadow-none" 
                    : "bg-[#005c55] hover:bg-[#004540] text-white hover:shadow-[#005c55]/20 cursor-pointer active:scale-95"
                }`}
              >
                <Save className="w-4.5 h-4.5" />
                <span>Update Complaint</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLocked}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border transition-all select-none ${
                  isLocked 
                    ? "border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed" 
                    : "border-red-200 hover:border-red-300 text-red-500 hover:bg-red-50/50 cursor-pointer active:scale-95"
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
          <div className="bg-[#e0e7ff]/30 border border-indigo-100 rounded-3xl p-5 shadow-sm font-sans space-y-3.5 select-none">
            <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest">
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
      <footer className="bg-slate-100/50 border-t border-slate-200 mt-auto">
        <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-4">
          <span>&copy; 2024 MuniFix Ctg. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 select-none">
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
