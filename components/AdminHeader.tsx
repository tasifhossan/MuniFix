"use client";

import React from "react";
import { Search, Bell, SlidersHorizontal } from "lucide-react";

interface AdminHeaderProps {
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  variant?: "default" | "overview" | "permissions" | "logs";
  title?: string;
  userRole?: string;
  userSubtitle?: string;
}

export default function AdminHeader({
  searchTerm = "",
  onSearchChange,
  variant = "default",
  title = "Complaint Overview",
  userRole = "Super Administrator",
  userSubtitle = "Super Administrator",
}: AdminHeaderProps) {
  if (variant === "logs") {
    return (
      <header className="h-16 bg-white border-b border-[#e2e8f0] px-8 flex items-center justify-between font-sans sticky top-0 z-10">
        {/* Title */}
        <div className="flex items-center gap-3 shrink-0">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight select-none">
            {title}
          </h1>
        </div>

        {/* Center Subnavigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-500">
          <a href="#how-it-works" className="hover:text-[#005c55] transition-colors">How it Works</a>
          <a href="#about" className="hover:text-[#005c55] transition-colors">About</a>
          <a href="#contact" className="hover:text-[#005c55] transition-colors">Contact</a>
        </div>

        {/* Utilities: Search button, Notifications, User profile */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Search Icon Button */}
          <button className="p-2 text-slate-500 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95">
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Bell */}
          <button className="relative p-2 text-slate-500 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-white" />
          </button>

          {/* Vertical divider */}
          <div className="h-8 w-[1px] bg-slate-200" />

          {/* Profile Card */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-sm font-extrabold text-slate-805 block leading-tight select-none">
                {userRole}
              </span>
              <span className="text-[10px] font-bold text-slate-400 block leading-tight select-none mt-0.5">
                {userSubtitle}
              </span>
            </div>
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (variant === "permissions") {
    return (
      <header className="h-16 bg-white border-b border-[#e2e8f0] px-8 flex items-center justify-between font-sans sticky top-0 z-10">
        {/* Title */}
        <div className="flex items-center gap-3 shrink-0">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight select-none">
            {title}
          </h1>
        </div>

        {/* Center Search Pill */}
        <div className="relative w-full max-w-md mx-auto px-4 hidden md:block">
          <Search className="absolute inset-y-0 left-4 pl-3.5 flex items-center text-slate-400 pointer-events-none w-4.5 h-4.5 my-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search administrator name..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50/55 hover:bg-slate-100/50 border border-slate-205 rounded-full focus:outline-none focus:border-[#005c55] focus:bg-white text-slate-800 placeholder-slate-400 transition-all shadow-inner"
          />
        </div>

        {/* Utilities: Notifications, User profile */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Notification Bell */}
          <button className="relative p-2 text-slate-500 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-white" />
          </button>

          {/* Vertical divider */}
          <div className="h-8 w-[1px] bg-slate-200" />

          {/* Profile Card */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-sm font-extrabold text-slate-805 block leading-tight select-none">
                {userRole}
              </span>
              <span className="text-[10px] font-bold text-slate-400 block leading-tight select-none mt-0.5">
                {userSubtitle}
              </span>
            </div>
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (variant === "overview") {
    return (
      <header className="h-16 bg-white border-b border-[#e2e8f0] px-8 flex items-center justify-between font-sans sticky top-0 z-10">
        {/* Title & Live Badge */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight select-none">
            {title}
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#0f766e] bg-[#e6f4f2] select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span>Live System Monitoring</span>
          </div>
        </div>

        {/* Utilities: Notifications, Search icon, User profile */}
        <div className="flex items-center gap-4">
          {/* Search Icon Button */}
          <button className="p-2 text-slate-500 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95">
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Bell */}
          <button className="relative p-2 text-slate-500 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-white" />
          </button>

          {/* Vertical divider */}
          <div className="h-8 w-[1px] bg-slate-200" />

          {/* Profile Card */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-sm font-extrabold text-slate-805 block leading-tight select-none">
                {userRole || "Admin User"}
              </span>
              <span className="text-[10px] font-bold text-slate-400 block leading-tight select-none mt-0.5">
                {userSubtitle || "Administrator"}
              </span>
            </div>
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-white border-b border-[#e2e8f0] px-8 flex items-center justify-between font-sans sticky top-0 z-10">
      {/* Search Pill - Left-aligned and matches the design */}
      <div className="relative w-full max-w-lg">
        <Search className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none w-5 h-5 my-auto" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Search complaints by ID, citizen, or keywords..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/55 hover:bg-slate-100/50 border border-slate-100 rounded-full focus:outline-none focus:border-[#005c55] focus:bg-white text-slate-800 placeholder-slate-400 transition-all shadow-sm"
        />
      </div>

      {/* Utilities: Notifications, Filter Icon, User profile */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-500 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f87171] rounded-full ring-2 ring-white" />
        </button>

        {/* Sliders/Filter Icon */}
        <button className="p-2 text-slate-555 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95">
          <SlidersHorizontal className="w-5 h-5" />
        </button>

        {/* Vertical divider */}
        <div className="h-8 w-[1px] bg-slate-200" />

        {/* Profile Card */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-extrabold text-slate-805 block leading-tight select-none">
              {userRole || "Admin User"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 block leading-tight select-none mt-0.5">
              {userSubtitle || "Chief Supervisor"}
            </span>
          </div>
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
              alt="Admin Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
