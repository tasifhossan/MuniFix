"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareWarning,
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
    { id: "complaints", label: "Complaints", href: "/complaints", icon: MessageSquareWarning },
    { id: "reports", label: "Reports", href: "/reports", icon: BarChart3 },
    { id: "settings", label: "Settings", href: "/settings", icon: Settings },
  ];

  const bottomNavItems = [
    { id: "help", label: "Help Center", href: "/help", icon: HelpCircle },
    { id: "logout", label: "Logout", href: "/login", icon: LogOut },
  ];

  const renderLink = (item: { id: string; label: string; href: string; icon: React.ComponentType<any> }) => {
    const Icon = item.icon;
    // Highlight if pathname matches exactly, or starts with the href (excluding root /)
    const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

    return (
      <Link
        key={item.id}
        href={item.href}
        onClick={() => onItemSelect?.(item.id)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
          isActive
            ? "bg-brand-teal text-white shadow-md shadow-brand-teal/10"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/70"
        }`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 border-r border-gray-200 flex flex-col justify-between py-6 px-4 bg-white shrink-0 min-h-[calc(100vh-5rem)]">
      {/* Main Navigation */}
      <nav className="space-y-1.5 flex-1">
        {mainNavItems.map(renderLink)}
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-1.5 pt-6 border-t border-gray-150">
        {bottomNavItems.map(renderLink)}
      </div>
    </aside>
  );
}
