"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, Menu, X, ChevronDown, Globe, Mail, Phone, Loader2 } from "lucide-react";
import NotificationDropdown, { NotificationItem } from "./NotificationDropdown";
import { getActiveProfile, setActiveProfile, profiles, ActiveProfile, fetchNotifications, markNotificationAsRead } from "@/lib/api";

interface NavbarProps {
  activeNav?: string;
  onNavClick?: (section: string) => void;
  isDashboard?: boolean;
  user?: {
    name: string;
    avatar: string;
  };
}

export default function Navbar({ 
  activeNav = "how-it-works", 
  onNavClick,
  user,
  isDashboard = false,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeProfile, setActiveProfileState] = useState<ActiveProfile>(getActiveProfile());

  const handleProfileChange = (profile: ActiveProfile) => {
    setActiveProfile(profile);
    setActiveProfileState(profile);
    setProfileDropdownOpen(false);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  // Live notifications from MuniFix backend
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

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
      const data = await fetchNotifications();
      if (data.success) {
        const mapped = data.notifications.map((n: any) => ({
          id: n.id,
          text: n.message,
          type: n.complaint_id ? "complaint" : "general",
          time: formatTime(n.created_at),
          read: n.is_read
        }));
        setNotifications(mapped);
        setUnreadCount(mapped.filter((n: any) => !n.read).length);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("munifix_authtoken")) : null;
    if (token) {
      loadNotifications();
    }
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
      await Promise.all(unreadIds.map(id => markNotificationAsRead(String(id))));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleNotificationItemClick = async (id: string | number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await markNotificationAsRead(String(id));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleViewAll = () => {
    alert("Navigating to all notifications...");
    setNotificationsOpen(false);
  };

  const handleNavClick = (section: string) => {
    if (onNavClick) {
      onNavClick(section);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-extrabold tracking-tight text-[#005c55] transition-colors duration-200">
            MuniFix Ctg
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          {(user || isDashboard) && (
            <Link
              href="/complaints/new"
              className={`transition-all duration-200 py-2 relative ${
                activeNav === "new-report"
                  ? "text-[#005c55] font-extrabold"
                  : "text-gray-500 hover:text-[#005c55]"
              }`}
            >
              New Report
              {activeNav === "new-report" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#005c55] rounded-full" />
              )}
            </Link>
          )}
          {(user || isDashboard
            ? [
                { id: "how-it-works", label: "How it Works", href: "/#how-it-works" },
                { id: "about", label: "About", href: "/#about" },
              ]
            : [
                { id: "how-it-works", label: "How it Works", href: "#how-it-works" },
                { id: "about", label: "About", href: "#about" },
                { id: "contact", label: "Contact", href: "#contact" },
              ]
          ).map((item) => {
            const isActive = activeNav === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  if (!(user || isDashboard) && onNavClick) {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }
                }}
                className={`transition-all duration-200 py-2 relative ${
                  isActive
                    ? "text-[#005c55] font-semibold"
                    : "text-gray-500 hover:text-[#005c55]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-[#005c55] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="hidden md:flex items-center space-x-5">
          {/* Search Toggle */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-gray-50 border border-slate-200 rounded-full px-3 py-1.5 transition-all duration-300 w-64">
                <input
                  type="text"
                  placeholder="Search reports or wards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-sm outline-none w-full text-gray-700 placeholder-gray-405"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600 ml-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-slate-600 hover:text-[#005c55] p-2 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Notification Toggle */}
          <div className="relative flex items-center">
            <button
              onClick={handleBellClick}
              className="text-slate-600 hover:text-[#005c55] p-2 rounded-full hover:bg-slate-50 transition-colors relative cursor-pointer flex items-center justify-center min-w-9 min-h-9"
              aria-label="Notifications"
            >
              {notificationsLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#005c55]" />
              ) : (
                <>
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                      {unreadCount}
                    </span>
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

          {/* Active Testing Profile Switcher */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 border border-teal-100 hover:border-brand-teal bg-teal-50/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-gray-700 select-none cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
              <span>{activeProfile.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 stroke-[2.5px]" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 p-2 animate-fade-in animate-duration-150">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3.5 py-1.5 border-b border-gray-100 mb-1">
                  Select User Context
                </div>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleProfileChange(p)}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-colors flex items-center justify-between ${
                      activeProfile.id === p.id ? "bg-teal-50/70 text-brand-teal font-bold" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{p.name}</span>
                    {activeProfile.id === p.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth profile avatar (if logged in) or buttons */}
          {user ? (
            <>
              <div className="w-[1px] h-6 bg-slate-200" />
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shadow-sm shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-bold text-slate-800 hover:text-[#005c55] transition-colors">
                  {user.name}
                </span>
              </div>
            </>
          ) : isDashboard ? (
            <Link href="/settings" className="relative block shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                className="w-8 h-8 rounded-full border border-slate-200 hover:border-[#005c55] transition-all duration-200"
                alt="User Profile"
              />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-700 hover:text-[#005c55] transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-[#005c55] text-white text-sm font-semibold px-6 py-2 rounded-full hover:bg-brand-teal-hover transition-all duration-300 shadow-md shadow-[#005c55]/10 select-none"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="text-gray-650 hover:text-[#005c55] p-1.5 rounded-full hover:bg-slate-50 transition-colors relative"
          >
            <Bell className="w-5.5 h-5.5" />
            <span className="absolute top-1 right-1 bg-orange-500 w-2 h-2 rounded-full" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-650 hover:text-[#005c55] p-2 rounded-lg hover:bg-slate-50 focus:outline-none transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Notification Popdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-2 pb-6 space-y-3 shadow-inner select-none">
          {user ? (
            <div className="flex items-center gap-3 py-2 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold text-slate-800">{user.name}</span>
            </div>
          ) : isDashboard ? (
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
            >
              My Profile
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-[#005c55] text-white font-medium rounded-xl hover:bg-brand-teal-hover"
              >
                Register
              </Link>
            </>
          )}
          <div className={`${!(user || isDashboard) ? "border-t border-slate-100 my-2 pt-2" : ""}`}>
            {(user || isDashboard) && (
              <Link
                href="/complaints/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-650 hover:text-[#005c55] font-medium text-sm"
              >
                New Report
              </Link>
            )}
            {(user || isDashboard
              ? [
                  { id: "how-it-works", label: "How it Works", href: "/#how-it-works" },
                  { id: "about", label: "About", href: "/#about" },
                ]
              : [
                  { id: "how-it-works", label: "How it Works", href: "#how-it-works" },
                  { id: "about", label: "About", href: "#about" },
                  { id: "contact", label: "Contact", href: "#contact" },
                ]
            ).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (!(user || isDashboard) && onNavClick) {
                    onNavClick(item.id);
                  }
                }}
                className="block py-2.5 text-slate-650 hover:text-[#005c55] font-medium text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
