"use client";

import React, { useState } from "react";
import { ShieldAlert, Shield, Laptop, AlertCircle } from "lucide-react";
import Input from "./Input";
import Button from "./Button";

interface SecurityAccessCardProps {
  initialSessionsCount: number;
  onUpdatePassword: (currentPass: string, newPass: string) => Promise<void> | void;
  onLogoutOtherDevices: () => Promise<void> | void;
}

export default function SecurityAccessCard({
  initialSessionsCount,
  onUpdatePassword,
  onLogoutOtherDevices,
}: SecurityAccessCardProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [sessionsCount, setSessionsCount] = useState(initialSessionsCount);
  const [loggingOutSessions, setLoggingOutSessions] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError("All password fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setPassError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError("New password and confirm password do not match");
      return;
    }
    
    setUpdatingPassword(true);
    setPassError("");
    setPassSuccess(false);

    try {
      await onUpdatePassword(currentPassword, newPassword);
      setPassSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPassSuccess(false), 5000);
    } catch (err: any) {
      setPassError(err.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogoutSessions = async () => {
    setLoggingOutSessions(true);
    try {
      await onLogoutOtherDevices();
      setSessionsCount(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingOutSessions(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full transition-all duration-350 hover:shadow-md space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-50 select-none">
        <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 stroke-[2.2]" />
        </div>
        <h3 className="text-sm font-bold text-slate-850 tracking-tight">
          Security & Access
        </h3>
      </div>

      {/* Change Password Card Block */}
      <div className="bg-indigo-50/20 border border-indigo-100/30 rounded-2xl p-5">
        <div className="mb-4 select-none">
          <h4 className="text-xs font-bold text-slate-800 mb-0.5">
            Change Password
          </h4>
          <p className="text-[11px] font-medium text-slate-500">
            Choose a strong password to protect your account.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-white"
            />
            
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white"
            />

            <Button
              type="submit"
              variant="primary"
              loading={updatingPassword}
              className="w-full py-3 h-[46px] select-none text-xs"
            >
              Update Password
            </Button>
          </div>

          {passError && (
            <div className="flex items-center space-x-1 text-red-505 text-[10px] font-bold mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          {passSuccess && (
            <div className="flex items-center space-x-1 text-emerald-605 text-[10px] font-bold mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Password updated successfully!</span>
            </div>
          )}
        </form>
      </div>

      {/* Active Sessions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-2xl bg-white">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0 mt-0.5">
            <Laptop className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-0.5">
              Active Sessions
            </h4>
            <p className="text-[11px] font-medium text-slate-500 leading-normal">
              You are currently logged in on {sessionsCount} {sessionsCount === 1 ? "device" : "devices"}.
            </p>
          </div>
        </div>

        {sessionsCount > 1 && (
          <button
            onClick={handleLogoutSessions}
            disabled={loggingOutSessions}
            className="border border-red-200 text-red-600 hover:bg-red-50/50 font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 transform select-none active:scale-[0.98] outline-none disabled:opacity-50 disabled:transform-none cursor-pointer"
          >
            {loggingOutSessions ? "Logging Out..." : "Log Out All Other Devices"}
          </button>
        )}
      </div>
    </div>
  );
}
