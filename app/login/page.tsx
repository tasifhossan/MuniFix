"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
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
      const role = await login(formData.email, formData.password);
      if (role === "citizen") {
        router.push("/dashboard/citizen");
      } else if (role === "field_worker") {
        router.push("/dashboard/worker");
      } else if (role === "dept_admin") {
        router.push("/dashboard/admin");
      } else if (role === "super_admin") {
        router.push("/dashboard/superadmin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center justify-between p-6 md:p-8 font-sans relative overflow-hidden">
      
      {/* Decorative background shapes for extra premium feel */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#005c55]/5 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Top Left Logo */}
      <div className="w-full max-w-[1200px] flex items-center justify-start z-10 self-center">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-[#005c55] rounded-xl flex items-center justify-center shadow-md shadow-[#005c55]/15 transition-transform group-hover:scale-105">
            <Building2 className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="text-lg font-black text-[#005c55] tracking-tight">
            MuniFix Ctg
          </span>
        </Link>
      </div>

      {/* Card Centered Container */}
      <div className="w-full max-w-[420px] bg-white rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-slate-200/60 border border-slate-100/80 z-10 my-auto">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
            Access your municipal portal to manage complaints
          </p>
        </div>

        {/* Inline Success Message */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold text-center border border-emerald-100/50 mb-5 animate-fade-in">
            {successMsg}
          </div>
        )}

        {/* Inline Error Message */}
        {error && (
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold text-center border border-rose-100/50 mb-5 animate-fade-in flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input field */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 tracking-wide block">
              Email or Username
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your credentials"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005c55] focus:bg-white focus:ring-1 focus:ring-[#005c55] transition-all"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-600 tracking-wide block">
                Password
              </label>
              <Link 
                href="/forgot-password" 
                className="text-xs font-extrabold text-[#005c55] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005c55] focus:bg-white focus:ring-1 focus:ring-[#005c55] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="rounded border-slate-300 text-[#005c55] focus:ring-[#005c55] w-4 h-4 cursor-pointer"
            />
            <span className="font-extrabold select-none">Remember Me</span>
          </label>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full bg-[#005c55] hover:bg-[#004540] text-white text-sm font-bold py-3.5 rounded-2xl shadow-md shadow-[#005c55]/10 hover:shadow-[#005c55]/20 transition-all select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Separator line */}
        <div className="relative flex items-center justify-center my-6 select-none">
          <div className="absolute w-full border-t border-slate-150" />
          <span className="relative px-3 bg-white text-[10px] font-black text-slate-400 tracking-widest uppercase">
            Portal Access
          </span>
        </div>

        {/* Register link */}
        <div className="text-center text-xs font-semibold text-slate-500">
          Don't have an account?{" "}
          <Link 
            href="/register" 
            className="font-bold text-[#005c55] hover:underline"
          >
            Register as a Citizen
          </Link>
        </div>
      </div>

      {/* Footer text */}
      <div className="w-full text-center py-4 select-none z-10">
        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
          Powered by CCC Digital Division
        </span>
      </div>

    </div>
  );
}
