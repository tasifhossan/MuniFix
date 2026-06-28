"use client";

import React, { useState } from "react";
import { createComplaint } from "@/lib/api";
import Link from "next/link";
import { MapPin, Navigation, Compass, Sparkles, AlertTriangle, ArrowLeft, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import EvidenceUpload from "@/components/EvidenceUpload";
import LiveAIAnalysis from "@/components/LiveAIAnalysis";
import ReportingGuidelines from "@/components/ReportingGuidelines";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[220px] bg-slate-100 rounded-3xl border border-gray-150 flex items-center justify-center animate-pulse">
      <p className="text-gray-400 text-xs font-bold">Loading Map Engine...</p>
    </div>
  )
});

export default function NewComplaintPage() {
  const [description, setDescription] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [detectedArea, setDetectedArea] = useState("Chattogram, Bangladesh");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const charLimit = 1000;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= charLimit) {
      setDescription(val);
    }
  };

  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  const handleSearchLocation = async (query: string) => {
    if (!query || query.trim() === "") return;
    setIsSearchingLocation(true);
    setDetectedArea("Searching address...");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setLatitude(lat);
        setLongitude(lon);
        setLocationInput(data[0].display_name);
        setDetectedArea(data[0].display_name);
      } else {
        setDetectedArea("Location not found. Try searching for 'GEC Circle, Chattogram'.");
      }
    } catch (e) {
      console.error("Geocoding failed:", e);
      setDetectedArea("Search failed. Check your network connection.");
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setLocationInput(`${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`);
          setDetectedArea("Chowdhury Road, Ward 15, Chattogram");
        },
        (err) => {
          console.warn("Geolocation failed:", err.message);
          setIsLocating(false);
          setLatitude(22.3569);
          setLongitude(91.8123);
          setLocationInput("22.356900, 91.812300");
          setDetectedArea("GEC Circle, East Gate, Chattogram");
        }
      );
    } else {
      setIsLocating(false);
      setLatitude(22.3569);
      setLongitude(91.8123);
      setLocationInput("22.356900, 91.812300");
      setDetectedArea("GEC Circle, East Gate, Chattogram");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.length < 20) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("description", description);
      if (latitude !== null) fd.append("latitude", String(latitude));
      if (longitude !== null) fd.append("longitude", String(longitude));
      if (selectedFile) {
        fd.append("image", selectedFile);
      }
      const res = await createComplaint(fd);
      if (res.success) {
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
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

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm space-y-8">
              
              {/* Evidence Upload */}
              <EvidenceUpload onFileSelect={setSelectedFile} />

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
                    <div className="relative flex items-center w-full">
                      <MapPin className="absolute left-3 text-gray-400 pointer-events-none w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search address or landmark (e.g. GEC Circle)..."
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSearchLocation(locationInput);
                          }
                        }}
                        className="w-full pl-10 pr-20 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-teal bg-white transition-all text-gray-800 font-semibold placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleSearchLocation(locationInput)}
                        disabled={isSearchingLocation}
                        className="absolute right-2 bg-brand-teal hover:bg-brand-teal-hover text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all active:scale-[0.97] cursor-pointer disabled:opacity-50 select-none"
                      >
                        {isSearchingLocation ? "Locating..." : "Search"}
                      </button>
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
                  <div className="w-full md:w-64 h-48 sm:h-auto min-h-[160px] relative overflow-hidden shrink-0">
                    <InteractiveMap
                      latitude={latitude}
                      longitude={longitude}
                      onChange={(lat, lng) => {
                        setLatitude(lat);
                        setLongitude(lng);
                        setLocationInput(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
                        setDetectedArea(`Selected Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                      }}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-xs font-bold text-red-600 flex items-center space-x-2">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

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
          ) : (
            /* Success confirmation card */
            <div className="bg-white rounded-3xl border border-gray-150 p-8 sm:p-12 text-center shadow-sm space-y-6 animate-scale-up">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Report Successfully Filed</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                  Your complaint was successfully filed in our citizen reports directory. MuniFix AI has dispatched it to the Ward 15 supervisor for scheduling.
                </p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/complaints">
                  <button className="w-full bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-md transition-colors cursor-pointer">
                    Go to Directory
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setDescription("");
                    setLocationInput("");
                    setDetectedArea("Chattogram, Bangladesh");
                    setIsSubmitted(false);
                  }}
                  className="w-full border border-gray-200 hover:bg-slate-50 text-gray-600 text-sm font-semibold px-6 py-3.5 rounded-xl transition-colors cursor-pointer"
                >
                  File Another Issue
                </button>
              </div>
            </div>
          )}
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
