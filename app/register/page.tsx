"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Mail,
  Lock,
  User,
  Smartphone,
  ArrowRight
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requirements = [
    { label: "At least 8 characters", val: formData.password.length >= 8 },
    { label: "Contains a number", val: /\D*\d/.test(formData.password) },
    { label: "Contains capital letter", val: /[A-Z]/.test(formData.password) },
    { label: "Contains special character", val: /[^A-Za-z0-9]/.test(formData.password) }
  ];

  useEffect(() => {
    let score = 0;
    if (formData.password.length >= 8) score++;
    if (/\D*\d/.test(formData.password)) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/[^A-Za-z0-9]/.test(formData.password)) score++;
    setPasswordStrength(score);
  }, [formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordStrength < 3) return;
    if (formData.password !== formData.confirmPassword) return;
    if (!formData.agreeTerms) return;

    setLoading(true);
    setError(null);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "citizen"
      });
      router.push("/verify?email=" + encodeURIComponent(formData.email));
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
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

        {/* Inline Error Message */}
        {error && (
          <div className="p-3 bg-red-50 text-red-650 rounded-xl text-xs font-semibold text-center border border-red-100 mb-5 animate-fade-in">
            {error}
          </div>
        )}

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <Input
              label="Mobile Number"
              name="phone"
              type="tel"
              required
              placeholder="01XXXXXXXXX"
              value={formData.phone}
              onChange={handleInputChange}
              icon={<Smartphone className="w-4 h-4" />}
            />
          </div>

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
                !formData.phone ||
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
