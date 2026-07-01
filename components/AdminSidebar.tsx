"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  Users as UsersIcon,
  AlertTriangle, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut,
  Building,
  Plus
} from "lucide-react";

interface AdminSidebarProps {
  activeNav?: string;
  onNavClick?: (nav: string) => void;
  newReportPlacement?: "top" | "bottom" | "hidden";
  settingsPlacement?: "top" | "bottom";
  role?: "admin" | "superadmin";
}

export default function AdminSidebar({ 
  activeNav, 
  onNavClick,
  newReportPlacement = "top",
  settingsPlacement = "bottom",
  role = "admin",
}: AdminSidebarProps) {
  const pathname = usePathname();
  
  // Auto-detect active nav based on path if not explicitly provided
  const currentActive = activeNav || (
    pathname === "/admin" ? "dashboard" :
    pathname?.includes("/admin/users") ? "users" :
    pathname?.includes("/admin/departments") ? "departments" :
    pathname?.includes("/admin/complaints") ? "complaints" :
    pathname?.includes("/admin/settings") ? "settings" : "dashboard"
  );

  const baseItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutGrid className="w-5 h-5" />, href: "/admin" },
    { id: "users", label: "Users", icon: <UsersIcon className="w-5 h-5" />, href: "/admin/users" },
    { id: "complaints", label: "Complaints", icon: <AlertTriangle className="w-5 h-5" />, href: "/admin/complaints" },
    { id: "departments", label: "Departments", icon: <Building className="w-5 h-5" />, href: "/admin/departments" },
    { id: "reports", label: "Reports", icon: <FileText className="w-5 h-5" />, href: "#reports" },
  ];

  // If settingsPlacement is "top", include it in the main menu list
  const menuItems = settingsPlacement === "top"
    ? [...baseItems, { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" />, href: "#settings" }]
    : baseItems;

  const handleNavClick = (id: string) => {
    if (onNavClick) {
      onNavClick(id);
    }
  };

  const isSuperAdmin = role === "superadmin";

  const renderNewReportButton = () => (
    <Link href="/complaints/new">
      <button 
        className={`w-full text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 select-none active:scale-[0.98] shadow-sm ${
          isSuperAdmin 
            ? "bg-[#005c55] hover:bg-[#004540] text-white" 
            : "bg-[#f59e0b] hover:bg-[#d97706] text-slate-900"
        }`}
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>New Report</span>
      </button>
    </Link>
  );

  return (
    <aside className="w-64 bg-[#f3f6fc] border-r border-[#e2e8f0] flex flex-col justify-between py-6 min-h-screen shrink-0 font-sans sticky top-0 self-start">
      <div className="space-y-6 flex-1 flex flex-col">
        
        {/* Sidebar Brand Logo */}
        <div className="flex items-center space-x-3 px-6 py-2">
          {!isSuperAdmin && (
            <div className="w-10 h-10 bg-[#005c55] text-white rounded-xl flex items-center justify-center shadow-md shrink-0">
              <Building className="w-6 h-6" />
            </div>
          )}
          <div>
            <span className="text-lg font-bold tracking-tight text-[#005c55] select-none block leading-tight">
              {isSuperAdmin ? "Super Admin" : "MuniFix Ctg"}
            </span>
            <span className="text-[9px] font-bold text-gray-555 uppercase tracking-wider select-none block mt-1">
              {isSuperAdmin ? "Chattogram Municipal" : "CHATTOGRAM MUNICIPAL"}
            </span>
          </div>
        </div>

        {/* New Report CTA button in Top Position */}
        {newReportPlacement === "top" && (
          <div className="px-4 pt-2">
            {renderNewReportButton()}
          </div>
        )}

        {/* Main Navigation Links */}
        <nav className="space-y-1 px-3 pt-4 flex-1">
          {menuItems.map((item) => {
            const isActive = currentActive === item.id;
            
            const btnContent = (
              <button
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold transition-all duration-200 select-none cursor-pointer rounded-xl ${
                  isActive
                    ? "text-white bg-[#005c55] shadow-md shadow-[#005c55]/10"
                    : "text-slate-600 hover:text-[#005c55] hover:bg-slate-100/50"
                }`}
              >
                <div className={`transition-colors ${isActive ? "text-white" : "text-slate-500"}`}>
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
      <div className="space-y-1 border-t border-slate-200 pt-4 px-3">
        {/* Settings button in Footer Position (if not in top nav list) */}
        {settingsPlacement === "bottom" && (
          <Link href="#settings" className="block">
            <button 
              onClick={() => handleNavClick("settings")}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold transition-all rounded-xl select-none cursor-pointer ${
                currentActive === "settings"
                  ? "text-white bg-[#005c55] shadow-md shadow-[#005c55]/10"
                  : "text-slate-600 hover:text-[#005c55] hover:bg-slate-100/50"
              }`}
            >
              <Settings className={`w-5 h-5 ${currentActive === "settings" ? "text-white" : "text-slate-500"}`} />
              <span>Settings</span>
            </button>
          </Link>
        )}

        {/* New Report CTA button in Bottom Position */}
        {newReportPlacement === "bottom" && (
          <div className="pb-2">
            {renderNewReportButton()}
          </div>
        )}

        <Link href="#help" className="block">
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#005c55] hover:bg-slate-100/50 transition-all rounded-xl select-none cursor-pointer">
            <HelpCircle className="w-5 h-5 text-slate-500" />
            <span>Help Center</span>
          </button>
        </Link>
        
        <Link href="/login" className="block">
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-55/40 transition-all rounded-xl select-none cursor-pointer">
            <LogOut className="w-5 h-5 text-slate-500" />
            <span>Logout</span>
          </button>
        </Link>
      </div>
    </aside>
  );
}
