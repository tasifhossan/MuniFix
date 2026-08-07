"use client";

import React, { useState, useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import WorkerSidebar from "@/components/WorkerSidebar";
import WorkerHeader from "@/components/WorkerHeader";
import { fetchMyProfile } from "@/lib/api";

export default function WorkerSettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Settings form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const profileData = await fetchMyProfile();
        setProfile(profileData.user ?? profileData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    setUpdatingPassword(true);
    try {
      const token = localStorage.getItem("munifix_authtoken");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_BASE_URL}/my/password`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setPasswordSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      <WorkerSidebar activeNav="settings" />

      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <main className="px-6 sm:px-8 py-6 space-y-8 flex-1">
          <WorkerHeader />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-[#005c55] animate-spin" />
              <p className="text-slate-500 text-sm font-bold">Loading settings...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <AlertTriangle className="w-10 h-10 text-red-400" />
              <p className="text-slate-700 font-bold text-sm">Failed to load profile settings</p>
              <p className="text-slate-400 text-xs max-w-xs">{error}</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-150 p-6 sm:p-8 shadow-sm max-w-2xl space-y-8">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Account Settings</h3>
                <p className="text-gray-500 text-xs font-semibold mt-0.5">Manage your worker account credentials and profile settings.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Full Name</span>
                  <span className="text-sm font-black text-gray-800">{profile?.name || "Field Worker"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Email Address</span>
                  <span className="text-sm font-black text-gray-800">{profile?.email || "worker@munifix.gov"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Role / Department</span>
                  <span className="text-sm font-black text-gray-800">Field Worker / {profile?.department_name || "Operations"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Status</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50 block w-max">Active on Duty</span>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <h4 className="text-sm font-black text-gray-850 tracking-tight">Change Password</h4>
                  <p className="text-gray-400 text-[10px] font-semibold mt-0.5">Update your password regularly to secure operations.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-gray-800 placeholder-gray-400 shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-gray-800 placeholder-gray-400 shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-gray-800 placeholder-gray-400 shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {passwordError && (
                  <p className="text-red-500 text-xs font-semibold">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-emerald-600 text-xs font-semibold">{passwordSuccess}</p>
                )}

                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all select-none active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  {updatingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{updatingPassword ? "Updating..." : "Update Password"}</span>
                </button>
              </form>
            </div>
          )}
        </main>

        <footer className="bg-slate-100/50 border-t border-slate-200/60 py-6 px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-4">
          <span>&copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#departments" className="hover:text-brand-teal transition-colors">Departments</a>
            <a href="/privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-brand-teal transition-colors">Terms of Service</a>
            <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-brand-teal transition-colors">
              Chattogram City Corporation
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
