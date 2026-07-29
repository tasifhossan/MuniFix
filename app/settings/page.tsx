"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DashboardFooter from "@/components/DashboardFooter";
import LoadingScreen from "@/components/LoadingScreen";

// Import custom reusable components
import ProfileSummaryCard from "@/components/ProfileSummaryCard";
import SecurityStatusCard from "@/components/SecurityStatusCard";
import PersonalInfoCard from "@/components/PersonalInfoCard";
import SecurityAccessCard from "@/components/SecurityAccessCard";
import NotificationSettingsCard from "@/components/NotificationSettingsCard";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("settings");

  // Mock initial data matching the design screenshot
  const [userProfile, setUserProfile] = useState({
    fullName: "Abrar Ahmed",
    emailAddress: "abrar.ahmed@ctg-gov.bd",
    mobileNumber: "+880 1712-345678",
    nidCard: "**** •••• 8942",
    primaryAddress: "House 42, Road 7, Sector 2, Nasirabad Housing Society, Chattogram 4209, Bangladesh.",
  });

  // Mock notification settings
  const [notifications, setNotifications] = useState({
    complaintUpdates: true,
    newsAlerts: false,
  });

  useEffect(() => {
    // Simulate a premium page loading effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleProfileSave = async (updatedData: typeof userProfile) => {
    // Simulate API request to update profile
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUserProfile(updatedData);
        resolve();
      }, 1000);
    });
  };

  const handleUpdatePassword = async (currentPass: string, newPass: string) => {
    // Simulate API request to update password
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (currentPass === "wrong") {
          reject(new Error("Current password is incorrect."));
        } else {
          resolve();
        }
      }, 1000);
    });
  };

  const handleLogoutOtherDevices = async () => {
    // Simulate API request to terminate other sessions
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  // TODO: backend endpoint not implemented yet
  const handleNotificationToggle = (key: string, enabled: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: enabled,
    }));
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // User details object for navigation header
  const headerUser = {
    name: userProfile.fullName,
    avatar: "/ahmed-avatar.png", // using restored user avatar image
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

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Profile & Status Card) */}
            <div className="lg:col-span-1 space-y-6">
              <ProfileSummaryCard
                name={userProfile.fullName}
                avatar="/ahmed-avatar.png"
                verified={true}
                filedCount={12}
                resolvedCount={9}
                points={2450}
                level={4}
              />
              {/* TODO: backend endpoint not implemented yet */}
              <SecurityStatusCard
                twoFactorEnabled={true}
                lastLogin="2h ago"
              />
            </div>

            {/* Right Column (Editable Cards & Notification settings) */}
            <div className="lg:col-span-2 space-y-6">
              <PersonalInfoCard
                initialData={userProfile}
                onSave={handleProfileSave}
              />
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
    </div>
  );
}
