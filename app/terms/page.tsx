"use client";

import Link from "next/link";
import { Building, ArrowLeft, FileText, UserCheck, AlertTriangle, Scale, RefreshCw, Mail } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: "Eligibility & Account Registration",
      content: [
        "MuniFix Ctg is available to all residents of Chattogram, Bangladesh. By registering, you confirm you are at least 16 years of age.",
        "You must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your login credentials.",
        "You may not share your account with others or create multiple accounts for the same person. Each account represents a single verified citizen.",
        "Accounts created using false identities or fraudulent information may be suspended without notice.",
      ],
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Complaint Submission Guidelines",
      content: [
        "**Truthful Reporting:** All complaints must be based on genuine, real-world issues within Chattogram City Corporation's jurisdiction. Filing false or fabricated complaints is strictly prohibited.",
        "**Relevant Content:** Complaints must relate to municipal services including — but not limited to — road maintenance, waste management, water & drainage, street lighting, and public infrastructure.",
        "**Single Submission:** Do not submit duplicate complaints for the same issue. If your complaint status has not updated, use the platform's tracking feature instead.",
        "**Evidence Quality:** Uploaded photos must be genuine and relevant to the reported issue. Do not upload offensive, inappropriate, or misleading images.",
        "**No Harassment:** Complaints targeting specific individuals rather than municipal issues will be removed.",
      ],
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Prohibited Conduct",
      content: [
        "Attempting to access accounts or data belonging to other users.",
        "Using automated tools, bots, or scripts to interact with the platform.",
        "Submitting spam, irrelevant, or politically motivated complaints.",
        "Attempting to interfere with or disrupt the platform's infrastructure or services.",
        "Using the platform to spread misinformation or manipulate public records.",
        "Impersonating a Chattogram City Corporation official, field worker, or other user.",
      ],
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Platform Responsibilities & Limitations",
      content: [
        "**Resolution Timelines:** MuniFix Ctg facilitates complaint routing to the relevant department. We do not guarantee a specific resolution timeline — this depends on the department's capacity and the nature of the issue.",
        "**Service Availability:** We strive for 99% uptime but do not guarantee uninterrupted access. Planned maintenance will be communicated in advance.",
        "**AI Classification Accuracy:** Our AI categorization system is an aid tool and may occasionally misclassify complaints. Department admins may override AI classifications.",
        "**No Liability:** MuniFix Ctg is not liable for any loss, damage, or harm arising from unresolved complaints or delays in municipal service delivery.",
      ],
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: "Modifications & Termination",
      content: [
        "**Policy Updates:** We reserve the right to update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the revised Terms.",
        "**Account Suspension:** We may suspend or terminate accounts that repeatedly violate these Terms, with or without prior notice depending on the severity of the violation.",
        "**Service Changes:** MuniFix Ctg may modify, suspend, or discontinue features at any time to improve the platform or comply with regulatory requirements.",
        "These Terms are governed by the laws of the People's Republic of Bangladesh.",
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
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest">Legal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Terms of Service</h1>
        <p className="text-gray-500 text-sm font-medium mt-2 max-w-2xl">
          By using MuniFix Ctg, you agree to the following terms. Please read them carefully before creating an account or submitting complaints.
        </p>
        <p className="text-xs text-gray-400 font-semibold mt-3">Last updated: July 2025</p>
      </div>

      {/* Acceptance Banner */}
      <div className="max-w-4xl mx-auto w-full px-6 pb-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 font-medium leading-relaxed">
            By registering an account or using the MuniFix Ctg platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service and our Privacy Policy.
          </p>
        </div>
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
              <p className="text-sm font-bold text-gray-900">Questions about these Terms?</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Reach out to our support team at{" "}
                <a href="mailto:support@munifix-ctg.org" className="text-brand-teal font-bold hover:underline">
                  support@munifix-ctg.org
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
          <Link href="/privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</Link>
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <a href="mailto:support@munifix-ctg.org" className="hover:text-brand-teal transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
