"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Loader2, Sparkles } from "lucide-react";

interface DuplicateDetectionProps {
  description: string;
  latitude: number | null;
  longitude: number | null;
}

interface MockDuplicate {
  id: string;
  title: string;
  distance: number;
  similarity: number;
  status: string;
  reporter: string;
  created_at: string;
}

export default function DuplicateDetection({ description, latitude, longitude }: DuplicateDetectionProps) {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<MockDuplicate[]>([]);
  const [actionDone, setActionDone] = useState<string | null>(null);

  useEffect(() => {
    // Reset state if description length drops or location is unset
    if (description.trim().length < 20 || latitude === null || longitude === null) {
      setResults([]);
      setActionDone(null);
      return;
    }

    setScanning(true);
    const timer = setTimeout(() => {
      setScanning(false);
      const text = description.toLowerCase();
      const matches: MockDuplicate[] = [];

      // Simulating semantic match based on input
      if (text.includes("pothole") || text.includes("road") || text.includes("street")) {
        matches.push({
          id: "1",
          title: "Pothole Blocking Traffic on Chowdhury Road",
          distance: 35,
          similarity: 94,
          status: "in progress",
          reporter: "Zubair Rahman",
          created_at: "3 hours ago",
        });
      }
      
      if (text.includes("garbage") || text.includes("waste") || text.includes("trash")) {
        matches.push({
          id: "2",
          title: "Overflowing Waste Bin near GEC circle",
          distance: 110,
          similarity: 87,
          status: "pending",
          reporter: "Nafisa Kamal",
          created_at: "1 day ago",
        });
      }

      if (text.includes("drain") || text.includes("water") || text.includes("flood")) {
        matches.push({
          id: "3",
          title: "Sewer Line Overflow near GEC East Gate",
          distance: 72,
          similarity: 91,
          status: "assigned",
          reporter: "Imran Chowdhury",
          created_at: "5 hours ago",
        });
      }

      setResults(matches);
    }, 800);

    return () => clearTimeout(timer);
  }, [description, latitude, longitude]);

  const handleUpvoteCancel = (dupTitle: string) => {
    setActionDone(`Upvoted "${dupTitle}" successfully! Your draft submission has been dismissed.`);
  };

  const handleRequestMerge = (dupTitle: string) => {
    setActionDone(`Requested to merge report with "${dupTitle}". A moderation queue entry has been created.`);
  };

  if (actionDone) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 shadow-sm space-y-2 animate-fade-in">
        <div className="flex items-center space-x-2 text-emerald-700">
          <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
          <h4 className="text-xs font-black uppercase tracking-wider">Action Recorded</h4>
        </div>
        <p className="text-xs text-emerald-800 font-semibold leading-relaxed">
          {actionDone}
        </p>
        <button
          type="button"
          onClick={() => setActionDone(null)}
          className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 underline mt-2 block"
        >
          Scan Again
        </button>
      </div>
    );
  }

  if (scanning) {
    return (
      <div className="flex items-center justify-center p-6 space-x-2.5 text-slate-400 text-xs font-black bg-white rounded-3xl border border-gray-150 shadow-sm min-h-[120px]">
        <Loader2 className="w-4 h-4 animate-spin text-brand-teal" />
        <span>Semantic & Proximity Scanning...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-150 p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-gray-700">
          <MapPin className="w-4.5 h-4.5 text-gray-400" />
          <h4 className="text-xs font-black uppercase tracking-wider">Duplicate Scan</h4>
        </div>
        <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
          Geospatial scanning is waiting for location coordinates and detailed text input (min. 20 chars).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-rose-200 p-5 shadow-sm space-y-4 animate-fade-in ring-1 ring-rose-500/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-rose-600">
          <AlertTriangle className="w-4.5 h-4.5 stroke-[2.5]" />
          <h4 className="text-xs font-black uppercase tracking-wider text-rose-700">Potential Duplicate Found</h4>
        </div>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200/50">
          AI flagged
        </span>
      </div>
      
      <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
        MuniFix AI detected similar complaints reported within the same vicinity with high description match scores:
      </p>

      <div className="space-y-3.5">
        {results.map((dup) => (
          <div key={dup.id} className="p-3.5 bg-rose-50/20 border border-rose-100 rounded-2xl space-y-3">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h5 className="text-xs font-bold text-gray-900 leading-snug">{dup.title}</h5>
                <p className="text-[9px] text-gray-400 font-bold mt-0.5">
                  Reported by {dup.reporter} • {dup.created_at}
                </p>
              </div>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 shrink-0">
                {dup.similarity}% Match
              </span>
            </div>

            <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold pt-2 border-t border-rose-100/50">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                {dup.distance}m away
              </span>
              <span className="uppercase tracking-wider text-xxs font-black px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                {dup.status}
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleUpvoteCancel(dup.title)}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10px] transition-all text-center cursor-pointer active:scale-[0.98] shadow-xs"
              >
                Upvote & Dismiss
              </button>
              <button
                type="button"
                onClick={() => handleRequestMerge(dup.title)}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-gray-200 font-bold rounded-xl text-[10px] transition-all text-center cursor-pointer active:scale-[0.98]"
              >
                Request Merge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
