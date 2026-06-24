"use client";

import React, { useState } from "react";
import { Settings, User, Bell, Shield, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function SettingsPage() {
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Global Header */}
      <Navbar activeNav="settings" isDashboard />

      {/* Main Container Layout */}
      <div className="flex flex-col md:flex-row flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar Nav */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Content Area */}
        <main className="flex-1 space-y-8 animate-fade-in">
          
          {/* Header Row */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Settings & Configurations
              </h1>
              <p className="text-gray-500 text-sm font-medium mt-1">
                Customize your account details, notification rules, and security preferences.
              </p>
            </div>
            {success && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 animate-fade-in">
                <CheckCircle className="w-4 h-4" /> Changes Saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Forms Panel */}
            <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-gray-150 shadow-sm lg:col-span-2 space-y-6">
              
              {/* Account Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-800 font-bold border-b border-gray-100 pb-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <h4>Profile Settings</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Tasif Hossan"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue="tasif@munifix-ctg.org"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-gray-800 font-bold border-b border-gray-100 pb-2">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <h4>Notifications</h4>
                </div>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 text-sm font-semibold text-gray-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-1 accent-brand-teal rounded border-gray-300" />
                    <div>
                      <p>SMS Alert notifications</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">Receive immediate SMS updates when resolution status changes.</p>
                    </div>
                  </label>
                  <label className="flex items-start space-x-3 text-sm font-semibold text-gray-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-1 accent-brand-teal rounded border-gray-300" />
                    <div>
                      <p>Email reports digest</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">Receive a weekly overview of resolution rates in my ward.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md transition-colors"
                >
                  Save Account Changes
                </button>
              </div>

            </form>

            {/* Sidebar Security Info */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-gray-800 font-bold border-b border-gray-100 pb-2">
                <Shield className="w-5 h-5 text-gray-400" />
                <h4>Security Details</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                MuniFix platform ensures your data stays encrypted and compliant with municipal privacy laws. Two-Factor Authentication can be configured on this device.
              </p>
              <button
                type="button"
                className="w-full text-center py-3 border border-gray-200 text-gray-650 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all"
              >
                Change Access Password
              </button>
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
