"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, Bug, LayoutGrid, FileText, HelpCircle, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import QuickLinkCard from "@/components/QuickLinkCard";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/20 font-sans">
      {/* Header / Navbar */}
      <Navbar activeNav="" />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto w-full text-center">
        {/* Graphic Backdrop Box */}
        <div className="relative w-full max-w-lg aspect-[1.8/1] bg-slate-100/70 border border-slate-200/50 rounded-[32px] flex items-center justify-center shadow-inner overflow-hidden mb-10">
          {/* Big Translucent 404 text */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none text-slate-200/70 font-extrabold text-[120px] sm:text-[160px] tracking-widest">
            404
          </div>

          {/* Central White Illustration Card */}
          <div className="relative bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-[210px] w-full z-10 transition-transform duration-500 hover:scale-105">
            <Image
              src="/404-illustration.png"
              alt="404 Page Not Found Illustration"
              width={170}
              height={170}
              priority
              className="w-full h-auto object-contain"
            />
            {/* Warning Badge Overlay */}
            <div className="absolute -bottom-2.5 -right-2.5 bg-brand-orange text-white p-2.5 rounded-2xl shadow-lg border-4 border-white transition-transform duration-300 hover:scale-110">
              <AlertTriangle className="w-5.5 h-5.5 fill-current" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-gray-500 font-medium max-w-lg text-sm sm:text-base leading-relaxed mb-8 px-4">
          The page you are looking for might have been moved or doesn't exist.
          Our municipal team is already investigating why this path is blocked.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full max-w-md">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" className="flex items-center gap-2 w-full sm:w-auto shadow-md">
              <Home className="w-4 h-4" />
              Return to Homepage
            </Button>
          </Link>
          <Link href="/report-bug" className="w-full sm:w-auto">
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto shadow-sm">
              <Bug className="w-4 h-4" />
              Report a Bug
            </Button>
          </Link>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl text-left">
          <QuickLinkCard
            href="/dashboard"
            title="Dashboard"
            description="View your active complaint status and updates."
            icon={<LayoutGrid className="w-5 h-5" />}
            iconBgColor="bg-teal-50 text-brand-teal"
          />
          <QuickLinkCard
            href="/report/new"
            title="New Report"
            description="Submit a new issue to Chattogram City Corp."
            icon={<FileText className="w-5 h-5" />}
            iconBgColor="bg-amber-50 text-brand-orange"
          />
          <QuickLinkCard
            href="/help"
            title="Help Center"
            description="Find answers to common civic questions."
            icon={<HelpCircle className="w-5 h-5" />}
            iconBgColor="bg-slate-100 text-slate-600"
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
