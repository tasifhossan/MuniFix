"use client";

import React from "react";
import { Check } from "lucide-react";
import { TimelineStep } from "@/lib/mockData";

interface TimelineProps {
  steps: TimelineStep[];
}

export default function Timeline({ steps }: TimelineProps) {
  // Custom status badge renderer to match screenshot details
  const renderStatusBadge = (status: string, isActive: boolean) => {
    const norm = status.toLowerCase();
    if (!isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wider bg-gray-100 text-gray-400 border border-gray-200">
          {status}
        </span>
      );
    }
    switch (norm) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold bg-slate-100 text-slate-500 border border-slate-200">
            Pending
          </span>
        );
      case "assigned":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold bg-blue-50 text-blue-600 border border-blue-100">
            Assigned
          </span>
        );
      case "in progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold bg-brand-teal text-white border border-brand-teal-hover">
            In Progress
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold bg-gray-150 text-gray-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-gray-800 tracking-tight">Resolution Progress</h3>

      <div className="relative pl-10 space-y-8 pb-2">
        {/* Vertical Track Line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-[2px] bg-slate-150" />

        {steps.map((step, idx) => {
          const isCompleted = step.completed;
          const isCurrent = step.current;
          const isMuted = !isCompleted && !isCurrent;

          return (
            <div key={idx} className="relative flex flex-col items-start text-sm">
              {/* Step indicator node */}
              <div className="absolute left-[-40px] top-0 z-10 flex items-center justify-center">
                {isCompleted && !isCurrent ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/10 border border-emerald-600">
                    <Check className="w-4.5 h-4.5 stroke-[3px]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-8 h-8 rounded-full bg-brand-teal border-4 border-teal-50 flex items-center justify-center shadow-md shadow-brand-teal/10">
                    <div className="w-2.5 h-2.5 bg-brand-teal rounded-full" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center" />
                )}
              </div>

              {/* Title & Badge Row */}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className={`font-bold text-base tracking-tight ${isMuted ? "text-gray-400" : "text-gray-800"}`}>
                  {step.title}
                </h4>
                {renderStatusBadge(step.status, !isMuted)}
              </div>

              {/* Main Content */}
              {step.bubbleText && step.bubbleImages ? (
                /* Work progress custom bubble */
                <div className="space-y-2 w-full mt-2">
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Excavation started. Main valve shut off to control flow. Road crew on standby for surfacing.
                  </p>
                  
                  <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4 max-w-md space-y-4 shadow-inner">
                    <p className="text-gray-700 italic font-semibold text-xs leading-relaxed">
                      &ldquo;{step.bubbleText}&rdquo;
                    </p>
                    {step.bubbleImages.length > 0 && (
                      <div className="flex gap-3">
                        {step.bubbleImages.map((img, i) => (
                          <div key={i} className="w-20 h-16 relative rounded-lg overflow-hidden border border-gray-200 shrink-0">
                            <img
                              src={img}
                              alt="crew-progress"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Normal description */
                <p className={`font-medium mt-1 leading-relaxed ${isMuted ? "text-gray-400" : "text-gray-500"}`}>
                  {step.description}
                </p>
              )}

              {/* Timestamp */}
              {step.time && (
                <span className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-wider block">
                  {step.time}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
