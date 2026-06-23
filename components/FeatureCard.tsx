"use client";

import React from "react";
import { Zap } from "lucide-react";

interface FeatureCardProps {
  variant: "teal" | "blue" | "orange" | "white";
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  children?: React.ReactNode; // Optional extra content (e.g. mockup images)
}

export default function FeatureCard({
  variant,
  title,
  description,
  icon,
  className = "",
  children
}: FeatureCardProps) {
  if (variant === "teal") {
    return (
      <div className={`md:col-span-2 relative overflow-hidden bg-brand-teal text-white rounded-3xl p-8 sm:p-10 shadow-lg shadow-brand-teal/10 hover:shadow-brand-teal/20 transition-all duration-300 hover:scale-[1.01] group flex flex-col justify-between min-h-[300px] ${className}`}>
        {/* Lightning shape background graphic */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/8 transition-transform group-hover:scale-110 duration-500">
          <Zap className="w-80 h-80 fill-current" />
        </div>
        <div className="w-12 h-12 bg-teal-800/40 rounded-2xl flex items-center justify-center mb-6">
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-3">{title}</h3>
          <p className="text-teal-100/90 leading-relaxed text-sm max-w-xl">
            {description}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "blue") {
    return (
      <div className={`bg-[#eff6ff] rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between min-h-[300px] border border-blue-100/50 ${className}`}>
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            {description}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "orange") {
    return (
      <div className={`bg-amber-500 text-white rounded-3xl p-8 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between min-h-[300px] ${className}`}>
        <div className="w-12 h-12 bg-amber-600/30 rounded-2xl flex items-center justify-center mb-6">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-amber-50 leading-relaxed text-sm">
            {description}
          </p>
        </div>
      </div>
    );
  }

  // White Card
  return (
    <div className={`md:col-span-2 bg-white rounded-3xl p-8 border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] flex flex-col sm:flex-row items-center justify-between overflow-hidden min-h-[300px] ${className}`}>
      <div className="sm:max-w-md pr-0 sm:pr-8 mb-6 sm:mb-0 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
