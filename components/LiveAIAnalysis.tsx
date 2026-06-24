"use client";

import React, { useMemo } from "react";
import { Sparkles, HelpCircle, AlertTriangle, Lightbulb, Check } from "lucide-react";

interface LiveAIAnalysisProps {
  description: string;
}

export default function LiveAIAnalysis({ description }: LiveAIAnalysisProps) {
  // Simple heuristic analysis representing the "Live AI"
  const aiState = useMemo(() => {
    const text = description.trim().toLowerCase();
    
    if (text.length < 10) {
      return {
        category: "Waiting for input...",
        subtext: "Analysis pending",
        priority: "Undetermined",
        sla: "--",
        isPending: true
      };
    }

    // Heuristics
    if (text.includes("pothole") || text.includes("road") || text.includes("street damage") || text.includes("asphalt")) {
      const isCritical = text.includes("dangerous") || text.includes("accident") || text.includes("huge") || text.includes("damage");
      return {
        category: "Engineering / Roads",
        subtext: "Categorized by MuniFix AI",
        priority: isCritical ? "CRITICAL" : "MEDIUM",
        sla: isCritical ? "24 Hours" : "3 Days",
        isPending: false
      };
    }

    if (text.includes("light") || text.includes("lamp") || text.includes("dark") || text.includes("electricity") || text.includes("cable")) {
      return {
        category: "Street Lighting & Power",
        subtext: "Categorized by MuniFix AI",
        priority: "MEDIUM",
        sla: "48 Hours",
        isPending: false
      };
    }

    if (text.includes("drain") || text.includes("water") || text.includes("flood") || text.includes("sewer") || text.includes("pipe") || text.includes("leak")) {
      const isCritical = text.includes("flood") || text.includes("burst") || text.includes("overflow");
      return {
        category: "Water & Sewerage",
        subtext: "Categorized by MuniFix AI",
        priority: isCritical ? "CRITICAL" : "MEDIUM",
        sla: isCritical ? "24 Hours" : "3 Days",
        isPending: false
      };
    }

    if (text.includes("garbage") || text.includes("waste") || text.includes("trash") || text.includes("dustbin") || text.includes("smell")) {
      const isCritical = text.includes("days") || text.includes("traffic") || text.includes("block");
      return {
        category: "Waste Management",
        subtext: "Categorized by MuniFix AI",
        priority: isCritical ? "MEDIUM" : "LOW",
        sla: isCritical ? "48 Hours" : "3 Days",
        isPending: false
      };
    }

    // Generic match
    return {
      category: "Municipal Services",
      subtext: "Categorized by MuniFix AI",
      priority: "MEDIUM",
      sla: "3 Days",
      isPending: false
    };
  }, [description]);

  return (
    <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden flex flex-col">
      {/* AI Title Banner */}
      <div className="bg-[#005C55] text-white py-4 px-6 flex items-center space-x-2">
        <Sparkles className="w-5 h-5 fill-current animate-pulse text-amber-300" />
        <span className="text-sm font-bold tracking-tight">Live AI Analysis</span>
      </div>

      <div className="p-6 space-y-6">
        {/* Predicted Category */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
            Predicted Category
          </label>
          <div className={`p-4 rounded-2xl flex items-center space-x-3.5 transition-all duration-300 ${
            aiState.isPending
              ? "bg-indigo-50/50 border border-indigo-100/50"
              : "bg-teal-50/50 border border-brand-teal/10"
          }`}>
            {aiState.isPending ? (
              <div className="p-2 bg-indigo-100 text-indigo-500 rounded-xl shrink-0">
                <HelpCircle className="w-6 h-6 stroke-[2.5px] animate-spin" />
              </div>
            ) : (
              <div className="p-2 bg-brand-cyan-bg text-brand-teal rounded-xl shrink-0">
                <Check className="w-6 h-6 stroke-[3px]" />
              </div>
            )}
            <div>
              <p className={`text-sm font-bold leading-snug ${aiState.isPending ? "text-gray-500" : "text-gray-800"}`}>
                {aiState.category}
              </p>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                {aiState.subtext}
              </p>
            </div>
          </div>
        </div>

        {/* Priority Level */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
            Priority Level
          </label>
          <div className="flex items-center justify-between">
            {aiState.priority === "CRITICAL" && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 animate-scale-up">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-500 stroke-[2.5]" />
                Critical
              </span>
            )}
            {aiState.priority === "MEDIUM" && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100 animate-scale-up">
                Medium
              </span>
            )}
            {aiState.priority === "LOW" && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 animate-scale-up">
                Low
              </span>
            )}
            {aiState.priority === "Undetermined" && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-gray-500 border border-gray-200">
                Undetermined
              </span>
            )}

            <span className="text-xs font-bold text-gray-400">
              SLA: <span className="text-gray-700 font-black">{aiState.sla}</span>
            </span>
          </div>
        </div>

        {/* Tip Box */}
        <div className="border border-teal-100 bg-teal-50/20 p-4 rounded-2xl flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
          <p className="text-xs text-brand-teal font-semibold leading-relaxed">
            Tip: Adding clear photos of the issue helps the municipal team respond up to 40% faster.
          </p>
        </div>
      </div>
    </div>
  );
}
