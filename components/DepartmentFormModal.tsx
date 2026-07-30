"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface DepartmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
  initialName?: string;
  initialDescription?: string;
  title: string;
}

export default function DepartmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialName = "",
  initialDescription = "",
  title,
}: DepartmentFormModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
      setError(null);
    }
  }, [isOpen, initialName, initialDescription]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Department name is required.");
      return;
    }
    if (name.length > 100) {
      setError("Name must be 100 characters or less.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(name.trim(), description.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card wrapper */}
      <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100/85 max-w-[480px] w-full z-10 animate-scale-up overflow-hidden flex flex-col font-sans">
        {/* Top Header Row */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-tight">
              {title}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            disabled={isSubmitting}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-650 rounded-xl transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-650">
              {error}
            </div>
          )}

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
              Department Name *
            </label>
            <input
              type="text"
              required
              maxLength={100}
              disabled={isSubmitting}
              placeholder="e.g. Waste Management Department"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white text-slate-800 disabled:opacity-50 disabled:bg-slate-50"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              maxLength={500}
              disabled={isSubmitting}
              placeholder="Provide a brief summary of department responsibilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm resize-none bg-white text-slate-800 disabled:opacity-50 disabled:bg-slate-50"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 text-xs font-bold bg-[#005c55] hover:bg-[#004540] text-white rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-80"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Department</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
