"use client";

import React, { useRef, useEffect } from "react";
import { ClipboardCheck, Pin, BarChart3, BellRing } from "lucide-react";

export interface NotificationItem {
  id: string | number;
  text: string;
  type: "complaint" | "task" | "report" | "general";
  time: string;
  read: boolean;
}

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onViewAll: () => void;
  onClose: () => void;
}

export default function NotificationDropdown({
  notifications,
  onMarkAllRead,
  onViewAll,
  onClose,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "complaint":
        return (
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case "task":
        return (
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Pin className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case "report":
        return (
          <div className="w-10 h-10 bg-indigo-50 text-indigo-650 rounded-xl flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center shrink-0">
            <BellRing className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-3 w-80 sm:w-[340px] bg-white border border-slate-200/60 rounded-3xl shadow-xl z-50 p-4 transition-all animate-scale-up font-sans"
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100 select-none">
        <h3 className="text-sm font-bold text-slate-800">
          Notifications
        </h3>
        <button
          onClick={onMarkAllRead}
          className="text-xs font-bold text-brand-teal hover:text-brand-teal-hover cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      {/* Items List */}
      <div className="max-h-[300px] overflow-y-auto space-y-4 py-4 pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-slate-450 font-bold text-xs">
            No new notifications
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`flex items-start gap-3.5 p-2 rounded-2xl transition-colors duration-200 hover:bg-slate-50/50 ${
                !notif.read ? "bg-slate-50/20" : ""
              }`}
            >
              {/* Colored icon box */}
              {getNotificationIcon(notif.type)}

              {/* Text detail */}
              <div className="flex-1 space-y-1">
                <p className={`text-xs text-slate-700 leading-normal ${!notif.read ? "font-bold" : "font-medium"}`}>
                  {notif.text}
                </p>
                <span className="text-[10px] font-bold text-slate-400 block">
                  {notif.time}
                </span>
              </div>

              {/* Unread indicator dot */}
              {!notif.read && (
                <span className="w-2 h-2 bg-[#005c55] rounded-full mt-2 shrink-0 animate-pulse" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 pt-1 text-center select-none">
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-brand-teal hover:underline py-2.5 block w-full cursor-pointer"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}
