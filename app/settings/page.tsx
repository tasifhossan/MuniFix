"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DashboardFooter from "@/components/DashboardFooter";
import LoadingScreen from "@/components/LoadingScreen";
import { fetchMyProfile, updateMyProfile, changeMyPassword, uploadMyAvatar } from "@/lib/api";

// Import custom reusable components
import ProfileSummaryCard from "@/components/ProfileSummaryCard";
import SecurityStatusCard from "@/components/SecurityStatusCard";
import PersonalInfoCard from "@/components/PersonalInfoCard";
import SecurityAccessCard from "@/components/SecurityAccessCard";
import NotificationSettingsCard from "@/components/NotificationSettingsCard";

export interface UserProfile {
  fullName: string;
  emailAddress: string;
  mobileNumber: string;
  nidCard: string;
  primaryAddress: string;
  avatarUrl?: string;
}

export default function SettingsPage() {
  const [profileLoading, setProfileLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [activeNav, setActiveNav] = useState("settings");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Notification settings (persisted in localStorage fallback)
  const [notifications, setNotifications] = useState({
    complaintUpdates: true,
    newsAlerts: false,
  });

  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadProfile = async () => {
    setProfileLoading(true);
    setError(null);
    try {
      const res = await fetchMyProfile();
      const p = res.profile ?? res.user ?? res;
      
      const userProfileData: UserProfile = {
        fullName: p.name || "",
        emailAddress: p.email || "",
        mobileNumber: p.phone || "",
        nidCard: p.nid || "N/A",
        primaryAddress: p.address || "No primary address registered.",
        avatarUrl: p.avatar_url || undefined,
      };
      
      setProfile(userProfileData);
    } catch (err: any) {
      setError(err.message || "Failed to load profile settings.");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();

    // Load notification preferences from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("munifix_notification_prefs");
      if (stored) {
        try {
          setNotifications(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const handleProfileSave = async (updatedData: UserProfile) => {
    setSaveLoading(true);
    setSuccessMessage(null);
    setError(null);
    try {
      const res = await updateMyProfile({
        name: updatedData.fullName,
        phone: updatedData.mobileNumber,
      });
      const p = res.profile ?? res.user ?? res;
      
      const savedProfile: UserProfile = {
        fullName: p.name || "",
        emailAddress: p.email || "",
        mobileNumber: p.phone || "",
        nidCard: p.nid || "N/A",
        primaryAddress: p.address || "No primary address registered.",
        avatarUrl: p.avatar_url || undefined,
      };
      
      setProfile(savedProfile);
      setSuccessMessage("Profile saved successfully.");
      triggerToast("Profile saved successfully!", "success");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      triggerToast(err.message || "Failed to update profile", "error");
      throw err;
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAvatarChange = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await uploadMyAvatar(fd);
      if (res.success) {
        triggerToast("Avatar updated successfully!", "success");
        loadProfile();
      }
    } catch (err: any) {
      triggerToast(err.message || "Failed to upload avatar", "error");
    }
  };

  const handleUpdatePassword = async (currentPass: string, newPass: string) => {
    setPasswordLoading(true);
    setSuccessMessage(null);
    try {
      await changeMyPassword({
        currentPassword: currentPass,
        newPassword: newPass,
      });
      setSuccessMessage("Password changed successfully.");
      triggerToast("Password changed successfully!", "success");
    } catch (err: any) {
      triggerToast(err.message || "Failed to change password", "error");
      throw err;
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogoutOtherDevices = async () => {
    triggerToast("Logged out of other devices.", "success");
  };

  const handleNotificationToggle = (key: string, enabled: boolean) => {
    const updated = {
      ...notifications,
      [key]: enabled,
    };
    setNotifications(updated);
    
    // Save silently to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("munifix_notification_prefs", JSON.stringify(updated));
    }
  };

  if (profileLoading) {
    return <LoadingScreen />;
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-lg text-center max-w-md w-full space-y-4">
          <h2 className="text-red-600 font-bold text-lg">Failed to Load Profile</h2>
          <p className="text-slate-600 text-sm">{error}</p>
          <button
            onClick={loadProfile}
            className="bg-brand-teal hover:bg-brand-teal-hover text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const headerUser = {
    name: profile?.fullName || "Citizen User",
    avatar: profile?.avatarUrl || "/ahmed-avatar.png",
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Header Navigation */}
      <Navbar activeNav={activeNav} user={headerUser} />

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 space-y-8">
          {/* Page Title & Description */}
          <div className="select-none">
            <h1 className="text-2xl font-black text-slate-850 tracking-tight leading-none mb-2">
              Citizen Profile
            </h1>
            <p className="text-xs font-semibold text-slate-500 leading-normal">
              Manage your account settings and track your civic impact in Chattogram.
            </p>
          </div>

          {/* Success message banner if present */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold px-4 py-3 rounded-xl select-none">
              {successMessage}
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Profile & Status Card) */}
            <div className="lg:col-span-1 space-y-6">
              <ProfileSummaryCard
                name={profile?.fullName || "Citizen User"}
                avatar={profile?.avatarUrl || "/ahmed-avatar.png"}
                onAvatarChange={handleAvatarChange}
                verified={true}
                filedCount={12}
                resolvedCount={9}
                points={2450}
                level={4}
              />
              <SecurityStatusCard
                twoFactorEnabled={true}
                lastLogin="2h ago"
              />
            </div>

            {/* Right Column (Editable Cards & Notification settings) */}
            <div className="lg:col-span-2 space-y-6">
              {profile && (
                <PersonalInfoCard
                  initialData={profile}
                  onSave={handleProfileSave}
                />
              )}
              <SecurityAccessCard
                initialSessionsCount={2}
                onUpdatePassword={handleUpdatePassword}
                onLogoutOtherDevices={handleLogoutOtherDevices}
              />
              <NotificationSettingsCard
                initialComplaintUpdates={notifications.complaintUpdates}
                initialNewsAlerts={notifications.newsAlerts}
                onToggle={handleNotificationToggle}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Footer Section */}
      <DashboardFooter />

      {/* Floating Success Toast notification in bottom-right corner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#1e293b] text-white text-xs font-bold px-4.5 py-3 rounded-2xl shadow-xl transition-all duration-300 transform scale-100 select-none border border-slate-800">
          <div className={`w-5 h-5 ${toast.type === 'error' ? 'bg-red-500' : 'bg-[#10b981]'} text-[#1e293b] rounded-full flex items-center justify-center shadow-inner shrink-0`}>
            {toast.type === 'error' ? (
              <span className="text-white text-xs font-black">!</span>
            ) : (
              <svg className="w-3.5 h-3.5 font-bold text-[#1e293b]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-white">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
