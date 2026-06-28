"use client";

import React from "react";
import { Landmark, Gauge } from "lucide-react";

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  showLogo?: boolean;
}

export default function LoadingScreen({
  title = "Preparing your dashboard...",
  subtitle = "Syncing complaint reports...",
  icon,
  showLogo = true,
}: LoadingScreenProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/40 p-6 font-sans relative overflow-hidden">
      {/* Soft background ambient glow for modern aesthetics */}
      <div className="absolute top-[-10%] left-[-15%] w-[400px] h-[400px] bg-teal-50/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[450px] h-[450px] bg-amber-50/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center space-y-8 animate-fade-in max-w-sm w-full text-center">
        {/* Brand Logo Header */}
        {showLogo && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-transparent text-brand-teal flex items-center justify-center">
              <Landmark className="w-6.5 h-6.5 fill-current" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-brand-teal select-none">
              MuniFix Ctg
            </span>
          </div>
        )}

        {/* Circular Loading Progress Indicator */}
        <div className="relative w-16 h-16 flex items-center justify-center mt-2">
          {/* Animated SVG Progress Ring */}
          <svg className="w-full h-full animate-spin" viewBox="0 0 56 56">
            {/* Track Circle */}
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              className="text-slate-100/80"
              strokeWidth="3.5"
              fill="none"
            />
            {/* Progress Arc */}
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              className="text-brand-teal"
              strokeWidth="3.5"
              strokeDasharray="150"
              strokeDashoffset="105"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          {/* Central Icon container */}
          <div className="absolute inset-2.5 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-inner hover:scale-105 transition-transform duration-300">
            {icon || <Gauge className="w-5 h-5 text-brand-teal/80 stroke-[2.2]" />}
          </div>
        </div>

        {/* Informative Messages */}
        <div className="space-y-2 mt-4">
          <h2 className="text-base sm:text-lg font-bold text-brand-teal-hover tracking-tight leading-snug">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
