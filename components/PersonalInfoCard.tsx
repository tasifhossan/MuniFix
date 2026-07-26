"use client";

import React, { useState } from "react";
import { User, Edit2, Check, X } from "lucide-react";
import Input from "./Input";
import Button from "./Button";

interface PersonalInfoData {
  fullName: string;
  emailAddress: string;
  mobileNumber: string;
  nidCard: string;
  primaryAddress: string;
}

interface PersonalInfoCardProps {
  initialData: PersonalInfoData;
  onSave: (data: PersonalInfoData) => Promise<void> | void;
}

export default function PersonalInfoCard({
  initialData,
  onSave,
}: PersonalInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PersonalInfoData>({ ...initialData });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({ ...initialData });
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full transition-all duration-350 hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-50 select-none">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-brand-teal/10 text-brand-teal rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="text-sm font-bold text-slate-850 tracking-tight">
            Personal Information
          </h3>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-teal hover:text-brand-teal-hover transition-colors cursor-pointer select-none"
          >
            <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={!isEditing ? "opacity-95" : ""}
            style={!isEditing ? { backgroundColor: "#f8fafc" } : {}}
          />

          {/* Email Address */}
          <Input
            label="Email Address"
            name="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={!isEditing ? "opacity-95" : ""}
            style={!isEditing ? { backgroundColor: "#f8fafc" } : {}}
          />

          {/* Mobile Number */}
          <Input
            label="Mobile Number"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={!isEditing ? "opacity-95" : ""}
            style={!isEditing ? { backgroundColor: "#f8fafc" } : {}}
          />

          {/* NID / Smart Card No */}
          <Input
            label="NID / Smart Card No."
            name="nidCard"
            value={formData.nidCard}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={!isEditing ? "opacity-95" : ""}
            style={!isEditing ? { backgroundColor: "#f8fafc" } : {}}
          />
        </div>

        {/* Primary Address */}
        <div className="space-y-1.5 w-full">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Primary Address (Wali-e-Bari)
          </label>
          <textarea
            name="primaryAddress"
            value={formData.primaryAddress}
            onChange={handleInputChange}
            disabled={!isEditing}
            rows={3}
            className={`w-full px-4 py-3 rounded-xl border border-gray-250 focus:border-brand-teal text-sm focus:outline-none transition-all text-gray-800 placeholder-gray-400 bg-white resize-none ${
              !isEditing ? "opacity-95 text-gray-700 bg-slate-50 cursor-not-allowed" : "focus:ring-2 focus:ring-brand-teal/20"
            }`}
            style={!isEditing ? { backgroundColor: "#f8fafc" } : {}}
          />
        </div>

        {/* Action Buttons (visible only in editing mode) */}
        {isEditing && (
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-50 select-none">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-4.5 py-2 text-xs"
              disabled={loading}
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={loading}
              className="px-4.5 py-2 text-xs"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
