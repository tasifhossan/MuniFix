"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Menu, X, ChevronDown } from "lucide-react";
import { getActiveProfile, setActiveProfile, profiles, ActiveProfile } from "@/lib/api";

interface NavbarProps {
  activeNav?: string;
  onNavClick?: (section: string) => void;
  isDashboard?: boolean;
}

export default function Navbar({ activeNav = "how-it-works", onNavClick, isDashboard = false }: NavbarProps) {
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

  // Mock live notifications for MuniFix Ctg
  const notifications = [
    { id: 1, text: "Road repair on Ward 15 (Chawkbazar) completed", time: "5 mins ago", read: false },
    { id: 2, text: "New waterlogging issue reported at GEC Circle", time: "1 hour ago", read: false },
    { id: 3, text: "Waste management team dispatched to Agrabad", time: "2 hours ago", read: true },
  ];

  const handleNavClick = (section: string) => {
    if (onNavClick) {
      onNavClick(section);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold tracking-tight text-brand-teal transition-colors duration-200 hover:text-brand-teal-light">
            MuniFix Ctg
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          <Link
            href="/complaints/new"
            className={`transition-all duration-200 py-2 relative ${
              activeNav === "new-report"
                ? "text-brand-teal font-extrabold"
                : "text-gray-500 hover:text-brand-teal"
            }`}
          >
            New Report
            {activeNav === "new-report" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-teal rounded-full" />
            )}
          </Link>
          <a
            href="#how-it-works"
            onClick={() => handleNavClick("how-it-works")}
            className={`transition-all duration-200 py-2 relative ${
              activeNav === "how-it-works"
                ? "text-brand-teal font-semibold"
                : "text-gray-500 hover:text-brand-teal"
            }`}
          >
            How it Works
            {activeNav === "how-it-works" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-teal rounded-full" />
            )}
          </a>
          <a
            href="#about"
            onClick={() => handleNavClick("about")}
            className={`transition-all duration-200 py-2 relative ${
              activeNav === "about"
                ? "text-brand-teal font-semibold"
                : "text-gray-500 hover:text-brand-teal"
            }`}
          >
            About
            {activeNav === "about" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-teal rounded-full" />
            )}
          </a>
          <a
            href="#contact"
            onClick={() => handleNavClick("contact")}
            className={`transition-all duration-200 py-2 relative ${
              activeNav === "contact"
                ? "text-brand-teal font-semibold"
                : "text-gray-500 hover:text-brand-teal"
            }`}
          >
            Contact
            {activeNav === "contact" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-teal rounded-full" />
            )}
          </a>
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Search Toggle */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 transition-all duration-300 w-64">
                <input
                  type="text"
                  placeholder="Search reports or wards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-sm outline-none w-full text-gray-700 placeholder-gray-400"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600 ml-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-gray-600 hover:text-brand-teal p-2 rounded-full hover:bg-gray-50 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Notification Toggle */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="text-gray-600 hover:text-brand-teal p-2 rounded-full hover:bg-gray-50 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 bg-brand-orange w-2.5 h-2.5 rounded-full ring-2 ring-white animate-pulse" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-4 transition-all animate-fade-in animate-duration-200">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">Live Updates</h3>
                  <span className="text-xs text-brand-teal font-medium cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`flex items-start space-x-2 text-xs p-2 rounded-lg transition-colors ${notif.read ? "bg-white" : "bg-teal-50/50"}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${notif.read ? "bg-gray-300" : "bg-brand-teal"}`} />
                      <div className="flex-1">
                        <p className="text-gray-700">{notif.text}</p>
                        <span className="text-[10px] text-gray-400 font-medium block mt-1">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="text-gray-600 hover:text-brand-teal p-1.5 rounded-full hover:bg-gray-50 transition-colors relative"
          >
            <Bell className="w-5.5 h-5.5" />
            <span className="absolute top-1 right-1 bg-brand-orange w-2 h-2 rounded-full" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 hover:text-brand-teal p-2 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Notification Popdown (Overlay-less) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-2 pb-6 space-y-3 shadow-inner">
          {isDashboard ? (
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
                className="block w-full text-center py-2.5 bg-brand-teal text-white font-medium rounded-xl hover:bg-brand-teal-hover"
              >
                Register
              </Link>
            </>
          )}
          <div className="border-t border-gray-100 my-2 pt-2">
            <Link
              href="/complaints/new"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-600 hover:text-brand-teal font-medium text-sm"
            >
              New Report
            </Link>
            <a
              href="#how-it-works"
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick("how-it-works");
              }}
              className="block py-2 text-gray-600 hover:text-brand-teal font-medium text-sm"
            >
              How it Works
            </a>
            <a
              href="#about"
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick("about");
              }}
              className="block py-2 text-gray-600 hover:text-brand-teal font-medium text-sm"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick("contact");
              }}
              className="block py-2 text-gray-600 hover:text-brand-teal font-medium text-sm"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
