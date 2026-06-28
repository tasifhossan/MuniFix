"use client";

import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  PlusCircle, 
  HelpCircle, 
  LogOut,
  Landmark
} from "lucide-react";

interface WorkerSidebarProps {
  activeNav?: string;
  onNavClick?: (nav: string) => void;
}

export default function WorkerSidebar({ 
  activeNav = "dashboard", 
  onNavClick 
}: WorkerSidebarProps) {
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { id: "complaints", label: "Complaints", icon: <AlertTriangle className="w-4.5 h-4.5" /> },
    { id: "reports", label: "Reports", icon: <BarChart3 className="w-4.5 h-4.5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4.5 h-4.5" /> },
  ];

  const handleNavClick = (id: string) => {
    if (onNavClick) {
      onNavClick(id);
    }
  };

  return (
    <aside className="w-64 bg-[#f8fafc] border-r border-slate-200/80 flex flex-col justify-between py-6 px-4 min-h-screen shrink-0 font-sans sticky top-0 self-start">
      <div className="space-y-8 flex-1 flex flex-col">
        {/* Sidebar Brand Logo */}
        <div className="flex items-center space-x-3 px-2">
          <div className="w-9 h-9 bg-brand-teal text-white rounded-xl flex items-center justify-center shadow-md shadow-brand-teal/15 shrink-0">
            <Landmark className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-slate-800 select-none block">
              MuniFix Ctg
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest select-none block -mt-0.5">
              Field Operations
            </span>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-1.5 flex-1">
          {menuItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 select-none cursor-pointer active:scale-[0.98] ${
                  isActive
                    ? "bg-brand-teal text-white shadow-md shadow-brand-teal/10"
                    : "text-slate-500 hover:text-brand-teal hover:bg-slate-100/80"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Golden-Yellow New Report Button */}
        <div className="px-1 mt-auto pb-4 border-b border-slate-200/60">
          <Link href="/complaints/new" className="w-full block">
            <button className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-[#f59e0b]/10 hover:shadow-[#f59e0b]/20 select-none active:scale-[0.98] cursor-pointer text-xs">
              <PlusCircle className="w-4.5 h-4.5 stroke-[2.2]" />
              <span>New Report</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Footer Navigation Elements */}
      <div className="space-y-1.5 pt-4">
        <Link href="/help" className="block">
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-brand-teal hover:bg-slate-100/80 transition-all select-none cursor-pointer">
            <HelpCircle className="w-4.5 h-4.5" />
            <span>Help Center</span>
          </button>
        </Link>
        
        <Link href="/login" className="block">
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50/50 transition-all select-none cursor-pointer">
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout</span>
          </button>
        </Link>
      </div>
    </aside>
  );
}
