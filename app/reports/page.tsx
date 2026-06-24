"use client";

import React from "react";
import { BarChart3, LineChart, PieChart, Users, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function ReportsPage() {
  const analytics = [
    { label: "Total Reports Submitted in Ctg", value: "1,248", change: "+12% this month" },
    { label: "Average Resolution Time", value: "3.4 Days", change: "-0.8 Days average" },
    { label: "Citizen Satisfaction Score", value: "88%", change: "+2.4% score increase" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Global Header */}
      <Navbar activeNav="reports" isDashboard />

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
              Municipal Reports & Analytics
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Public performance charts, resolution rates, and civic service transparency reports.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics.map((metric, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-2">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">{metric.label}</p>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-black text-gray-800">{metric.value}</p>
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Graph Layout */}
          <div className="bg-white p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">Resolution Performance by Department</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>

            {/* Simulated Chart Bars */}
            <div className="space-y-5 py-4">
              {[
                { name: "Waste Management", rate: 94, color: "bg-brand-teal" },
                { name: "Engineering / Roads", rate: 78, color: "bg-blue-500" },
                { name: "Water & Sewerage", rate: 82, color: "bg-indigo-500" },
                { name: "Street Lighting & Power", rate: 90, color: "bg-brand-orange" }
              ].map((dep, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-sm font-bold text-gray-700">
                    <span>{dep.name}</span>
                    <span>{dep.rate}% resolved</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${dep.color}`}
                      style={{ width: `${dep.rate}%` }}
                    />
                  </div>
                </div>
              ))}
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
