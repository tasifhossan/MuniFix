"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationDropdown, { NotificationItem } from "./NotificationDropdown";
import { fetchNotifications, markNotificationAsRead, fetchMyProfile } from "@/lib/api";

interface WorkerHeaderProps {
  zoneName?: string;
  technicianName?: string;
  technicianId?: string;
  technicianAvatar?: string;
}

export default function WorkerHeader({
  zoneName = "Online: Chattogram Zone 04",
  technicianName,
  technicianId,
  technicianAvatar,
}: WorkerHeaderProps) {
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
    technicianAvatar ||
    profile?.avatar_url ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop";
  const displayName = technicianName || profile?.name || authUser?.name || "Abul Hossain";
  const displayId =
    technicianId ||
    (profile?.id
      ? `Worker ID: #${profile.id.slice(-4).toUpperCase()}`
      : "Technician ID #2044");

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between py-6 gap-4 border-b border-slate-200/60 font-sans relative">
      {/* Title & Online Zone Status */}
      <div className="flex flex-wrap items-center gap-3.5">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">
          Field Worker Dashboard
        </h1>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100/50 shadow-inner">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {zoneName}
        </span>
      </div>

      {/* Utilities & Profile */}
      <div className="flex items-center justify-between sm:justify-end gap-6">
        <div className="flex items-center gap-4">
          {/* Search Toggle */}
          <button className="p-2 text-slate-400 hover:text-brand-teal hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Alerts */}
          <div className="relative">
            <button
              onClick={handleBellClick}
              className="p-2 text-slate-400 hover:text-brand-teal hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px]"
            >
              {notificationsLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-brand-teal" />
              ) : (
                <>
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
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
        </div>

        {/* Profile Details */}
        <div className="flex items-center gap-4.5 pl-2 border-l border-slate-200">
          <div className="text-right">
            <span className="text-sm font-bold text-gray-800 tracking-tight block leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] font-black text-gray-400 block -mt-0.5 tracking-wider">
              {displayId}
            </span>
          </div>

          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm hover:scale-105 transition-transform duration-300">
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
