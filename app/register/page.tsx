"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Mail,
  Lock,
  User,
  MapPin,
  Building,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Sparkles
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";

export default function RegisterPage() {
  const [role, setRole] = useState<"citizen" | "official">("citizen");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    ward: "",
    department: "",
    employeeId: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const requirements = [
    { label: "At least 8 characters", val: formData.password.length >= 8 },
    { label: "Contains a number", val: /\D*\d/.test(formData.password) },
    { label: "Contains capital letter", val: /[A-Z]/.test(formData.password) },
    { label: "Contains special character", val: /[^A-Za-z0-9]/.test(formData.password) }
  ];

  const passwordStrength = requirements.filter((req) => req.val).length;

  const wards = [
    { value: 1, label: "Ward 1 - South Pahartali" },
    { value: 2, label: "Ward 2 - Jalalabad" },
    { value: 3, label: "Ward 3 - Panchlaish" },
    { value: 4, label: "Ward 4 - Chandgaon" },
    { value: 7, label: "Ward 7 - West Shulukbahar" },
    { value: 8, label: "Ward 8 - Shulukbahar" },
    { value: 15, label: "Ward 15 - Chawkbazar" },
    { value: 16, label: "Ward 16 - Sulakbahar" },
    { value: 20, label: "Ward 20 - Dewan Bazar" },
    { value: 21, label: "Ward 21 - Jamal Khan" },
    { value: 22, label: "Ward 22 - Enayet Bazar" },
    { value: 24, label: "Ward 24 - North Agrabad" },
    { value: 27, label: "Ward 27 - South Agrabad" },
    { value: 31, label: "Ward 31 - Alkaran" },
    { value: 32, label: "Ward 32 - Pathantooly" },
    { value: 41, label: "Ward 41 - South Patenga" }
  ];

  const departments = [
    { value: "Waste Management", label: "Waste Management" },
    { value: "Engineering / Roads", label: "Engineering & Roads" },
    { value: "Water & Sewerage", label: "Water & Sewerage" },
    { value: "Public Health", label: "Public Health" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordStrength < 3) return;
    if (formData.password !== formData.confirmPassword) return;
    if (!formData.agreeTerms) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  // Right column visual sidebar bullet items
  const sidebarExtraContent = (
    <div className="space-y-4 pt-4">
      <div className="flex items-start space-x-3.5">
        <div className="w-8 h-8 rounded-lg bg-teal-800/40 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-brand-teal-light" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-white">Quick Issue Upload</h4>
          <p className="text-teal-200/70 text-xs">Post photos & geolocations in under 60 seconds.</p>
        </div>
      </div>
      <div className="flex items-start space-x-3.5">
        <div className="w-8 h-8 rounded-lg bg-teal-800/40 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-brand-teal-light" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-white">Ward Level Routing</h4>
          <p className="text-teal-200/70 text-xs">Direct assignments to your local ward office.</p>
        </div>
      </div>
      <div className="flex items-start space-x-3.5">
        <div className="w-8 h-8 rounded-lg bg-teal-800/40 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-brand-teal-light" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-white">Transparent Updates</h4>
          <p className="text-teal-200/70 text-xs">SMS & live updates as work progresses.</p>
        </div>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-brand-cyan-bg rounded-full flex items-center justify-center text-brand-cyan-text mx-auto shadow-md">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Registration Successful!</h2>
            <p className="text-gray-500 text-sm">
              Your MuniFix Ctg account has been successfully created. Welcome aboard, citizen!
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 space-y-3">
            <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-brand-orange" /> Account details
            </div>
            <div className="text-sm space-y-1 text-gray-600">
              <p><span className="font-semibold text-gray-700">Name:</span> {formData.name}</p>
              <p><span className="font-semibold text-gray-700">Email:</span> {formData.email}</p>
              {role === "citizen" ? (
                <p><span className="font-semibold text-gray-700">Ward Assigned:</span> Ward {formData.ward}</p>
              ) : (
                <p><span className="font-semibold text-gray-700">Department:</span> {formData.department}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <Link href="/" className="w-full block">
              <Button variant="primary" className="w-full py-3.5">
                Go to Home Screen
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout
      sidebarTitle="Transform Chattogram One Report at a Time"
      sidebarSubtitle="Connect directly with local ward councillors and civic officials to resolve infrastructure issues."
      sidebarBadge="Empowering Civic Tech"
      sidebarExtra={sidebarExtraContent}
    >
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-100 border border-gray-100/60 relative">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Create Account</h3>
          <p className="text-sm text-gray-500">
            Already registered?{" "}
            <Link href="/login" className="text-brand-teal font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

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
            Citizen Sign Up
          </button>
          <button
            onClick={() => setRole("official")}
            className={`py-2 text-center text-sm font-semibold rounded-lg transition-all duration-200 ${
              role === "official"
                ? "bg-white text-brand-teal shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Official Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            name="name"
            required
            placeholder="e.g. Tanvir Rahman"
            value={formData.name}
            onChange={handleInputChange}
            icon={<User className="w-4 h-4" />}
          />

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

          {/* Conditional dropdown based on user role selection */}
          {role === "citizen" ? (
            <Select
              label="Ward Number (Chattogram)"
              name="ward"
              required
              value={formData.ward}
              onChange={handleInputChange}
              placeholder="Select your ward"
              options={wards}
              icon={<MapPin className="w-4 h-4" />}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Department"
                name="department"
                required
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Select dept"
                options={departments}
                icon={<Building className="w-4 h-4" />}
              />
              <Input
                label="Employee ID"
                name="employeeId"
                required
                placeholder="e.g. CCC-9876"
                value={formData.employeeId}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Input
              label="Password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              icon={<Lock className="w-4 h-4" />}
            />

            {/* Strength meter */}
            {formData.password.length > 0 && (
              <div className="space-y-2 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-500">Security strength:</span>
                  <span
                    className={`font-bold ${
                      passwordStrength <= 1
                        ? "text-red-500"
                        : passwordStrength === 2
                        ? "text-amber-500"
                        : "text-emerald-500"
                    }`}
                  >
                    {passwordStrength <= 1 ? "Weak" : passwordStrength === 2 ? "Moderate" : "Strong"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        step <= passwordStrength
                          ? passwordStrength <= 1
                            ? "bg-red-500"
                            : passwordStrength === 2
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                {/* Requirements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 pt-1 border-t border-slate-100 mt-2">
                  {requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 text-[10.5px]">
                      {req.val ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      )}
                      <span className={req.val ? "text-gray-500 line-through" : "text-gray-400"}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            icon={<Lock className="w-4 h-4" />}
            error={
              formData.confirmPassword && formData.password !== formData.confirmPassword
                ? "Passwords do not match."
                : undefined
            }
          />

          {/* Agree Terms Checkbox */}
          <label className="flex items-start space-x-2.5 text-xs text-gray-500 cursor-pointer pt-1">
            <input
              type="checkbox"
              name="agreeTerms"
              required
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="mt-0.5 rounded border-gray-300 text-brand-teal focus:ring-brand-teal"
            />
            <span className="leading-normal font-semibold">
              I agree to the MuniFix Ctg{" "}
              <Link href="/terms" className="text-brand-teal hover:underline font-bold">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-brand-teal hover:underline font-bold">
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
              disabled={
                !formData.name ||
                !formData.email ||
                (role === "citizen" ? !formData.ward : (!formData.department || !formData.employeeId)) ||
                passwordStrength < 3 ||
                formData.password !== formData.confirmPassword ||
                !formData.agreeTerms
              }
              className="w-full py-4 text-sm font-semibold rounded-xl"
            >
              Register Account <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
