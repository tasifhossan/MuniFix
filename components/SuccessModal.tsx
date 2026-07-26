"use client";

import React from "react";
import { Check } from "lucide-react";

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
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay with blur */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
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

        {/* Report Metadata box */}
        <div className="w-full bg-[#f8fafc] border border-slate-150 rounded-2xl p-4 sm:p-5 flex justify-between items-center text-left">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
              Report ID
            </span>
            <span className="text-gray-800 font-extrabold text-sm sm:text-base tracking-tight">
              {reportId}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
              Expected Response
            </span>
            <span className="text-brand-teal font-extrabold text-sm sm:text-base tracking-tight">
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
