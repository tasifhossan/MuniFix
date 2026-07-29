"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, Menu, X, ChevronDown, Globe, Mail, Phone } from "lucide-react";
import NotificationDropdown, { NotificationItem } from "./NotificationDropdown";
import { useAuth } from "@/contexts/AuthContext";

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
  user: userProp,
  isDashboard = false,
}: NavbarProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Mock live notifications for MuniFix Ctg matching the screenshot
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 1, text: "Your complaint #CTG-8821 has been assigned", type: "complaint", time: "2m ago", read: false },
    { id: 2, text: "New task assigned in Agrabad", type: "task", time: "15m ago", read: false },
    { id: 3, text: "Monthly report is ready for Chattogram Municipal", type: "report", time: "1h ago", read: true },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
          ).map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => handleNavClick(item.id)}
              className={`transition-all duration-200 py-2 relative ${
                activeNav === item.id ? "text-[#005c55] font-extrabold" : "text-gray-500 hover:text-[#005c55]"
              }`}
            >
              {item.label}
              {activeNav === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#005c55] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Nav Options */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="text-slate-600 hover:text-[#005c55] p-2 rounded-full hover:bg-slate-50 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {!user && (
                <span className="absolute top-1.5 right-1.5 bg-orange-500 w-2 h-2 rounded-full ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <NotificationDropdown
                notifications={notifications}
                onMarkAllRead={handleMarkAllRead}
                onViewAll={handleViewAll}
                onClose={() => setNotificationsOpen(false)}
              />
            )}
          </div>

          {/* Real User Profile / Dropdown */}
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 border border-teal-100 hover:border-brand-teal bg-teal-50/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-gray-700 select-none cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                  <span>{user.name || user.email} ({user.role})</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 stroke-[2.5px]" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 p-2 animate-fade-in animate-duration-150">
                    <Link
                      href="/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-colors hover:bg-gray-50 text-gray-700 flex items-center"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={async () => {
                        setProfileDropdownOpen(false);
                        await logout();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-colors hover:bg-red-50 text-red-600 flex items-center cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
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
            </div>
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
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" alt={user.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold text-slate-800">{user.name || user.email}</span>
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
