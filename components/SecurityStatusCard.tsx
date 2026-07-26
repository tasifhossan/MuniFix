"use client";

import React from "react";
import { ShieldAlert, ShieldCheck, Clock } from "lucide-react";

interface SecurityStatusCardProps {
  twoFactorEnabled: boolean;
  lastLogin: string;
}

export default function SecurityStatusCard({
  twoFactorEnabled,
  lastLogin,
}: SecurityStatusCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full text-left transition-all duration-350 hover:shadow-md">
      <h3 className="text-sm font-bold text-slate-850 tracking-tight mb-4 select-none">
        Security Status
      </h3>
      
      <div className="space-y-4">
        {/* Two-Factor Auth Row */}
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${twoFactorEnabled ? "bg-emerald-50 text-emerald-600" : "bg-red-55/40 text-red-500"}`}>
              {twoFactorEnabled ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <ShieldAlert className="w-4 h-4" />
              )}
            </div>
            <span className="text-xs font-semibold text-slate-650">
              Two-Factor Auth
            </span>
          </div>
          <span className={`text-xs font-bold ${twoFactorEnabled ? "text-emerald-605 bg-emerald-50/50 px-2 py-0.5 rounded-md" : "text-red-500"}`}>
            {twoFactorEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        {/* Last Login Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-50 text-slate-500 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-650">
              Last Login
            </span>
          </div>
          <span className="text-xs font-bold text-slate-700">
            {lastLogin}
          </span>
        </div>
      </div>
    </div>
  );
}
