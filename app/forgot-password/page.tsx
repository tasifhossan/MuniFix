"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Building, ArrowLeft, CheckCircle2 } from "lucide-react";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simple email validation pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);

    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 sm:p-8 font-sans bg-gradient-to-br from-slate-50 via-teal-50/10 to-slate-100">
      {/* Top Header Logo */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-start py-2">
        <Link href="/" className="flex items-center space-x-2 text-brand-teal font-extrabold text-xl hover:opacity-90 transition-opacity">
          <Building className="w-5.5 h-5.5" />
          <span>MuniFix Ctg</span>
        </Link>
      </header>

      {/* Main Form Box */}
      <main className="flex items-center justify-center my-auto py-8">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-150/60 border border-gray-150/40 text-center animate-fade-in">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Reset Badge */}
              <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-brand-cyan-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.73" />
                  <rect x="9" y="11" width="6" height="5" rx="1" />
                  <path d="M10 11V9a2 2 0 1 1 4 0v2" />
                </svg>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Forgot Password?</h1>
                <p className="text-[13px] text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Enter your registered email to receive a password reset link.
                </p>
              </div>

              {/* Reusable Input */}
              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="citizen@chattogram.gov.bd"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                error={error}
                icon={<Mail className="w-4 h-4" />}
                className="text-left"
              />

              {/* Reusable Button */}
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={!email}
                className="w-full py-4 text-sm font-semibold tracking-wide bg-brand-teal"
              >
                <span className="flex items-center justify-center">
                  Send Reset Link <span className="ml-1.5 font-normal text-xs">▷</span>
                </span>
              </Button>

              {/* Back to Login Link */}
              <div className="pt-2 border-t border-gray-100">
                <Link
                  href="/login"
                  className="inline-flex items-center text-xs font-bold text-brand-teal hover:text-brand-teal-hover transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          ) : (
            // Success Screen
            <div className="space-y-6 py-4">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-brand-cyan-text shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900">Reset Link Sent!</h2>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  We have sent a password recovery link to <span className="font-semibold text-gray-700">{email}</span>. Please check your inbox.
                </p>
              </div>
              <div className="pt-4">
                <Link href="/login" className="w-full block">
                  <Button variant="outline" className="w-full py-3">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center space-y-2 py-4">
        <p className="text-xs text-gray-400 font-medium">© 2024 MuniFix Ctg. All rights reserved.</p>
        <div className="flex items-center justify-center space-x-6 text-[11px] text-gray-500 font-bold">
          <Link href="/privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</Link>
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <a href="mailto:support@munifix-ctg.org" className="hover:text-brand-teal transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
