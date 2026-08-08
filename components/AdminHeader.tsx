"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, SlidersHorizontal, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationDropdown, { NotificationItem } from "./NotificationDropdown";
import { fetchNotifications, markNotificationAsRead, fetchMyProfile } from "@/lib/api";

interface AdminHeaderProps {
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  variant?: "default" | "overview" | "permissions" | "logs";
  title?: string;
  userRole?: string;
  userSubtitle?: string;
}

export default function AdminHeader({
  searchTerm = "",
  onSearchChange,
  variant = "default",
  title = "Complaint Overview",
  userRole = "",
  userSubtitle = "",
}: AdminHeaderProps) {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  // Notification states
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Load profile details dynamically if not provided as props
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("munifix_authtoken") : null;
    if (token) {
      fetchMyProfile()
        .then((res: any) => {
          if (res.success && res.profile) {
            setProfile(res.profile);
          } else if (res.profile) {
            setProfile(res.profile);
          } else {
            setProfile(res);
          }
        })
        .catch(console.error);
    }
  }, []);

  const formatTime = (dateStr: string) => {
    try {
      const now = new Date();
      const date = new Date(dateStr);
      const diffMs = now.getTime() - date.getTime();
      if (isNaN(diffMs) || diffMs < 0) return "Just now";
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch (e) {
      return "Some time ago";
    }
  };

  const loadNotifications = async () => {
    try {
      setNotificationsLoading(true);
      
      // Load local notifications from local storage
      let localMapped: NotificationItem[] = [];
      try {
        const stored = localStorage.getItem("munifix_local_notifications");
        if (stored) {
          const parsed = JSON.parse(stored);
          localMapped = parsed.map((n: any) => ({
            id: n.id,
            text: n.message,
            type: n.complaint_id ? "complaint" : "general",
            time: formatTime(n.created_at),
            read: n.is_read,
            created_at: n.created_at,
          }));
        }
      } catch (err) {
        console.error("Failed to parse local notifications:", err);
      }

      const data = await fetchNotifications();
      let merged = [...localMapped];

      if (data.success && Array.isArray(data.notifications)) {
        const remoteMapped = data.notifications.map((n: any) => ({
          id: n.id,
          text: n.message,
          type: n.complaint_id ? "complaint" : "general",
          time: formatTime(n.created_at),
          read: n.is_read,
          created_at: n.created_at,
        }));
        merged = [...merged, ...remoteMapped];
      }

      // Sort by created_at descending (latest first)
      merged.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications(merged);
      setUnreadCount(merged.filter((n: any) => !n.read).length);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("munifix_authtoken") : null;
    if (token) {
      loadNotifications();
    }
  }, []);

  // Listen for live WebSocket notifications dispatched from SocketContext
  useEffect(() => {
    const handleNewNotification = () => {
      loadNotifications();
    };

    window.addEventListener("munifix_new_notification", handleNewNotification);
    return () => {
      window.removeEventListener("munifix_new_notification", handleNewNotification);
    };
  }, []);

  const handleBellClick = () => {
    const nextState = !notificationsOpen;
    setNotificationsOpen(nextState);
    if (nextState) {
      loadNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      const stored = localStorage.getItem("munifix_local_notifications");
      if (stored) {
        const list = JSON.parse(stored);
        const updatedList = list.map((n: any) => ({ ...n, is_read: true }));
        localStorage.setItem("munifix_local_notifications", JSON.stringify(updatedList));
      }
    } catch (err) {
      console.error("Failed to mark local notifications as read:", err);
    }

    try {
      const remoteUnreadIds = unreadIds.filter(id => !String(id).startsWith("local_"));
      await Promise.all(remoteUnreadIds.map(id => markNotificationAsRead(String(id))));
    } catch (err) {
      console.error("Failed to mark remote notifications as read:", err);
    }
  };

  const handleNotificationItemClick = async (id: string | number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    const idStr = String(id);
    if (idStr.startsWith("local_")) {
      try {
        const stored = localStorage.getItem("munifix_local_notifications");
        if (stored) {
          const list = JSON.parse(stored);
          const updatedList = list.map((n: any) => n.id === idStr ? { ...n, is_read: true } : n);
          localStorage.setItem("munifix_local_notifications", JSON.stringify(updatedList));
        }
      } catch (err) {
        console.error("Failed to mark single local notification as read:", err);
      }
    } else {
      try {
        await markNotificationAsRead(idStr);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
  };

  const handleViewAll = () => {
    setNotificationsOpen(false);
  };

  const displayAvatar =
    profile?.avatar_url ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop";
  const displayRole = userRole || profile?.name || authUser?.name || "Admin User";
  
  // Format role string nicely
  let formattedSubtitle = userSubtitle || "";
  if (!formattedSubtitle) {
    const rawRole = profile?.role || authUser?.role || "super_admin";
    if (rawRole === "super_admin") formattedSubtitle = "Super Administrator";
    else if (rawRole === "dept_admin") formattedSubtitle = "Department Admin";
    else formattedSubtitle = "Administrator";
  }

  const renderNotificationBell = () => (
    <div className="relative">
      <button
        onClick={handleBellClick}
        className="p-2 text-slate-500 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95 flex items-center justify-center min-w-[36px] min-h-[36px]"
      >
        {notificationsLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-[#005c55]" />
        ) : (
          <>
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </>
        )}
      </button>

      {notificationsOpen && (
        <NotificationDropdown
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onViewAll={handleViewAll}
          onItemClick={handleNotificationItemClick}
          onClose={() => setNotificationsOpen(false)}
        />
      )}
    </div>
  );

  const renderProfileCard = () => (
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <span className="text-sm font-extrabold text-slate-805 block leading-tight select-none">
          {displayRole}
        </span>
        <span className="text-[10px] font-bold text-slate-400 block leading-tight select-none mt-0.5">
          {formattedSubtitle}
        </span>
      </div>
      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm hover:scale-105 transition-transform duration-300">
        <img
          src={displayAvatar}
          alt="Admin Profile"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );

  if (variant === "logs") {
    return (
      <header className="h-16 bg-white border-b border-[#e2e8f0] px-8 flex items-center justify-between font-sans sticky top-0 z-10">
        {/* Title */}
        <div className="flex items-center gap-3 shrink-0">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight select-none">
            {title}
          </h1>
        </div>

        {/* Center Subnavigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-500">
          <Link href="/how-it-works" className="hover:text-[#005c55] transition-colors">How it Works</Link>
          <Link href="/about" className="hover:text-[#005c55] transition-colors">About</Link>
          <a href="#contact" className="hover:text-[#005c55] transition-colors">Contact</a>
        </div>

        {/* Utilities: Search button, Notifications, User profile */}
        <div className="flex items-center gap-4 shrink-0 relative">
          {/* Search Icon Button */}
          <button className="p-2 text-slate-500 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95">
            <Search className="w-5 h-5" />
          </button>

          {renderNotificationBell()}

          {/* Vertical divider */}
          <div className="h-8 w-[1px] bg-slate-200" />

          {renderProfileCard()}
        </div>
      </header>
    );
  }

  if (variant === "permissions") {
    return (
      <header className="h-16 bg-white border-b border-[#e2e8f0] px-8 flex items-center justify-between font-sans sticky top-0 z-10">
        {/* Title */}
        <div className="flex items-center gap-3 shrink-0">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight select-none">
            {title}
          </h1>
        </div>

        {/* Center Search Pill */}
        <div className="relative w-full max-w-md mx-auto px-4 hidden md:block">
          <Search className="absolute inset-y-0 left-4 pl-3.5 flex items-center text-slate-400 pointer-events-none w-4.5 h-4.5 my-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search administrator name..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50/55 hover:bg-slate-100/50 border border-slate-205 rounded-full focus:outline-none focus:border-[#005c55] focus:bg-white text-slate-800 placeholder-slate-400 transition-all shadow-inner"
          />
        </div>

        {/* Utilities: Notifications, User profile */}
        <div className="flex items-center gap-4 shrink-0 relative">
          {renderNotificationBell()}

          {/* Vertical divider */}
          <div className="h-8 w-[1px] bg-slate-200" />

          {renderProfileCard()}
        </div>
      </header>
    );
  }

  if (variant === "overview") {
    return (
      <header className="h-16 bg-white border-b border-[#e2e8f0] px-8 flex items-center justify-between font-sans sticky top-0 z-10">
        {/* Title & Live Badge */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight select-none">
            {title}
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#0f766e] bg-[#e6f4f2] select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span>Live System Monitoring</span>
          </div>
        </div>

        {/* Utilities: Notifications, Search icon, User profile */}
        <div className="flex items-center gap-4 relative">
          {/* Search Icon Button */}
          <button className="p-2 text-slate-500 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95">
            <Search className="w-5 h-5" />
          </button>

          {renderNotificationBell()}

          {/* Vertical divider */}
          <div className="h-8 w-[1px] bg-slate-200" />

          {renderProfileCard()}
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-white border-b border-[#e2e8f0] px-8 flex items-center justify-between font-sans sticky top-0 z-10">
      {/* Search Pill - Left-aligned and matches the design */}
      <div className="relative w-full max-w-lg">
        <Search className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none w-5 h-5 my-auto" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Search complaints by ID, citizen, or keywords..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/55 hover:bg-slate-100/50 border border-slate-100 rounded-full focus:outline-none focus:border-[#005c55] focus:bg-white text-slate-800 placeholder-slate-400 transition-all shadow-sm"
        />
      </div>

      {/* Utilities: Notifications, Filter Icon, User profile */}
      <div className="flex items-center gap-6 relative">
        {renderNotificationBell()}

        {/* Sliders/Filter Icon */}
        <button className="p-2 text-slate-555 hover:text-[#005c55] hover:bg-slate-50 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95">
          <SlidersHorizontal className="w-5 h-5" />
        </button>

        {/* Vertical divider */}
        <div className="h-8 w-[1px] bg-slate-200" />

        {renderProfileCard()}
      </div>
    </header>
  );
}
