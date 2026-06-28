"use client";

import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Users, 
  Package, 
  Settings, 
  HelpCircle, 
  LogOut,
  Landmark,
  Plus
} from "lucide-react";

interface AdminSidebarProps {
  activeNav?: string;
  onNavClick?: (nav: string) => void;
}

export default function AdminSidebar({ 
  activeNav = "complaints", 
  onNavClick 
}: AdminSidebarProps) {
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4.5 h-4.5" />, href: "/admin" },
    { id: "complaints", label: "Complaints", icon: <AlertTriangle className="w-4.5 h-4.5" />, href: "/admin/complaints" },
    { id: "personnel", label: "Personnel", icon: <Users className="w-4.5 h-4.5" />, href: "#personnel" },
    { id: "resources", label: "Resources", icon: <Package className="w-4.5 h-4.5" />, href: "#resources" },
    { id: "settings", label: "Settings", icon: <Settings className="w-4.5 h-4.5" />, href: "#settings" },
  ];

  const handleNavClick = (id: string) => {
    if (onNavClick) {
      onNavClick(id);
    }
  };

  return (
    <aside className="w-64 bg-[#f8fafc] border-r border-slate-200 flex flex-col justify-between py-6 min-h-screen shrink-0 font-sans sticky top-0 self-start">
      <div className="space-y-6 flex-1 flex flex-col">
        {/* Sidebar Brand Logo */}
        <div className="flex items-center space-x-3 px-6">
          <div className="w-9 h-9 bg-brand-teal text-white rounded-xl flex items-center justify-center shadow-md shadow-brand-teal/15 shrink-0">
            <Landmark className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-slate-800 select-none block leading-none">
              MuniFix Admin
            </span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest select-none block mt-1">
              Chattogram City Corp
            </span>
          </div>
        </div>

        {/* Golden-Orange + New Report CTA button */}
        <div className="px-4">
          <Link href="/complaints/new">
            <button className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-slate-900 text-xs sm:text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 select-none active:scale-[0.98] shadow-sm">
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Report</span>
            </button>
          </Link>
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-1.5 flex-1 px-3">
          {menuItems.map((item) => {
            const isActive = activeNav === item.id;
            
            const btnContent = (
              <button
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-xs sm:text-sm font-semibold transition-all duration-200 select-none cursor-pointer rounded-xl ${
                  isActive
                    ? "text-white bg-brand-teal shadow-md shadow-brand-teal/10"
                    : "text-slate-500 hover:text-brand-teal hover:bg-slate-50"
                }`}
              >
                <div className={`transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-brand-teal"}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            );

            if (item.href.startsWith("#")) {
              return <div key={item.id}>{btnContent}</div>;
            }

            return (
              <Link href={item.href} key={item.id} className="block">
                {btnContent}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation Elements */}
      <div className="space-y-0.5 border-t border-slate-250/30 pt-4">
        <Link href="/help" className="block">
          <button className="w-full flex items-center space-x-3.5 px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-brand-teal hover:bg-slate-50 transition-all select-none cursor-pointer">
            <HelpCircle className="w-4.5 h-4.5" />
            <span>Help</span>
          </button>
        </Link>
        
        <Link href="/login" className="block">
          <button className="w-full flex items-center space-x-3.5 px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-55/40 transition-all select-none cursor-pointer">
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout</span>
          </button>
        </Link>
      </div>
    </aside>
  );
}
