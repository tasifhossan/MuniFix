"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  ThumbsUp,
  TrendingUp,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function CitizenDashboard() {
  const stats = [
    { label: "My Complaints", value: "8", icon: FileText, color: "text-brand-teal bg-teal-50" },
    { label: "Resolved", value: "5", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "In Progress", value: "2", icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Upvotes Given", value: "24", icon: ThumbsUp, color: "text-sky-600 bg-sky-50" },
  ];

  const recentActivities = [
    { id: 1, action: "Emergency dispatch", target: "Garbage Pile-up Main Road", time: "3 hours ago", status: "dispatched" },
    { id: 2, action: "Status update", target: "Large Pothole near GEC Circle", time: "2 hours ago", status: "in progress" },
    { id: 3, action: "Issue resolved", target: "Street Light Malfunction - Road 04", time: "Yesterday", status: "resolved" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Global Header */}
      <Navbar activeNav="dashboard" isDashboard />

      {/* Main Container Layout */}
      <div className="flex flex-col md:flex-row flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar Nav */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Content Area */}
        <main className="flex-1 space-y-8 animate-fade-in">
          
          {/* Header Row */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Citizen Dashboard
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Welcome back! Here is a summary of your municipal reports and requests.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex items-center space-x-4">
                  <div className={`p-3.5 rounded-2xl ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-black text-gray-800 mt-1">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Grid split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Quick Actions Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm lg:col-span-2 space-y-6">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">Quick Operations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/complaints"
                  className="p-5 border border-gray-150 hover:border-brand-teal hover:bg-teal-50/10 rounded-2xl flex flex-col justify-between transition-all group cursor-pointer h-36"
                >
                  <MessageSquareWarning className="w-8 h-8 text-brand-teal mb-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-800">Browse Complaints</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
                <div
                  className="p-5 border border-gray-150 hover:border-brand-orange hover:bg-amber-50/10 rounded-2xl flex flex-col justify-between transition-all group cursor-pointer h-36"
                  onClick={() => window.location.href = "/complaints"}
                >
                  <AlertTriangle className="w-8 h-8 text-brand-orange mb-4 animate-pulse" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-800">Emergency Dispatch</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 tracking-tight">Recent Updates</h3>
                <span className="text-xs font-bold text-brand-teal flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> Live
                </span>
              </div>
              <div className="space-y-4">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start space-x-3 text-sm p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      act.status === "resolved" ? "bg-emerald-500" :
                      act.status === "in progress" ? "bg-brand-orange" : "bg-blue-500"
                    }`} />
                    <div>
                      <p className="font-semibold text-gray-700">{act.action}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{act.target} &bull; {act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* Global Simple Footer */}
      <footer className="bg-slate-100/50 border-t border-slate-200 mt-auto">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-4">
          <span>&copy; 2024 MuniFix Ctg. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#departments" className="hover:text-brand-teal transition-colors">Departments</a>
            <a href="#privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-brand-teal transition-colors">Terms of Service</a>
            <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-brand-teal transition-colors">
              Chattogram City Corporation
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Inline fallback for layout check
import { MessageSquareWarning } from "lucide-react";
