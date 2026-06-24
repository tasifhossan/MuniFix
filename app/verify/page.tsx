"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Check,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import Button from "@/components/Button";
import OtpInput from "@/components/OtpInput";
import ResendTimer from "@/components/ResendTimer";
import AuthHeader from "@/components/AuthHeader";
import AuthFooter from "@/components/AuthFooter";
import AuthBackground from "@/components/AuthBackground";

export default function VerifyPage() {
  const [email, setEmail] = useState("j.doe@example.com");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Safe client-side read of email param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);

  const handleResend = () => {
    // API request would go here
    console.log("Resend code clicked");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-between bg-[#f3f4f6]/30 py-12 px-4 relative overflow-hidden font-sans">
        <AuthBackground />

        {/* Content Container */}
        <div className="w-full max-w-lg z-10 flex flex-col items-center my-auto">
          {/* Simplified Header */}
          <div className="text-center mb-8">
            <span className="text-3xl font-black text-brand-teal tracking-tight block mb-1">
              MuniFix Ctg
            </span>
            <p className="text-gray-500 text-sm font-medium">
              Join Chattogram's digital civic platform
            </p>
          </div>

          {/* Success Card */}
          <div className="w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-teal-50 text-brand-teal rounded-full flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Account Verified!</h2>
              <p className="text-gray-500 text-sm font-medium">
                Thank you! Your email has been verified, and portal registration is complete.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/" className="w-full block">
                <Button variant="primary" className="w-full py-3.5 flex items-center justify-center gap-2">
                  Go to Homepage
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <AuthFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc]/40 py-12 px-4 pt-28 md:pt-12 relative overflow-hidden font-sans">
      <AuthBackground />
      <AuthHeader />

      {/* Main Verification Card */}
      <div className="w-full max-w-[420px] mx-auto z-10 flex flex-col items-center my-auto">
        <div className="w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100">
          {/* Card Icon Header */}
          <div className="relative w-16 h-16 bg-teal-50 text-brand-teal rounded-full flex items-center justify-center mx-auto shadow-md mb-6">
            <Mail className="w-8 h-8" />
            <span className="absolute -bottom-1 -right-1 bg-brand-teal text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <Check className="w-3 h-3" />
            </span>
          </div>

          {/* Heading */}
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Verify your account</h2>
            <p className="text-gray-500 text-xs sm:text-sm font-semibold max-w-[280px] mx-auto leading-relaxed">
              Enter the 6-digit verification code sent to <span className="text-gray-800 break-all">{email}</span>
            </p>
          </div>

          {/* OTP Code Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <OtpInput value={otp} onChange={setOtp} />

            <ResendTimer onResend={handleResend} />

            {/* Verify Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={!isOtpComplete}
                loading={loading}
                className="w-full py-3.5 text-sm font-semibold rounded-xl"
              >
                Verify
              </Button>
            </div>
          </form>

          {/* Support Link */}
          <div className="text-center mt-6 text-xs text-gray-500 font-semibold leading-normal">
            Having trouble?{" "}
            <Link href="/support" className="text-brand-teal font-bold hover:underline ml-1">
              Contact support
            </Link>
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}

