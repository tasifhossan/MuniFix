"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  Activity
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<"citizen" | "official">("citizen");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const success = params.get("success");
      if (success) {
        setSuccessMsg(success);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await login(formData.email, formData.password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Right column visual sidebar extra content
  const sidebarExtraContent = (
    <div className="bg-teal-900/30 border border-teal-850 p-6 rounded-2xl space-y-4 max-w-sm backdrop-blur-sm">
      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal-light">Platform Status</h4>
      <div className="flex justify-between text-sm">
        <span className="text-teal-200/80">Wards Active:</span>
        <span className="font-bold text-white">41 / 41</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-teal-200/80">Active Reports:</span>
        <span className="font-bold text-white flex items-center">
          <Activity className="w-3.5 h-3.5 mr-1 text-brand-orange animate-pulse" /> 184 Resolved today
        </span>
      </div>
    </div>
  );

  return (
    <AuthLayout
      sidebarTitle="Monitor Municipal Fixes in Real-Time"
      sidebarSubtitle="Log in to review progress on your submitted complaints, upvote local reports, or dispatch work orders."
      sidebarBadge="Welcome Back"
      sidebarExtra={sidebarExtraContent}
    >
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-100 border border-gray-100/60 relative">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Sign In</h3>
          <p className="text-sm text-gray-500">
            New to MuniFix Ctg?{" "}
            <Link href="/register" className="text-brand-teal font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        {/* Inline Success Message */}
        {successMsg && (
          <div className="p-3 bg-green-50 text-green-700 rounded-xl text-xs font-semibold text-center border border-green-100 mb-5 animate-fade-in">
            {successMsg}
          </div>
        )}

        {/* Inline Error Message */}
        {error && (
          <div className="p-3 bg-red-50 text-red-650 rounded-xl text-xs font-semibold text-center border border-red-100 mb-5 animate-fade-in">
            {error}
          </div>
        )}

        {/* Role switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl mb-6">
          <button
            onClick={() => setRole("citizen")}
            className={`py-2 text-center text-sm font-semibold rounded-lg transition-all duration-200 ${
              role === "citizen"
                ? "bg-white text-brand-teal shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Citizen Login
          </button>
          <button
            onClick={() => setRole("official")}
            className={`py-2 text-center text-sm font-semibold rounded-lg transition-all duration-200 ${
              role === "official"
                ? "bg-white text-brand-teal shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Official Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            name="email"
            type="email"
            required
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleInputChange}
            icon={<Mail className="w-4 h-4" />}
          />

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Password</label>
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
              icon={<Lock className="w-4 h-4" />}
            />
          </div>

          {/* Remember Me Checkbox */}
          <label className="flex items-center space-x-2 text-xs text-gray-500 cursor-pointer pt-1">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-brand-teal focus:ring-brand-teal"
            />
            <span className="font-semibold select-none">Remember my device</span>
          </label>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              loading={loading}
              disabled={!formData.email || !formData.password}
              className="w-full py-4 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
