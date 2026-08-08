"use client";

import React from "react";
import Link from "next/link";
import { Building, ArrowLeft, Camera, CheckCircle2, Users, Check, Eye } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      icon: <Camera className="w-6 h-6 text-brand-teal" />,
      color: "border-emerald-400",
      bg: "bg-emerald-50",
      title: "Citizen Reports Issues",
      description: "Take a photo of any city infrastructure problem (e.g. waterlogging, open manholes, damaged roads, broken streetlights) and submit it through our easy-to-use form. Geolocation is detected automatically to pinpoint the issue."
    },
    {
      step: "02",
      icon: <CheckCircle2 className="w-6 h-6 text-brand-orange" />,
      color: "border-amber-400",
      bg: "bg-amber-50",
      title: "AI Analysis & Verification",
      description: "Our backend runs a hybrid validation using keyword rules and Gemini AI model categorization. The system identifies the category, sets the appropriate priority, and checks coordinates to ensure the report is valid and anti-spam checked."
    },
    {
      step: "03",
      icon: <Users className="w-6 h-6 text-brand-teal" />,
      color: "border-emerald-400",
      bg: "bg-emerald-50",
      title: "Departmental Dispatch",
      description: "Once verified, the report is instantly auto-routed to the administrator of the relevant municipal department (e.g. Waste Management, Road Repair, Waterlogging, Electricity). The administrator reviews it and assigns a specialized field worker."
    },
    {
      step: "04",
      icon: <Check className="w-6 h-6 text-amber-700" />,
      color: "border-amber-600",
      bg: "bg-amber-50",
      title: "Field Resolution & Verification",
      description: "The assigned worker receives the task on their mobile dashboard, travels to the site, and resolves the issue. To complete the task, they must upload a verification photo, which notifies the citizen in real-time."
    }
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
            <Eye className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest">Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">How It Works</h1>
        <p className="text-gray-500 text-sm font-medium mt-2 max-w-2xl">
          Learn how MuniFix transforms civic complaints into verified resolutions in four simple, automated steps.
        </p>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto w-full px-6 pb-12 space-y-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10 space-y-10">
          
          {/* Vertical Step list */}
          <div className="space-y-12 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col sm:flex-row gap-6 sm:gap-8 items-start z-10 pl-12 sm:pl-0">
                
                {/* Step indicator circle positioned at the vertical line */}
                <div className="absolute left-0 sm:static sm:mr-0 w-12 h-12 rounded-full border-2 border-white bg-white shadow-md flex items-center justify-center font-extrabold text-sm text-brand-teal shrink-0">
                  {step.step}
                </div>

                <div className="flex-1 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3 hover:bg-white hover:border-teal-100 hover:shadow-sm transition-all duration-300">
                  <div className={`w-10 h-10 ${step.bg} rounded-xl flex items-center justify-center`}>
                    {step.icon}
                  </div>
                  <h3 className="font-extrabold text-base text-gray-900">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <hr className="border-gray-100" />

          {/* Quick FAQ / Info box */}
          <div className="bg-teal-50/50 rounded-2xl border border-teal-100/30 p-6 space-y-3">
            <h4 className="text-sm font-black text-gray-900">Why Geolocation & Photo Upload is Required?</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              To prevent fraudulent submissions, MuniFix requires all new reports to include an image and GPS coordinates. This ensures that the field workers can find the exact problem location immediately without searching, and validates that the report represents a real-world infrastructure issue.
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
