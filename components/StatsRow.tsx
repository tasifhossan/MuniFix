import React from "react";

export default function StatsRow() {
  return (
    <section className="bg-white border-t border-b border-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 text-center">
        <div className="md:border-r md:border-slate-100 px-4">
          <p className="text-4xl font-black text-slate-900 tracking-tight">5K+</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Issues Resolved</p>
        </div>
        <div className="md:border-r md:border-slate-100 px-4">
          <p className="text-4xl font-black text-slate-900 tracking-tight">24/7</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Active Monitoring</p>
        </div>
        <div className="md:border-r md:border-slate-100 px-4">
          <p className="text-4xl font-black text-slate-900 tracking-tight">41</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Wards Covered</p>
        </div>
        <div className="px-4">
          <p className="text-4xl font-black text-slate-900 tracking-tight">15m</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Avg Response</p>
        </div>
      </div>
    </section>
  );
}
