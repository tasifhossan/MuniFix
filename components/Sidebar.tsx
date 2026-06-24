"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react";

interface SidebarProps {
  onItemSelect?: (item: string) => void;
}

export default function Sidebar({ onItemSelect }: SidebarProps) {
  const pathname = usePathname();

  const mainNavItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { id: "complaints", label: "Complaints", href: "/dashboard/complaints", icon: AlertTriangle },
    { id: "reports", label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    { id: "settings", label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const bottomNavItems = [
    { id: "help", label: "Help Center", href: "/dashboard/help", icon: HelpCircle },
    { id: "logout", label: "Logout", href: "/login", icon: LogOut },
  ];

  const renderLink = (item: { id: string; label: string; href: string; icon: React.ComponentType<any> }) => {
    const Icon = item.icon;
    
    // Check if the current route is active
    // For dashboard root, match exactly; for others, check if it starts with the link href
    const isActive = item.href === "/dashboard" 
      ? pathname === "/dashboard" 
      : pathname.startsWith(item.href);

    return (
      <Link
        key={item.id}
        href={item.href}
        onClick={() => onItemSelect?.(item.id)}
        className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-250 cursor-pointer active:scale-[0.99] select-none ${
          isActive
            ? "bg-brand-teal text-white shadow-md shadow-brand-teal/15"
            : "text-slate-500 hover:text-brand-teal hover:bg-teal-50/20"
        }`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-650"}`} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 border-r border-slate-100 flex flex-col justify-between py-6 px-4 bg-[#f8fafc] shrink-0 min-h-[calc(100vh-5rem)] sticky top-20 self-start hidden md:flex">
      {/* Main Navigation */}
      <nav className="space-y-2 flex-1">
        {mainNavItems.map(renderLink)}
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-2 pt-6 border-t border-slate-200/60">
        {bottomNavItems.map(renderLink)}
      </div>
    </aside>
  );
}
