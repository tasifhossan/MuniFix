"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Compass, Sparkles, AlertTriangle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import EvidenceUpload from "@/components/EvidenceUpload";
import LiveAIAnalysis from "@/components/LiveAIAnalysis";
import ReportingGuidelines from "@/components/ReportingGuidelines";
import SuccessModal from "@/components/SuccessModal";

export default function NewComplaintPage() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [detectedArea, setDetectedArea] = useState("Chattogram, Bangladesh");
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportId, setReportId] = useState("");

  const charLimit = 1000;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= charLimit) {
      setDescription(val);
    }
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setLocationInput("GEC Circle, East Gate, Chittogram");
      setDetectedArea("Chowdhury Road, Ward 15, Chattogram");
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.length < 20) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const randomId = Math.floor(1000 + Math.random() * 9000);
      setReportId(`#CTG-2024-${randomId}`);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleCloseModal = () => {
    setIsSubmitted(false);
  };

  const handleViewDashboard = () => {
    router.push("/dashboard");
  };

  const handleSubmitAnother = () => {
    setDescription("");
    setLocationInput("");
    setDetectedArea("Chattogram, Bangladesh");
    setIsSubmitted(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Global Header with activeNav="new-report" */}
      <Navbar activeNav="new-report" isDashboard />

      {/* Breadcrumb row */}
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/complaints"
          className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-brand-teal transition-colors uppercase tracking-wider gap-1.5"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          Back to list
        </Link>
      </div>

      {/* Main Content Layout (Split 2-Columns, no sidebar as in screenshot) */}
      <div className="flex flex-col lg:flex-row flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 gap-8">
        
        {/* Left Column: Form (2/3 width) */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Submit a New Complaint
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Provide the details of the issue. Our AI will automatically categorize it for faster resolution.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm space-y-8">
            
            {/* Evidence Upload */}
            <EvidenceUpload />

            {/* Description field */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">
                Issue Description
              </label>
              <textarea
                required
                value={description}
                onChange={handleDescriptionChange}
                rows={6}
                placeholder="Describe the problem in detail (e.g., 'Large pothole blocking the left lane near GEC Circle...')"
                className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-brand-teal bg-white transition-all text-gray-800 placeholder-gray-400 resize-none font-medium"
              />
              <div className="flex justify-between text-xxs sm:text-xs font-semibold text-gray-400">
                <span className={description.length < 20 && description.length > 0 ? "text-amber-500 font-bold" : ""}>
                  Min 20 characters
                </span>
                <span>
                  {description.length} / {charLimit}
                </span>
              </div>
            </div>

            {/* Location field */}
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">
                Location
              </label>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Location details */}
                <div className="flex-1 space-y-4">
                  <div className="relative">
                    <MapPin className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none w-5 h-5 my-auto" />
                    <input
                      type="text"
                      placeholder="Search address or landmark..."
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-teal bg-white transition-all text-gray-800 font-semibold placeholder-gray-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="w-full flex items-center justify-center space-x-2 border border-gray-200 hover:border-brand-teal text-brand-teal font-bold px-4 py-3 rounded-xl transition-all text-xs bg-white cursor-pointer select-none active:scale-[0.98] disabled:opacity-50"
                  >
                    <Compass className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
                    <span>{isLocating ? "Locating..." : "Use Current Location"}</span>
                  </button>

                  <div className="bg-sky-50/50 border border-sky-100/50 rounded-2xl p-4 space-y-1">
                    <span className="text-[9px] font-black text-sky-600 uppercase tracking-widest block">
                      Detected Area
                    </span>
                    <p className="text-sm font-black text-sky-800">
                      {detectedArea}
                    </p>
                  </div>
                </div>

                {/* Right Map visualizer */}
                <div className="w-full md:w-64 h-48 sm:h-auto min-h-[160px] bg-slate-100 rounded-3xl border border-gray-150 relative overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                  {/* Mock SVG Map background */}
                  <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,20 Q40,40 100,10" fill="none" stroke="#94a3b8" strokeWidth="1" />
                    <path d="M0,50 L100,60" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                    <path d="M20,0 L30,100" fill="none" stroke="#94a3b8" strokeWidth="1" />
                    <path d="M70,0 Q60,50 80,100" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
                    <circle cx="50" cy="50" r="15" fill="#e2e8f0" />
                  </svg>

                  {/* Blue dot/Pulse for location */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                    <span className="absolute inline-flex h-10 w-10 rounded-full bg-sky-400 opacity-20 animate-ping" />
                    <div className="w-4 h-4 bg-sky-500 rounded-full border-2 border-white shadow-md relative" />
                  </div>

                  {/* Red Pin representing destination */}
                  {locationInput && (
                    <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 z-10 animate-bounce">
                      <MapPin className="w-8 h-8 text-red-500 fill-red-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Action buttons */}
            <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
              <button
                type="submit"
                disabled={isSubmitting || description.length < 20}
                className="bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all select-none active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
              <Link
                href="/complaints"
                className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Save as Draft
              </Link>
            </div>

          </form>

          {/* Reusable Success confirmation modal overlay */}
          <SuccessModal
            isOpen={isSubmitted}
            onClose={handleCloseModal}
            reportId={reportId}
            onPrimaryAction={handleViewDashboard}
            onSecondaryAction={handleSubmitAnother}
          />
        </div>

        {/* Right Column: AI Analysis & Guidelines (1/3 width) */}
        <div className="w-full lg:w-96 space-y-6 shrink-0">
          <LiveAIAnalysis description={description} />
          <ReportingGuidelines />
        </div>

      </div>

      {/* Global Simple Footer */}
      <footer className="bg-slate-100/50 border-t border-slate-200 mt-auto">
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-4">
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
