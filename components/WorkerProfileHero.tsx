"use client";

import React from "react";
import { Camera, MapPin, Droplet, Printer, Edit } from "lucide-react";
import Button from "./Button";

interface WorkerProfileHeroProps {
  name: string;
  department: string;
  zone: string;
  avatar?: string;
  coverImage?: string;
  onEditProfile?: () => void;
  onPrintBadge?: () => void;
}

export default function WorkerProfileHero({
  name,
  department,
  zone,
  avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
  coverImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop",
  onEditProfile,
  onPrintBadge,
}: WorkerProfileHeroProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden w-full font-sans transition-all duration-350 hover:shadow-md">
      {/* Cover Image Banner */}
      <div className="h-44 md:h-52 w-full relative bg-gradient-to-r from-teal-800 to-[#005c55]">
        <img
          src={coverImage}
          alt="Worker Cover"
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          onError={(e) => {
            // Fallback banner if image fails
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Profile Details Block */}
      <div className="px-6 pb-6 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Avatar & Meta info */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-5 -mt-16 md:-mt-20">
          {/* Avatar with Camera Icon Overlay */}
          <div className="relative group select-none">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white bg-slate-100 shadow-md shrink-0 relative">
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=005c55`;
                }}
              />
            </div>
            <button 
              className="absolute bottom-2 right-2 bg-brand-teal text-white p-1.5 rounded-xl border border-white hover:scale-105 hover:bg-brand-teal-hover transition-all cursor-pointer shadow-sm"
              aria-label="Upload Photo"
            >
              <Camera className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>

          {/* Text Info */}
          <div className="text-center md:text-left space-y-2 select-none md:pb-1">
            <h2 className="text-2xl font-black text-slate-850 tracking-tight leading-none">
              {name}
            </h2>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1.5 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <Droplet className="w-4.5 h-4.5 text-brand-teal stroke-[2.2]" />
                {department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4.5 h-4.5 text-brand-teal stroke-[2.2]" />
                {zone}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Actions */}
        <div className="flex items-center justify-center md:justify-end gap-3 select-none md:pb-1">
          <Button
            variant="outline"
            onClick={onEditProfile}
            className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-extrabold border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-350"
          >
            <Edit className="w-4 h-4 text-slate-500" />
            <span>Edit Profile</span>
          </Button>

          <Button
            variant="primary"
            onClick={onPrintBadge}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold"
          >
            <Printer className="w-4 h-4 text-teal-100" />
            <span>Print Badge</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
