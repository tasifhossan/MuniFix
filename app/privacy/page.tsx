"use client";

import Link from "next/link";
import { Building, ArrowLeft, Shield, Eye, Lock, Database, Bell, Mail } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Database className="w-5 h-5" />,
      title: "Information We Collect",
      content: [
        "**Account Information:** When you register, we collect your full name, email address, and phone number to create and manage your MuniFix account.",
        "**Complaint Data:** Details you provide when submitting a complaint — including description, location (GPS coordinates or address), and any photos you upload.",
        "**Usage Data:** Pages visited, actions taken within the app, and device/browser information to improve the platform.",
        "**Location Data:** Only when you explicitly grant permission to detect your current location for complaint submission. We do not track your location passively.",
      ],
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "How We Use Your Information",
      content: [
        "**Service Delivery:** To process and route your complaints to the relevant Chattogram City Corporation department.",
        "**AI Categorization:** Your complaint description is processed by our AI system to auto-classify and prioritize issues for faster resolution.",
        "**Notifications:** To send you status updates about your submitted complaints via in-app notifications.",
        "**Platform Improvement:** Aggregated, anonymized data is used to identify recurring issues and improve the platform.",
        "**Authentication:** To verify your identity and secure your account.",
      ],
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Data Sharing & Disclosure",
      content: [
        "**Municipal Departments:** Your complaint details are shared with the relevant Chattogram City Corporation department responsible for resolution.",
        "**Field Workers:** Assigned workers receive complaint details (location and description) necessary to resolve your issue.",
        "**No Third-Party Sale:** We do not sell, rent, or trade your personal information to any third party for marketing purposes.",
        "**Legal Compliance:** We may disclose information if required by law or in response to a valid legal request from authorities.",
      ],
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Data Security",
      content: [
        "All data is transmitted over HTTPS/TLS encryption. Passwords are hashed using industry-standard algorithms and are never stored in plain text.",
        "Access to personal data is role-restricted — only authorized department staff and field workers can view complaints assigned to them.",
        "We regularly review security practices to protect against unauthorized access, disclosure, or alteration of your data.",
      ],
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Your Rights",
      content: [
        "**Access & Correction:** You may view and update your profile information at any time through the Settings page.",
        "**Account Deletion:** You may request deletion of your account and associated data by contacting support.",
        "**Complaint Withdrawal:** You may cancel a pending complaint before it is assigned to a worker.",
        "**Notification Control:** You can manage notification preferences in your account settings.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans bg-gradient-to-br from-slate-50 via-teal-50/10 to-slate-100">
      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center space-x-2 text-brand-teal font-extrabold text-xl hover:opacity-90 transition-opacity">
          <Building className="w-5 h-5" />
          <span>MuniFix Ctg</span>
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-brand-teal transition-colors gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
      </header>

      {/* Hero */}
      <div className="max-w-4xl mx-auto w-full px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-brand-teal">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest">Legal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Privacy Policy</h1>
        <p className="text-gray-500 text-sm font-medium mt-2 max-w-2xl">
          MuniFix Ctg is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights as a user.
        </p>
        <p className="text-xs text-gray-400 font-semibold mt-3">Last updated: July 2025</p>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto w-full px-6 pb-12">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10 space-y-10">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center text-brand-teal flex-shrink-0">
                  {section.icon}
                </div>
                <h2 className="text-base font-black text-gray-900">{section.title}</h2>
              </div>
              <ul className="space-y-3 pl-1">
                {section.content.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-teal flex-shrink-0" />
                    <span dangerouslySetInnerHTML={{
                      __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-800">$1</strong>')
                    }} />
                  </li>
                ))}
              </ul>
              {idx < sections.length - 1 && <hr className="border-gray-100 pt-2" />}
            </div>
          ))}

          {/* Contact */}
          <div className="bg-teal-50 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-teal shadow-sm flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Questions about your privacy?</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Contact our data protection team at{" "}
                <a href="mailto:privacy@munifix-ctg.org" className="text-brand-teal font-bold hover:underline">
                  privacy@munifix-ctg.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center space-y-2 py-6 px-6">
        <p className="text-xs text-gray-400 font-medium">© {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</p>
        <div className="flex items-center justify-center space-x-6 text-[11px] text-gray-500 font-bold">
          <Link href="/terms" className="hover:text-brand-teal transition-colors">Terms of Service</Link>
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <a href="mailto:support@munifix-ctg.org" className="hover:text-brand-teal transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
