"use client";

import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  sidebarTitle: string;
  sidebarSubtitle: string;
  sidebarBadge: string;
  sidebarExtra?: React.ReactNode;
  children: React.ReactNode;
}

export default function AuthLayout({
  sidebarTitle,
  sidebarSubtitle,
  sidebarBadge,
  sidebarExtra,
  children
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch font-sans">
      {/* Left Column: Visual branding sidebar */}
      <div className="hidden lg:flex w-[40%] bg-gradient-to-br from-brand-teal to-teal-950 text-white flex-col justify-between p-12 relative overflow-hidden shrink-0">
        {/* Dynamic decorative backdrop line mesh */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        {/* Top Header */}
        <div className="relative z-10">
          <Link href="/" className="text-2xl font-black tracking-tight text-white flex items-center space-x-2">
            <span>MuniFix Ctg</span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8 my-auto animate-fade-in">
          <div className="space-y-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-teal-800/50 text-teal-300 uppercase tracking-widest">
              {sidebarBadge}
            </span>
            <h2 className="text-4xl font-extrabold leading-tight">
              {sidebarTitle}
            </h2>
            <p className="text-teal-100/80 text-sm leading-relaxed max-w-sm">
              {sidebarSubtitle}
            </p>
          </div>

          {sidebarExtra}
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-teal-200/50">
          <span>&copy; {new Date().getFullYear()} MuniFix Ctg. Public Utility Platform.</span>
        </div>
      </div>

      {/* Right Column: Interactive Content Form */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-50">
        {children}
      </div>
    </div>
  );
}
