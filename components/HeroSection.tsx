"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import Button from "@/components/Button";

interface HeroSectionProps {
  onHowItWorksClick: () => void;
}

export default function HeroSection({ onHowItWorksClick }: HeroSectionProps) {
  return (
    <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
      {/* Left Column */}
      <div className="flex-1 space-y-6 text-center md:text-left animate-fade-in">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-brand-teal uppercase tracking-wider">
          Empowering Citizens
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight max-w-xl">
          Better Infrastructure <br /> for a <span className="text-brand-teal">Better <br /> Chattogram</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto md:mx-0 font-medium">
          Report waterlogging, broken roads, and waste issues directly to city officials. Together, we can build a cleaner and safer city.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
          <Link href="/register">
            <Button variant="primary" className="w-full sm:w-auto py-3.5 flex items-center justify-center gap-2">
              Report an Issue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full sm:w-auto py-3.5 bg-white"
            onClick={onHowItWorksClick}
          >
            How it Works
          </Button>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-[450px] lg:w-[550px] shrink-0 relative aspect-[4/3] animate-fade-in animate-delay-100">
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
          <Image
            src="/hero-city.png"
            alt="MuniFix City Illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Overlay Stat Card */}
        <div className="absolute -left-4 -bottom-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 fill-current text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">5,000+ Resolved</p>
            <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Active infrastructure repair</p>
          </div>
        </div>
      </div>
    </section>
  );
}
