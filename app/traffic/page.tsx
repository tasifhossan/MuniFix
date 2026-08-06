"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Navigation,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Loader2,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  FolderOpen
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchRoadblocks,
  requestAIReroute,
  createRoadblock,
  updateRoadblockStatus,
  getRoadSnappedPath,
  Roadblock,
  RerouteResponse
} from "@/lib/api";

const TrafficMap = dynamic(() => import("@/components/TrafficMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] bg-slate-100 rounded-3xl border border-gray-150 flex items-center justify-center animate-pulse">
      <p className="text-gray-400 text-xs font-bold">Loading Interactive Route Map...</p>
    </div>
  )
});

// Chittagong pre-set points of interest for easy testing
const CHITTAGONG_PRESETS = [
  { name: "GEC Circle", coords: [22.3585, 91.8215] as [number, number] },
  { name: "Tiger Pass", coords: [22.3362, 91.8115] as [number, number] },
  { name: "Agrabad Commercial Area", coords: [22.3278, 91.8119] as [number, number] },
  { name: "Bahaddarhat Junction", coords: [22.3686, 91.8415] as [number, number] },
  { name: "Chawkbazar", coords: [22.3571, 91.8358] as [number, number] },
  { name: "Lalkhan Bazar", coords: [22.3484, 91.8203] as [number, number] },
];

export default function TrafficDetourPage() {
  const { user } = useAuth();
  const isWorkerOrAdmin = !!(user && user.role !== "citizen");

  const [roadblocks, setRoadblocks] = useState<Roadblock[]>([]);
  const [selectedRoadblock, setSelectedRoadblock] = useState<Roadblock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tab navigation for admin/workers
  const [activeTab, setActiveTab] = useState<"detour" | "manage">("detour");

  // Detour parameters
  const [originName, setOriginName] = useState("Origin Point");
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destName, setDestName] = useState("Destination Point");
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);

  // Detour Result parameters
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<RerouteResponse["data"] | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  // New roadblock form states
  const [rbTitle, setRbTitle] = useState("");
  const [rbCause, setRbCause] = useState("waterlogging");
  const [rbSeverity, setRbSeverity] = useState("severe");
  const [rbRadius, setRbRadius] = useState(300);
  const [rbDescription, setRbDescription] = useState("");
  const [newRbCoords, setNewRbCoords] = useState<[number, number] | null>(null);
  const [rbSubmitting, setRbSubmitting] = useState(false);
  const [rbError, setRbError] = useState<string | null>(null);
  const [rbSuccess, setRbSuccess] = useState<string | null>(null);

  // Roadblock action states
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchRoadblocks();
      if (res.success) {
        setRoadblocks(res.roadblocks);
        // Default to select first roadblock if present
        if (res.roadblocks.length > 0) {
          setSelectedRoadblock(res.roadblocks[0]);
        } else {
          setSelectedRoadblock(null);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load roadblocks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // When roadblock is selected, pre-populate sensible default test path around it
  const handleSelectRoadblock = (rb: Roadblock) => {
    setSelectedRoadblock(rb);
    setResult(null);
    setCalcError(null);

    const lat = parseFloat(rb.latitude);
    const lng = parseFloat(rb.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setOriginCoords([lat - 0.008, lng + 0.005]);
      setOriginName("Test Origin (South)");
      setDestCoords([lat + 0.008, lng - 0.005]);
      setDestName("Test Destination (North)");
    }
  };

  const handleCalculateDetour = async () => {
    if (!selectedRoadblock) {
      setCalcError("Please select an active roadblock on the map or list.");
      return;
    }
    if (!originCoords || !destCoords) {
      setCalcError("Please select both Origin and Destination locations.");
      return;
    }

    try {
      setCalculating(true);
      setCalcError(null);
      setResult(null);

      const res = await requestAIReroute({
        roadblock_id: selectedRoadblock.id,
        origin_lat: originCoords[0],
        origin_lng: originCoords[1],
        destination_lat: destCoords[0],
        destination_lng: destCoords[1],
        origin_name: originName,
        destination_name: destName
      });

      if (res.success) {
        // Snap coordinates to actual roads via OSRM helper
        const snappedBlocked = await getRoadSnappedPath(res.data.paths.blocked_path);
        const snappedBypass = await getRoadSnappedPath(res.data.paths.bypass_path);

        setResult({
          ...res.data,
          paths: {
            blocked_path: snappedBlocked,
            bypass_path: snappedBypass
          }
        });
      } else {
        setCalcError(res.message || "Failed to calculate detour.");
      }
    } catch (err: any) {
      setCalcError(err.message || "Failed to call detour API.");
    } finally {
      setCalculating(false);
    }
  };

  const handleSetOriginPreset = (preset: typeof CHITTAGONG_PRESETS[0]) => {
    setOriginCoords(preset.coords);
    setOriginName(preset.name);
  };

  const handleSetDestPreset = (preset: typeof CHITTAGONG_PRESETS[0]) => {
    setDestCoords(preset.coords);
    setDestName(preset.name);
  };

  // Submit new roadblock (Workers & Admins only)
  const handleCreateRoadblock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rbTitle.trim() || !rbDescription.trim()) {
      setRbError("Title and description are required.");
      return;
    }
    if (!newRbCoords) {
      setRbError("Please drop a roadblock marker on the map.");
      return;
    }

    try {
      setRbSubmitting(true);
      setRbError(null);
      setRbSuccess(null);

      const res = await createRoadblock({
        title: rbTitle.trim(),
        description: rbDescription.trim(),
        cause: rbCause,
        severity: rbSeverity,
        latitude: newRbCoords[0],
        longitude: newRbCoords[1],
        affected_radius_meters: rbRadius,
      });

      if (res.success) {
        setRbSuccess("Roadblock published successfully!");
        setRbTitle("");
        setRbDescription("");
        setNewRbCoords(null);
        // Refresh roadblock list
        await loadData();
      } else {
        setRbError(res.message || "Failed to publish roadblock.");
      }
    } catch (err: any) {
      setRbError(err.message || "Error submitting roadblock.");
    } finally {
      setRbSubmitting(false);
    }
  };

  // Resolve roadblock (Workers & Admins only)
  const handleResolveRoadblock = async (id: string) => {
    if (!window.confirm("Are you sure you want to resolve this roadblock? It will be deactivated and resolved in the database.")) {
      return;
    }

    try {
      setResolvingId(id);
      const res = await updateRoadblockStatus(id, false);
      if (res.success) {
        await loadData();
      }
    } catch (err: any) {
      alert(`Failed to resolve roadblock: ${err.message}`);
    } finally {
      setResolvingId(null);
    }
  };

  if (loading) {
    return <LoadingScreen title="Loading AI detours & roadblocks..." subtitle="Syncing detour options..." />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar activeNav="traffic" isDashboard />

      <div className="flex flex-col md:flex-row flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 flex flex-col gap-6">
          {/* Header section */}
          <div className="flex items-center justify-between border-b border-gray-150 pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                AI Traffic Detour Map
              </h1>
              <p className="text-gray-500 text-sm font-semibold mt-1">
                Real-time route optimization using Gemini 2.5 Flash to bypass active community roadblocks.
              </p>
            </div>
            <button
              onClick={loadData}
              className="border border-gray-200 hover:bg-slate-50 text-gray-650 font-bold p-2.5 rounded-xl transition-all shadow-sm cursor-pointer animate-none"
              title="Refresh Roadblocks"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Interactive grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Panel: Detour Parameters / Roadblock Management */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Role-based Tab switcher if user is admin or worker */}
              {isWorkerOrAdmin && (
                <div className="bg-white p-1.5 rounded-2xl border border-gray-150 flex gap-1 shadow-sm select-none">
                  <button
                    onClick={() => setActiveTab("detour")}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                      activeTab === "detour"
                        ? "bg-brand-teal text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Detour Calculator
                  </button>
                  <button
                    onClick={() => setActiveTab("manage")}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                      activeTab === "manage"
                        ? "bg-red-600 text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    🛠️ Publish & Manage
                  </button>
                </div>
              )}

              {activeTab === "detour" ? (
                <>
                  {/* Form Input Card */}
                  <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-5">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-brand-teal" />
                      <span>Detour parameters</span>
                    </h3>

                    {/* Roadblock Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                        1. Select active roadblock
                      </label>
                      {roadblocks.length === 0 ? (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-gray-200 text-center">
                          <p className="text-xs font-semibold text-gray-400">No active roadblocks in the database.</p>
                        </div>
                      ) : (
                        <select
                          value={selectedRoadblock?.id || ""}
                          onChange={(e) => {
                            const rb = roadblocks.find((r) => r.id === e.target.value);
                            if (rb) handleSelectRoadblock(rb);
                          }}
                          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-teal bg-white font-semibold text-gray-800"
                        >
                          {roadblocks.map((rb) => (
                            <option key={rb.id} value={rb.id}>
                              {rb.title} ({rb.cause})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Origin Selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                        2. Origin Location
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={originName}
                          onChange={(e) => setOriginName(e.target.value)}
                          className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-teal font-semibold text-gray-800"
                          placeholder="Origin point name"
                        />
                        <span className="text-xs text-gray-400 font-mono select-none">
                          {originCoords ? `${originCoords[0].toFixed(4)}, ${originCoords[1].toFixed(4)}` : "No pin drop"}
                        </span>
                      </div>
                      {/* Preset quick links */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {CHITTAGONG_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => handleSetOriginPreset(preset)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-lg text-[9px] font-bold transition-colors cursor-pointer select-none"
                          >
                            {preset.name.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Destination Selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                        3. Target Destination
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={destName}
                          onChange={(e) => setDestName(e.target.value)}
                          className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-teal font-semibold text-gray-800"
                          placeholder="Destination point name"
                        />
                        <span className="text-xs text-gray-400 font-mono select-none">
                          {destCoords ? `${destCoords[0].toFixed(4)}, ${destCoords[1].toFixed(4)}` : "No pin drop"}
                        </span>
                      </div>
                      {/* Preset quick links */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {CHITTAGONG_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => handleSetDestPreset(preset)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-lg text-[9px] font-bold transition-colors cursor-pointer select-none"
                          >
                            {preset.name.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {calcError && (
                      <p className="text-red-500 text-xxs font-bold mt-2">{calcError}</p>
                    )}

                    <button
                      onClick={handleCalculateDetour}
                      disabled={calculating || !selectedRoadblock || !originCoords || !destCoords}
                      className="w-full bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {calculating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Optimizing with Gemini...</span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-4 h-4 text-white" />
                          <span>Calculate AI Detour</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Reroute Result Card */}
                  {result && (
                    <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-5 animate-scale-up">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-brand-cyan-bg text-brand-teal rounded-xl">
                          <Sparkles className="w-5 h-5 fill-current text-brand-teal animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                            AI detour optimization
                          </h4>
                          <p className="text-[10px] text-gray-400 font-semibold">Gemini detour computed successfully.</p>
                        </div>
                      </div>

                      {/* Metrics stats block */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Blocked ETA</span>
                          <span className="text-lg font-black text-gray-800 mt-1 block">{result.metrics.blocked_eta_mins}m</span>
                        </div>
                        <div className="bg-emerald-50/50 p-3 rounded-2xl text-center border border-emerald-100">
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">Bypass ETA</span>
                          <span className="text-lg font-black text-emerald-700 mt-1 block">{result.metrics.bypass_eta_mins}m</span>
                        </div>
                        <div className="bg-brand-cyan-bg/30 p-3 rounded-2xl text-center border border-brand-teal/10">
                          <span className="text-[9px] font-black text-brand-teal uppercase tracking-wider block">Time Saved</span>
                          <span className="text-lg font-black text-brand-teal mt-1 block">+{result.metrics.time_saved_mins}m</span>
                        </div>
                      </div>

                      {/* Distance increase text */}
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Route distance offset:</span>
                        <span className="text-slate-800 font-bold">+{result.metrics.distance_diff_km} km detour</span>
                      </div>

                      {/* AI Reasoning Text Container */}
                      <div className="bg-[#005c55]/5 border border-[#005c55]/15 p-4 rounded-2xl space-y-1.5 relative overflow-hidden">
                        <span className="text-[9px] font-black text-[#005c55] uppercase tracking-wider block">AI Reasoning</span>
                        <p className="text-xs text-[#005c55] font-semibold leading-relaxed">
                          {result.ai_reasoning}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Tab 2: Manage roadblocks (Only visible to non-citizens)
                <div className="space-y-6">
                  {/* Publish Roadblock Form */}
                  <form onSubmit={handleCreateRoadblock} className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-red-650" />
                      <span>Publish Roadblock</span>
                    </h3>

                    {/* Title */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                        Roadblock Title
                      </label>
                      <input
                        type="text"
                        value={rbTitle}
                        onChange={(e) => setRbTitle(e.target.value)}
                        placeholder="e.g. GEC Circle Flooding"
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-teal font-semibold text-gray-800"
                        required
                      />
                    </div>

                    {/* Cause and Severity */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                          Cause
                        </label>
                        <select
                          value={rbCause}
                          onChange={(e) => setRbCause(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-teal bg-white font-semibold text-gray-800"
                        >
                          <option value="waterlogging">Waterlogging</option>
                          <option value="broken_road">Broken Road</option>
                          <option value="accident">Accident</option>
                          <option value="construction">Construction</option>
                          <option value="protest">Protest/Strike</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                          Severity
                        </label>
                        <select
                          value={rbSeverity}
                          onChange={(e) => setRbSeverity(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-teal bg-white font-semibold text-gray-800"
                        >
                          <option value="moderate">Moderate Delay</option>
                          <option value="severe">Severe Congestion</option>
                          <option value="closed">Closed / Blocked</option>
                        </select>
                      </div>
                    </div>

                    {/* Affected Radius */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                        Affected Radius (Meters)
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="2000"
                        value={rbRadius}
                        onChange={(e) => setRbRadius(parseInt(e.target.value, 10))}
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-teal font-semibold text-gray-800"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                        Description / Details
                      </label>
                      <textarea
                        value={rbDescription}
                        onChange={(e) => setRbDescription(e.target.value)}
                        placeholder="Provide details about the roadblock cause and redirect suggestions..."
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-teal font-semibold text-gray-800 h-20 resize-none"
                        required
                      />
                    </div>

                    {/* Map Placement Coordinates */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                        Roadblock Coordinates
                      </label>
                      {newRbCoords ? (
                        <div className="bg-slate-50 px-4 py-2.5 rounded-xl flex items-center justify-between border border-gray-200 text-slate-800 text-xs font-mono font-bold">
                          <span>📍 {newRbCoords[0].toFixed(5)}, {newRbCoords[1].toFixed(5)}</span>
                          <button
                            type="button"
                            onClick={() => setNewRbCoords(null)}
                            className="text-red-500 hover:text-red-700 text-xxs font-black uppercase tracking-wider"
                          >
                            Clear
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 bg-red-50/50 border border-dashed border-red-200 rounded-xl text-center">
                          <p className="text-[10px] font-bold text-red-700">
                            Click "⚠️ Click Map for Roadblock" on the map's helper overlay, then click any point on the map to set the coordinates.
                          </p>
                        </div>
                      )}
                    </div>

                    {rbError && <p className="text-red-500 text-xxs font-bold">{rbError}</p>}
                    {rbSuccess && <p className="text-emerald-600 text-xxs font-bold">{rbSuccess}</p>}

                    <button
                      type="submit"
                      disabled={rbSubmitting || !newRbCoords}
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      {rbSubmitting ? "Publishing..." : "Publish Roadblock"}
                    </button>
                  </form>

                  {/* Active Roadblocks List with deactivation option */}
                  <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-4 max-h-[350px] overflow-y-auto">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-gray-400" />
                      <span>Active Roadblocks ({roadblocks.length})</span>
                    </h3>

                    {roadblocks.length === 0 ? (
                      <p className="text-xs text-gray-400 font-semibold text-center py-4">No active roadblocks.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {roadblocks.map((rb) => (
                          <div
                            key={rb.id}
                            className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <p className="font-extrabold text-gray-800 truncate">{rb.title}</p>
                              <p className="text-gray-400 font-semibold text-[10px] capitalize">
                                {rb.cause} &bull; {rb.severity}
                              </p>
                            </div>
                            <button
                              onClick={() => handleResolveRoadblock(rb.id)}
                              disabled={resolvingId === rb.id}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50 text-[10px]"
                            >
                              {resolvingId === rb.id ? "Resolving..." : "Resolve"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel: Interactive Route Map */}
            <div className="lg:col-span-7 bg-white rounded-[2rem] border border-gray-150 p-4 shadow-sm h-[520px]">
              <TrafficMap
                roadblocks={roadblocks}
                selectedRoadblock={selectedRoadblock}
                origin={originCoords}
                destination={destCoords}
                blockedPath={result ? result.paths.blocked_path : null}
                bypassPath={result ? result.paths.bypass_path : null}
                onSetOrigin={(coords) => {
                  setOriginCoords(coords);
                  setOriginName(`Map Drop (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`);
                }}
                onSetDestination={(coords) => {
                  setDestCoords(coords);
                  setDestName(`Map Drop (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`);
                }}
                onSelectRoadblock={handleSelectRoadblock}
                isAddingRoadblock={isWorkerOrAdmin}
                newRoadblockCoords={newRbCoords}
                onSetNewRoadblockCoords={setNewRbCoords}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
