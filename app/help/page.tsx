"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, PhoneCall } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How fast will the emergency team handle my report?",
      a: "Emergency reports (critical structural damage, active street hazards, gas/electrical concerns) are processed and dispatched within 2 hours. Normal priority reports take up to 3 business days."
    },
    {
      q: "Can I track the exact location of dispatched workers?",
      a: "Currently, you can monitor the status updates (Dispatched, In Progress, Resolved) directly on the complaints list. Live vehicle tracking is scheduled for future updates."
    },
    {
      q: "How can I upvote a complaint in my area?",
      a: "If another citizen has already reported an issue, you can find it on the complaints map or list and click the 'Upvote' button. Higher upvote counts tell ward inspectors the problem is affecting many citizens."
    },
    {
      q: "Who is responsible for street light replacements?",
      a: "The Chattogram City Corporation Electrical Department handles public street lighting repairs. Reports submitted through MuniFix are automatically routed to the corresponding ward supervisor."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Global Header */}
      <Navbar activeNav="help" isDashboard />

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
              Help Center & Support
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Find answers to frequently asked questions about MuniFix Ctg operations.
            </p>
          </div>

          {/* Search Help */}
          <div className="relative">
            <Search className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none w-5 h-5 my-auto" />
            <input
              type="text"
              placeholder="Search help articles or guides..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-250 text-sm focus:outline-none focus:border-brand-teal bg-white transition-all text-gray-800 placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ Accordion */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight mb-4">Frequently Asked Questions</h3>
              
              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden transition-all">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-gray-700 hover:bg-slate-50 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4.5 h-4.5 text-gray-400" /> : <ChevronDown className="w-4.5 h-4.5 text-gray-400" />}
                      </button>
                      
                      {isOpen && (
                        <div className="p-4 bg-slate-50/50 text-sm text-gray-500 border-t border-gray-100 leading-relaxed font-medium">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Contact Options */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-6 self-start">
              <div className="flex items-center gap-2 text-gray-800 font-bold border-b border-gray-100 pb-2">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <h4>Need further assistance?</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-2xl border border-gray-100 hover:bg-slate-50 transition-all cursor-pointer">
                  <div className="p-2.5 bg-teal-50 text-brand-teal rounded-xl">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Support Chatbox</p>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Response within 10 mins</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-2xl border border-gray-100 hover:bg-slate-50 transition-all cursor-pointer">
                  <div className="p-2.5 bg-orange-50 text-brand-orange rounded-xl">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Call Ward Office</p>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Hotline: +880-31-xxxxxx</p>
                  </div>
                </div>
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
