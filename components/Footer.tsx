"use client";

import React from "react";
import Link from "next/link";
import { Globe, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#eff6ff]/40 border-t border-slate-200/50 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <span className="text-xl font-black text-brand-teal tracking-tight">MuniFix</span>
              <span className="text-xl font-black text-slate-800 tracking-tight">Ctg</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Empowering Chattogram citizens since 2024.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-gray-600">
            <a href="#departments" className="hover:text-brand-teal transition-colors">Departments</a>
            <Link href="/privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-teal transition-colors">Terms of Service</Link>
            <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-brand-teal transition-colors">Chattogram City Corporation</a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200/50" />

        {/* Row 2 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-medium">
          <span>&copy; 2024 MuniFix Ctg. All rights reserved.</span>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-brand-teal transition-colors" aria-label="Web"><Globe className="w-4.5 h-4.5" /></a>
            <a href="#" className="text-gray-400 hover:text-brand-teal transition-colors" aria-label="Email"><Mail className="w-4.5 h-4.5" /></a>
            <a href="#" className="text-gray-400 hover:text-brand-teal transition-colors" aria-label="Phone"><Phone className="w-4.5 h-4.5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
