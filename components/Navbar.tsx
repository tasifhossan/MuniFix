"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Menu, X, Globe, Mail, Phone } from "lucide-react";

interface NavbarProps {
  activeNav?: string;
  onNavClick?: (section: string) => void;
  user?: {
    name: string;
    avatar: string;
  };
  isDashboard?: boolean;
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
          <a
            href="#how-it-works"
            onClick={() => handleNavClick("how-it-works")}
            className={`transition-all duration-200 py-2 relative ${
              activeNav === "how-it-works"
                ? "text-[#005c55] font-semibold"
                : "text-gray-505 hover:text-[#005c55]"
            }`}
          >
            How it Works
            {activeNav === "how-it-works" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#005c55] rounded-full" />
            )}
          </a>
          <a
            href="#about"
            onClick={() => handleNavClick("about")}
            className={`transition-all duration-200 py-2 relative ${
              activeNav === "about"
                ? "text-[#005c55] font-semibold"
                : "text-gray-550 hover:text-[#005c55]"
            }`}
          >
            About
            {activeNav === "about" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#005c55] rounded-full" />
            )}
          </a>
          <a
            href="#contact"
            onClick={() => handleNavClick("contact")}
            className={`transition-all duration-200 py-2 relative ${
              activeNav === "contact"
                ? "text-[#005c55] font-semibold"
                : "text-gray-550 hover:text-[#005c55]"
            }`}
          >
            Contact
            {activeNav === "contact" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#005c55] rounded-full" />
            )}
          </a>
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
              <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4 transition-all animate-fade-in">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3 select-none">
                  <h3 className="text-sm font-semibold text-gray-800">Live Updates</h3>
                  <span className="text-xs text-[#005c55] font-medium cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`flex items-start space-x-2 text-xs p-2 rounded-lg transition-colors ${notif.read ? "bg-white" : "bg-teal-50/50"}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${notif.read ? "bg-gray-300" : "bg-[#005c55]"}`} />
                      <div className="flex-1">
                        <p className="text-gray-700">{notif.text}</p>
                        <span className="text-[10px] text-gray-405 font-medium block mt-1">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Auth profile avatar (if logged in) or buttons */}
          {user ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
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
          <div className="my-2 pt-2">
            <a
              href="#how-it-works"
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick("how-it-works");
              }}
              className="block py-2 text-gray-650 hover:text-[#005c55] font-medium text-sm"
            >
              How it Works
            </a>
            <a
              href="#about"
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick("about");
              }}
              className="block py-2 text-gray-650 hover:text-[#005c55] font-medium text-sm"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick("contact");
              }}
              className="block py-2 text-gray-650 hover:text-[#005c55] font-medium text-sm"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
