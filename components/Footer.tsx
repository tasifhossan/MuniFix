"use client";

import React from "react";
import Link from "next/link";
import { Globe, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#e5e7eb]/40 border-t border-gray-200/50 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12 border-b border-gray-200/60">
          {/* Column 1 */}
          <div className="space-y-4">
            <span className="text-xl font-black text-brand-teal uppercase tracking-wide">MuniFix Ctg</span>
            <p className="text-xs text-gray-500 font-medium">Empowering Chattogram citizens since 2024.</p>
          </div>

          {/* Column 2 */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-2 text-xs">
            <div className="space-y-3">
              <p className="font-bold text-gray-700 tracking-wider uppercase">Quick Links</p>
              <div className="flex flex-col space-y-2 text-gray-500 font-semibold">
                <a href="#how-it-works" className="hover:text-brand-teal transition-colors">Departments</a>
                <Link href="/privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-brand-teal transition-colors">Terms of Service</Link>
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-gray-700 tracking-wider uppercase">Contact Info</p>
              <div className="flex flex-col space-y-2 text-gray-500 font-semibold">
                <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-brand-teal transition-colors">Chattogram City Corporation</a>
                <span className="flex items-center"><Globe className="w-3.5 h-3.5 mr-1.5" /> www.munifix-ctg.org</span>
                <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5" /> support@munifix-ctg.org</span>
                <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1.5" /> +880-31-xxxxxx</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-gray-400 font-medium">
          <span>&copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</span>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-brand-teal transition-colors" aria-label="Web"><Globe className="w-4.5 h-4.5" /></a>
            <a href="#" className="hover:text-brand-teal transition-colors" aria-label="Email"><Mail className="w-4.5 h-4.5" /></a>
            <a href="#" className="hover:text-brand-teal transition-colors" aria-label="Phone"><Phone className="w-4.5 h-4.5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
