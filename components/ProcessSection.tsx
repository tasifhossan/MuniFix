import React from "react";
import { Camera, CheckCircle2, Users, Check } from "lucide-react";

export default function ProcessSection() {
  return (
    <section id="how-it-works" className="bg-slate-100/60 border-t border-b border-slate-200/50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Four Steps to a Better City</h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-semibold">
            Our streamlined process makes civic engagement easier than ever.
          </p>
        </div>

        {/* Steps Timeline Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {/* Connecting line for desktop/tablet */}
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-slate-200 z-0" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4 z-10">
            <div className="w-20 h-20 bg-white border-[3px] border-emerald-400 text-brand-teal rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Step 1: Report</h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-[220px] font-semibold">
                Take a photo and describe the infrastructure issue via our app or web portal.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4 z-10">
            <div className="w-20 h-20 bg-white border-[3px] border-amber-400 text-brand-orange rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Step 2: Verification</h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-[220px] font-semibold">
                Our team and AI verify the report's location and urgency within minutes.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4 z-10">
            <div className="w-20 h-20 bg-white border-[3px] border-emerald-400 text-brand-teal rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Step 3: Action</h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-[220px] font-semibold">
                The relevant city corporation department is dispatched to fix the issue.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center space-y-4 z-10">
            <div className="w-20 h-20 bg-white border-[3px] border-amber-600 text-amber-700 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Step 4: Resolution</h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-[220px] font-semibold">
                You receive a confirmation photo of the resolved issue and close the ticket.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
