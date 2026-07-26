"use client";

import React from "react";

interface WorkerCredentialsCardProps {
  employeeId: string;
  employmentStatus: string;
  joiningDate: string;
  certifications: string[];
}

export default function WorkerCredentialsCard({
  employeeId,
  employmentStatus,
  joiningDate,
  certifications,
}: WorkerCredentialsCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 w-full font-sans transition-all duration-350 hover:shadow-md">
      <h3 className="text-sm font-bold text-slate-850 tracking-tight pb-4 mb-5 border-b border-slate-50 select-none">
        Worker Credentials
      </h3>

      <div className="space-y-4 select-none">
        {/* Employee ID */}
        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">
            Employee ID
          </span>
          <span className="text-xs font-bold text-slate-700 block">
            {employeeId}
          </span>
        </div>

        {/* Employment Status */}
        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">
            Employment Status
          </span>
          <div className="flex items-center space-x-1.5 pt-0.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-700">
              {employmentStatus}
            </span>
          </div>
        </div>

        {/* Joining Date */}
        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">
            Joining Date
          </span>
          <span className="text-xs font-bold text-slate-700 block">
            {joiningDate}
          </span>
        </div>

        {/* Certifications */}
        <div className="space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">
            Certifications
          </span>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {certifications.map((cert) => (
              <span
                key={cert}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-extrabold tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-100/30"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
