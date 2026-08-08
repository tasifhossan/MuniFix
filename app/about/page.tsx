"use client";

import React from "react";
import Link from "next/link";
import { Building, ArrowLeft, Target, Users, Cpu, ShieldCheck, Landmark, Check } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Our Mission",
      description: "To bridge the gap between citizens and municipal authorities in Chattogram, enabling rapid infrastructure resolution, accountability, and transparency through modern technology."
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "AI-Powered Efficiency",
      description: "Utilizing state-of-the-art AI categorization and auto-routing to process and direct citizen complaints to the relevant municipal department within minutes, eliminating manual delays."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Community Trust",
      description: "Fostering collaboration between residents, department administrators, and field workers to build a cleaner, safer, and more resilient city together."
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Verified Action",
      description: "Ensuring high-fidelity reports through photo verification and geolocation checking, guaranteeing that municipal resources are dispatched where they are needed most."
    }
  ];

  const features = [
    { title: "Fast-track routing to municipal offices", desc: "No red tape. Reports are directly mapped to the target department." },
    { title: "Real-time updates and notification system", desc: "Track your report's life cycle from submission to resolution." },
    { title: "Field worker collaboration and assignment dashboard", desc: "Department admins assign workers who submit resolution photos." },
    { title: "Publicly auditable, transparent track record", desc: "Builds accountability and public confidence." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans bg-gradient-to-br from-slate-50 via-teal-50/10 to-slate-100">
      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center space-x-2 text-brand-teal font-extrabold text-xl hover:opacity-90 transition-opacity">
          <Building className="w-5 h-5" />
          <span>MuniFix Ctg</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-brand-teal transition-colors gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
      </header>

      {/* Hero */}
      <div className="max-w-4xl mx-auto w-full px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-brand-teal">
            <Landmark className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest">About Us</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Empowering Chattogram</h1>
        <p className="text-gray-500 text-sm font-medium mt-2 max-w-2xl">
          MuniFix Ctg is a civic tech platform designed to modernize public utility and infrastructure reporting for Chattogram City Corporation.
        </p>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto w-full px-6 pb-12 space-y-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10 space-y-10">
          
          {/* Core Values / Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((val, idx) => (
              <div key={idx} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-teal-100 hover:bg-white transition-all duration-300 space-y-3">
                <div className="w-9 h-9 bg-teal-50 text-brand-teal rounded-xl flex items-center justify-center">
                  {val.icon}
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">{val.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">{val.description}</p>
              </div>
            ))}
          </div>

          <hr className="border-gray-100" />

          {/* Core Features list */}
          <div className="space-y-6">
            <h2 className="text-lg font-black text-gray-900">Key Platform Offerings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feat, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-gray-900">{feat.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Platform Tech Stack info */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-900">Technology & Architecture</h2>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              MuniFix is engineered as a robust, distributed client-server application. The frontend is built on **Next.js** for high performance and responsiveness, styled with vanilla Tailwind CSS. The backend runs on a secure **Node.js/Express** REST API integrated with a **PostgreSQL** database hosted on Neon, using a hybrid AI routing engine built with the **Gemini 2.5 Flash** model for instantaneous categorization.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center space-y-2 py-6 px-6">
        <p className="text-xs text-gray-400 font-medium">© {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</p>
        <div className="flex items-center justify-center space-x-6 text-[11px] text-gray-500 font-bold">
          <Link href="/privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</Link>
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <Link href="/terms" className="hover:text-brand-teal transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
