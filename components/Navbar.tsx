"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, Menu, X, Globe, Mail, Phone } from "lucide-react";

interface NavbarProps {
  activeNav?: string;
  onNavClick?: (section: string) => void;
  user?: {
    name: string;
    avatar: string;
  };
}

export default function Navbar({ activeNav = "how-it-works", onNavClick, user }: NavbarProps) {
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-1">
          <span className="text-2xl font-black tracking-tight text-brand-teal">
            MuniFix
          </span>
          <span className="text-2xl font-black tracking-tight text-slate-800">
            Ctg
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          {(user
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
                  if (!user && onNavClick) {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }
                }}
                className={`transition-all duration-200 py-2 relative ${
                  isActive
                    ? "text-brand-teal font-semibold"
                    : "text-gray-500 hover:text-brand-teal"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-brand-teal rounded-full" />
                )}
              </Link>
            );
          })}
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

          {/* User Profile or Auth Buttons */}
          {user ? (
            <>
              <div className="w-[1px] h-6 bg-gray-200" />
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-100">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-bold text-gray-800 hover:text-brand-teal transition-colors">
                  {user.name}
                </span>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-700 hover:text-brand-teal transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-brand-teal text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-brand-teal-hover transition-all duration-300 shadow-md shadow-brand-teal/10 hover:shadow-brand-teal/20 transform hover:-translate-y-0.5"
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

      {/* Mobile Menu Popdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-4 pb-6 space-y-3 shadow-inner">
          {user ? (
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100 mb-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-400">Citizen</p>
              </div>
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
                className="block w-full text-center py-2.5 bg-brand-teal text-white font-medium rounded-xl hover:bg-brand-teal-hover"
              >
                Register
              </Link>
            </>
          )}
          <div className={`${!user ? "border-t border-gray-100 my-2 pt-2" : ""}`}>
            {(user
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
                  if (!user && onNavClick) {
                    onNavClick(item.id);
                  }
                }}
                className="block py-2.5 text-gray-600 hover:text-brand-teal font-medium text-sm"
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
