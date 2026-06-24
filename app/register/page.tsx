"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  CreditCard,
  Smartphone,
  Mail,
  Lock,
  UserCheck,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    nid: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    if (!formData.agreeTerms) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const isFormValid =
    formData.name &&
    formData.nid &&
    formData.mobile &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    formData.agreeTerms;

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-between bg-[#f8fafc]/40 py-12 px-4 relative overflow-hidden font-sans">
        {/* Ambient blurred backdrop shapes */}
        <div className="absolute top-[-10%] left-[-15%] w-[450px] sm:w-[500px] h-[450px] sm:h-[500px] bg-teal-100/30 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[550px] sm:w-[600px] h-[550px] sm:h-[600px] bg-amber-100/25 rounded-full blur-[120px] sm:blur-[150px] pointer-events-none" />

        {/* Success Card Wrapper */}
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

          {/* Success Card Content */}
          <div className="w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100/80 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-teal-50 text-brand-teal rounded-full flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Registration Successful!</h2>
              <p className="text-gray-500 text-sm font-medium">
                Your MuniFix Ctg account has been successfully created. Welcome aboard, citizen!
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 space-y-3">
              <div className="text-sm space-y-1 text-gray-600 font-medium">
                <p>
                  <span className="font-bold text-gray-700">Name:</span> {formData.name}
                </p>
                <p>
                  <span className="font-bold text-gray-700">NID:</span> {formData.nid}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Email:</span> {formData.email}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/login" className="w-full block">
                <Button variant="primary" className="w-full py-3.5 flex items-center justify-center gap-2">
                  Go to Login Screen
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-md text-center mt-12 z-10 text-xs text-gray-400 font-semibold space-y-3">
          <span>&copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</span>
          <div className="flex justify-center space-x-6">
            <Link href="/privacy" className="hover:text-brand-teal transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-brand-teal transition-colors">
              Terms of Service
            </Link>
            <a
              href="https://ccc.gov.bd"
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-teal transition-colors"
            >
              Chattogram City Corporation
            </a>
          </div>
        </footer>
      </div>
    );
  }

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

        {/* Form Card */}
        <div className="w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100/80">
          <div className="space-y-1 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Citizen Registration</h2>
            <p className="text-gray-400 text-xs font-semibold">
              Enter your details to create your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              required
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              icon={<User className="w-4.5 h-4.5" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="National ID (NID)"
                name="nid"
                required
                placeholder="10-17 digits"
                value={formData.nid}
                onChange={handleInputChange}
                icon={<CreditCard className="w-4.5 h-4.5" />}
              />
              <Input
                label="Mobile Number"
                name="mobile"
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={formData.mobile}
                onChange={handleInputChange}
                icon={<Smartphone className="w-4.5 h-4.5" />}
              />
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              required
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              icon={<Mail className="w-4.5 h-4.5" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                icon={<Lock className="w-4.5 h-4.5" />}
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                icon={<Lock className="w-4.5 h-4.5" />}
                error={
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? "Passwords do not match."
                    : undefined
                }
              />
            </div>

            {/* Agree Terms Checkbox */}
            <label className="flex items-start space-x-2.5 text-xs text-gray-500 cursor-pointer pt-2 pb-1 select-none">
              <input
                type="checkbox"
                name="agreeTerms"
                required
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-0.5 rounded border-gray-300 text-brand-teal focus:ring-brand-teal"
              />
              <span className="leading-normal font-semibold">
                I agree to the{" "}
                <Link href="/terms" className="text-brand-teal font-bold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-brand-teal font-bold hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                loading={loading}
                disabled={!isFormValid}
                className="w-full py-4 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                Create Account
                <UserCheck className="w-4.5 h-4.5" />
              </Button>
            </div>
          </form>

          {/* Already have an account? Login */}
          <div className="text-center mt-6 text-xs text-gray-500 font-semibold">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-teal font-bold hover:underline ml-1">
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-md text-center mt-12 z-10 text-xs text-gray-400 font-semibold space-y-3">
        <span>&copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</span>
        <div className="flex justify-center space-x-6">
          <Link href="/privacy" className="hover:text-brand-teal transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-brand-teal transition-colors">
            Terms of Service
          </Link>
          <a
            href="https://ccc.gov.bd"
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand-teal transition-colors"
          >
            Chattogram City Corporation
          </a>
        </div>
      </footer>
    </div>
  );
}
