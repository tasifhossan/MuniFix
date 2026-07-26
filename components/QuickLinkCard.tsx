"use client";

import React from "react";
import Link from "next/link";

interface QuickLinkCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string; // Tailwind classes for background and icon color (e.g. "bg-teal-50 text-teal-600")
}

export default function QuickLinkCard({
  href,
  title,
  description,
  icon,
  iconBgColor,
}: QuickLinkCardProps) {
  return (
    <Link
      href={href}
      className="group block p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-0.5"
    >
      <div
        className={`w-10 h-10 ${iconBgColor} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
      >
        {icon}
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1.5 transition-colors group-hover:text-brand-teal">
        {title}
      </h3>
      <p className="text-gray-500 text-xs leading-relaxed font-medium">
        {description}
      </p>
    </Link>
  );
}
