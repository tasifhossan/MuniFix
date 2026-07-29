import React from "react";
import { Check, AlertTriangle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  expectedResponse?: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  // Optional AI integration props
  aiCategory?: string | null;
  aiPriority?: string | null;
  aiConfidence?: number | null; // 0-100
}

export default function SuccessModal({
  isOpen,
  onClose,
  reportId,
  expectedResponse = "48 Hours",
  title = "Complaint Submitted Successfully",
  description = "Your report has been logged and sent to the relevant department. You can track its progress in your dashboard.",
  primaryButtonText = "View Dashboard",
  secondaryButtonText = "Submit Another",
  onPrimaryAction,
  onSecondaryAction,
  aiCategory,
  aiPriority,
  aiConfidence,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop overlay with blur */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-2xl border border-slate-100/80 flex flex-col items-center text-center space-y-6 max-w-[420px] w-full z-10 transform scale-100 transition-all duration-300 animate-scale-up">
        
        {/* Check Status Badge */}
        <div className="w-16 h-16 bg-[#cbf1ee] text-brand-teal rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
          {/* Subtle design circles for extra premium feel */}
          <div className="absolute inset-0.5 border border-brand-teal/20 rounded-full" />
          <Check className="w-8 h-8 stroke-[3.5]" />
        </div>

        {/* Informational Text */}
        <div className="space-y-2.5">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug">
            {title}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm font-semibold leading-relaxed max-w-[340px] mx-auto">
            {description}
          </p>
        </div>

        {/* Premium AI preview panel */}
        {aiCategory !== undefined && (
          <div className="w-full bg-[#f0faf8] border border-[#a2e3dc]/40 rounded-2xl p-4.5 text-left space-y-3.5 select-none relative overflow-hidden">
            {/* Soft decorative background glow */}
            <div className="absolute right-0 top-0 w-24 h-24 bg-[#0f766e]/5 rounded-full blur-xl pointer-events-none" />
            
            {/* Header label and optional needs review badge */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#0f766e] uppercase tracking-widest flex items-center gap-1">
                <span>⚡</span> AI Routing Engine
              </span>
              
              {/* Needs manual review warning badge if confidence is low (< 70) */}
              {(aiConfidence === null || aiConfidence === undefined || aiConfidence < 70) && (
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-650 px-2 py-0.5 rounded text-[9px] font-black tracking-wide uppercase border border-red-100/60 leading-none">
                  Needs manual review
                </span>
              )}
            </div>

            {/* If AI information is null/missing (Gemini failed backend-side and returned nulls) */}
            {(!aiCategory || !aiPriority) ? (
              <p className="text-slate-500 font-semibold text-xs leading-relaxed">
                AI categorization unavailable — a team member will categorize this manually
              </p>
            ) : (
              <div className="space-y-3.5">
                {/* Category & Priority detail row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                      Predicted Category
                    </span>
                    <span className="text-gray-850 font-black text-xs block leading-tight">
                      {aiCategory}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                      Priority Level
                    </span>
                    <span className={`text-xs font-black uppercase tracking-wider block ${
                      aiPriority.toLowerCase() === "critical" || aiPriority.toLowerCase() === "high" 
                        ? "text-red-600" 
                        : aiPriority.toLowerCase() === "low" 
                          ? "text-slate-500" 
                          : "text-amber-600"
                    }`}>
                      {aiPriority}
                    </span>
                  </div>
                </div>

                {/* Progress bar and confidence score */}
                {aiConfidence !== null && aiConfidence !== undefined && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-gray-450">
                      <span>Confidence Score</span>
                      <span className={aiConfidence < 70 ? "text-amber-600" : "text-[#0f766e]"}>
                        {aiConfidence.toFixed(1)}%
                      </span>
                    </div>
                    {/* Normalized Progress bar wrapper */}
                    <div className="w-full h-1.5 bg-slate-100 border border-slate-200/40 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          aiConfidence < 70 ? "bg-amber-500" : "bg-[#0f766e]"
                        }`}
                        style={{ width: `${Math.min(Math.max(aiConfidence, 0), 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Report Metadata box */}
        <div className="w-full bg-[#f8fafc] border border-slate-150 rounded-2xl p-4 sm:p-5 flex justify-between items-center text-left gap-4">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
              Report ID
            </span>
            <span className="text-gray-800 font-extrabold text-xs sm:text-sm tracking-tight block break-all font-mono">
              {reportId}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
              Expected Response
            </span>
            <span className="text-brand-teal font-extrabold text-xs sm:text-sm tracking-tight block">
              {expectedResponse}
            </span>
          </div>
        </div>

        {/* Actions Button Stack */}
        <div className="w-full flex flex-col gap-3 pt-2">
          <button
            onClick={onPrimaryAction}
            className="w-full bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-brand-teal/10 hover:shadow-brand-teal/20 select-none active:scale-[0.98] cursor-pointer"
          >
            {primaryButtonText}
          </button>
          
          <button
            onClick={onSecondaryAction}
            className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-sm font-bold py-3.5 px-6 rounded-xl transition-all select-none active:scale-[0.98] cursor-pointer"
          >
            {secondaryButtonText}
          </button>
        </div>

      </div>
    </div>
  );
}
