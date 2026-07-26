"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Lock,
  LogIn,
  ShieldCheck,
  ChevronRight,
  Landmark
} from "lucide-react";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    rememberMe: false
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const isFormValid = formData.emailOrUsername && formData.password;

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-between bg-[#f8fafc]/40 py-12 px-4 relative overflow-hidden font-sans">
        {/* Ambient blurred backdrop shapes */}
        <div className="absolute top-[-10%] left-[-15%] w-[450px] sm:w-[500px] h-[450px] sm:h-[500px] bg-teal-100/30 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[550px] sm:w-[600px] h-[550px] sm:h-[600px] bg-amber-100/25 rounded-full blur-[120px] sm:blur-[150px] pointer-events-none" />

        {/* Content Container */}
        <div className="w-full max-w-lg z-10 flex flex-col items-center my-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-3xl font-black text-brand-teal tracking-tight block mb-1">
              MuniFix Ctg
            </span>
            <p className="text-gray-500 text-sm font-medium">
              Join Chattogram's digital civic platform
            </p>
          </div>

          {/* Success Card */}
          <div className="w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100/80 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-teal-50 text-brand-teal rounded-full flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Signed In Successfully!</h2>
              <p className="text-gray-500 text-sm font-medium">
                Welcome back! Redirecting you to the MuniFix Ctg dashboard...
              </p>
            </div>

            <div className="pt-2">
              <Link href="/" className="w-full block">
                <Button variant="primary" className="w-full py-3.5 flex items-center justify-center gap-2">
                  Go to Home Screen
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-md text-center mt-12 z-10 text-xs text-gray-400 font-semibold uppercase tracking-widest">
          Powered by CCC Digital Division
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc]/40 py-12 px-4 pt-28 md:pt-12 relative overflow-hidden font-sans">
      {/* Ambient blurred backdrop shapes */}
      <div className="absolute top-[-10%] left-[-15%] w-[450px] sm:w-[500px] h-[450px] sm:h-[500px] bg-teal-100/30 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[550px] sm:w-[600px] h-[550px] sm:h-[600px] bg-amber-100/25 rounded-full blur-[120px] sm:blur-[150px] pointer-events-none" />

      {/* Top Left Logo */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center space-x-2.5 z-10">
        <div className="w-9 h-9 bg-brand-teal text-white rounded-xl flex items-center justify-center shadow-md shadow-brand-teal/15">
          <Landmark className="w-5 h-5 fill-current" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-brand-teal select-none">
          MuniFix Ctg
        </span>
      </div>

      {/* Content Container */}
      <div className="w-full max-w-[450px] mx-auto z-10 flex flex-col items-center my-auto">
        {/* Form Card */}
        <div className="w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100/80">
          <div className="text-center space-y-1.5 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 text-xs sm:text-sm font-semibold max-w-[280px] mx-auto leading-relaxed">
              Access your municipal portal to manage complaints
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email or Username"
              name="emailOrUsername"
              required
              placeholder="Enter your credentials"
              value={formData.emailOrUsername}
              onChange={handleInputChange}
              icon={<User className="w-4.5 h-4.5" />}
            />

            <div className="space-y-1.5 w-full">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-brand-teal font-bold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                icon={<Lock className="w-4.5 h-4.5" />}
              />
            </div>

            {/* Remember Me Checkbox */}
            <label className="flex items-center space-x-2 text-xs text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="rounded border-gray-305 text-brand-teal focus:ring-brand-teal w-4 h-4"
              />
              <span className="font-semibold">Remember Me</span>
            </label>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                loading={loading}
                disabled={!isFormValid}
                className="w-full py-4 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                Sign In
                <LogIn className="w-4.5 h-4.5" />
              </Button>
            </div>
          </form>

          {/* Portal Access Divider */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">
              Portal Access
            </span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {/* Register Link */}
          <div className="text-center mt-2 text-xs text-gray-500 font-semibold leading-normal">
            Don't have an account?{" "}
            <Link href="/register" className="text-brand-teal font-bold hover:underline ml-1">
              Register as a Citizen
            </Link>
          </div>
        </div>
      </div>

      {/* Powered By Footer */}
      <footer className="w-full max-w-md text-center mx-auto mt-12 z-10 text-[9.5px] text-gray-400 font-bold uppercase tracking-widest select-none">
        Powered by CCC Digital Division
      </footer>
    </div>
  );
}
