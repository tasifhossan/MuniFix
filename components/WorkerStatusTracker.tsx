"use client";

import React, { useState } from "react";
import { Radio, MapPin, Loader2 } from "lucide-react";

interface WorkerStatusTrackerProps {
  status?: string;
  details?: string;
  onUpdateLocation?: () => Promise<void> | void;
}

export default function WorkerStatusTracker({
  status = "On Active Duty",
  details = "Patrolling Sector 5 (Agrabad)",
  onUpdateLocation,
}: WorkerStatusTrackerProps) {
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!onUpdateLocation) return;
    setUpdating(true);
    try {
      await onUpdateLocation();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-brand-teal rounded-3xl p-6 w-full text-left text-white shadow-lg shadow-brand-teal/15 select-none relative overflow-hidden transition-all duration-350 hover:shadow-xl">
      {/* Background soft lighting effects */}
      <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-extrabold tracking-tight leading-none mb-1.5">
            Current Status
          </h3>
          <span className="text-[10px] font-bold text-teal-150 tracking-wide">
            Live Location Tracking
          </span>
        </div>
        <Radio className="w-5 h-5 text-teal-100 animate-pulse stroke-[2.2]" />
      </div>

      {/* Status Detail with Pulsing Dot */}
      <div className="flex items-start gap-4 mb-6">
        {/* Pulsing Radar Ring */}
        <div className="relative shrink-0 mt-0.5">
          <div className="absolute -inset-1.5 bg-emerald-400/20 rounded-full animate-ping" />
          <div className="relative w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <span className="w-3 h-3 bg-emerald-500 rounded-full" />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-white leading-none mb-1">
            {status}
          </h4>
          <p className="text-[11px] font-semibold text-teal-100 leading-normal">
            {details}
          </p>
        </div>
      </div>

      {/* Update Location Button */}
      <button
        onClick={handleUpdate}
        disabled={updating}
        className="w-full bg-white text-brand-teal hover:bg-slate-50 font-black text-xs py-3 rounded-xl transition-all duration-300 transform active:scale-[0.98] outline-none shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-80 disabled:transform-none select-none"
      >
        {updating ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Updating GPS...</span>
          </>
        ) : (
          <>
            <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Update Location</span>
          </>
        )}
      </button>
    </div>
  );
}
