"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";

interface NotificationSettingsCardProps {
  initialComplaintUpdates?: boolean;
  initialNewsAlerts?: boolean;
  onToggle?: (setting: string, enabled: boolean) => void;
}

export default function NotificationSettingsCard({
  initialComplaintUpdates = true,
  initialNewsAlerts = false,
  onToggle,
}: NotificationSettingsCardProps) {
  const [complaintUpdates, setComplaintUpdates] = useState(initialComplaintUpdates);
  const [newsAlerts, setNewsAlerts] = useState(initialNewsAlerts);

  const handleToggle = (setting: "complaintUpdates" | "newsAlerts", currentVal: boolean) => {
    const newVal = !currentVal;
    if (setting === "complaintUpdates") {
      setComplaintUpdates(newVal);
    } else {
      setNewsAlerts(newVal);
    }
    
    if (onToggle) {
      onToggle(setting, newVal);
    }
  };

  const renderToggle = (settingName: "complaintUpdates" | "newsAlerts", value: boolean) => {
    return (
      <button
        type="button"
        onClick={() => handleToggle(settingName, value)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
          value ? "bg-blue-600 focus:ring-2 focus:ring-blue-600/20" : "bg-slate-200 focus:ring-2 focus:ring-slate-200/20"
        }`}
        aria-label="Toggle setting"
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full transition-all duration-350 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-slate-50 select-none">
        <div className="w-9 h-9 bg-teal-50 text-brand-teal rounded-xl flex items-center justify-center">
          <Bell className="w-5 h-5 stroke-[2.2]" />
        </div>
        <h3 className="text-sm font-bold text-slate-850 tracking-tight">
          Notification Settings
        </h3>
      </div>

      {/* Settings List */}
      <div className="space-y-6">
        {/* Complaint Updates Option */}
        <div className="flex items-center justify-between gap-6 pb-2">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 leading-none">
              Complaint Status Updates
            </h4>
            <p className="text-[11px] font-medium text-slate-500 leading-normal">
              Get notified when a technician is assigned to your case
            </p>
          </div>
          {renderToggle("complaintUpdates", complaintUpdates)}
        </div>

        {/* Municipal News & Alerts Option */}
        <div className="flex items-center justify-between gap-6 pt-2 border-t border-slate-50">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 leading-none">
              Municipal News & Alerts
            </h4>
            <p className="text-[11px] font-medium text-slate-500 leading-normal">
              Stay updated on city events and maintenance schedules
            </p>
          </div>
          {renderToggle("newsAlerts", newsAlerts)}
        </div>
      </div>
    </div>
  );
}
