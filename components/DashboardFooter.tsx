"use client";

import React from "react";
import Link from "next/link";

export default function DashboardFooter() {
  return (
    <footer className="bg-[#eff6ff]/40 border-t border-slate-200/50 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-200/50">
          {/* Column 1 - Logo & Description */}
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center space-x-1">
              <span className="text-xl font-black text-brand-teal tracking-tight">MuniFix</span>
              <span className="text-xl font-black text-slate-800 tracking-tight">Ctg</span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Empowering the citizens of Chattogram with efficient municipal reporting and transparency.
            </p>
          </div>

          {/* Column 2 - Platform Links */}
          <div className="space-y-4 text-xs">
            <p className="font-bold text-slate-700 tracking-wider uppercase">Platform</p>
            <div className="flex flex-col space-y-2 text-slate-500 font-semibold">
              <a href="/#departments" className="hover:text-brand-teal transition-colors">Departments</a>
              <a href="/#how-it-works" className="hover:text-brand-teal transition-colors">How it Works</a>
            </div>
          </div>

          {/* Column 3 - Connect Links */}
          <div className="space-y-4 text-xs">
            <p className="font-bold text-slate-700 tracking-wider uppercase">Connect</p>
            <div className="flex flex-col space-y-2 text-slate-500 font-semibold">
              <a href="mailto:support@munifix-ctg.org" className="hover:text-brand-teal transition-colors">Contact Support</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-brand-teal transition-colors">Official Facebook</a>
            </div>
          </div>

          {/* Column 4 - Legal Links */}
          <div className="space-y-4 text-xs">
            <p className="font-bold text-slate-700 tracking-wider uppercase">Legal</p>
            <div className="flex flex-col space-y-2 text-slate-500 font-semibold">
              <Link href="/privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-brand-teal transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-slate-400 font-medium gap-4">
          <span>&copy; 2024 MuniFix Ctg. All rights reserved.</span>
          <span className="text-slate-500 font-semibold">
            Official platform for <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="text-slate-800 hover:text-brand-teal font-bold transition-colors">Chattogram City Corporation</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
