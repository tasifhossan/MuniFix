"use client";

import React, { useState } from "react";
import { X, Info } from "lucide-react";

interface AssignWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaintId: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  category: string;
  location: string;
  onConfirm: (worker: string) => void;
}

export default function AssignWorkerModal({
  isOpen,
  onClose,
  complaintId,
  priority,
  category,
  location,
  onConfirm,
}: AssignWorkerModalProps) {
  const [selectedWorker, setSelectedWorker] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm(selectedWorker);
      setSelectedWorker("");
      onClose();
    }, 1200);
  };

  // Styles for Priority badges inside details box
  const priorityBadgeStyles = {
    Critical: "bg-red-50 text-red-650 border-red-100",
    High: "bg-red-50 text-red-650 border-red-100", // GEC light red style
    Medium: "bg-amber-50 text-amber-700 border-amber-100",
    Low: "bg-slate-50 text-slate-500 border-slate-200",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card wrapper */}
      <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100/80 max-w-[440px] w-full z-10 animate-scale-up overflow-hidden flex flex-col font-sans">
        
        {/* Top Header Row */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-tight">
              Assign Field Worker
            </h3>
            <p className="text-xxs sm:text-xs font-semibold text-gray-450 block -mt-0.5">
              Directing complaint to available personnel
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-650 rounded-xl transition-all cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmSubmit} className="flex-1 flex flex-col">
          {/* Main content body */}
          <div className="p-6 space-y-5">
            
            {/* Complaint Info details box */}
            <div className="bg-[#f8fafc] border border-slate-150 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 text-left relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                    Complaint ID
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight leading-tight block mt-0.5">
                    #{complaintId}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border select-none ${priorityBadgeStyles[priority]}`}>
                  {priority} Priority
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-black text-gray-450 uppercase tracking-widest block mb-0.5">
                    Category
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {category}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-gray-455 uppercase tracking-widest block mb-0.5">
                    Location
                  </span>
                  <span className="text-xs font-bold text-slate-700 line-clamp-2">
                    {location}
                  </span>
                </div>
              </div>
            </div>

            {/* Dropdown selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">
                Search and Assign Field Worker
              </label>
              <div className="relative">
                <select
                  value={selectedWorker}
                  onChange={(e) => setSelectedWorker(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-teal text-gray-800 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%25236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat cursor-pointer transition-all duration-200"
                >
                  <option value="">Select an available worker...</option>
                  <option value="Abul Hossain (Zone 04)">Abul Hossain (Zone 04) - Online</option>
                  <option value="Ahmed Khan (Zone 15)">Ahmed Khan (Zone 15) - Online</option>
                  <option value="Karim Ali (Zone 08)">Karim Ali (Zone 08) - Busy</option>
                </select>
              </div>
            </div>

            {/* Push notification instructions */}
            <div className="bg-blue-50/60 border border-blue-100/50 rounded-2xl p-4 flex gap-3 text-left">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 stroke-[2.2]" />
              <p className="text-xs font-semibold text-blue-700 leading-normal">
                Selected worker will receive a push notification on their MuniFix Field app and must acknowledge the assignment within 15 minutes.
              </p>
            </div>

          </div>

          {/* Action buttons footer */}
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-650 text-xs font-bold px-5 py-3 rounded-xl transition-all cursor-pointer select-none active:scale-[0.98]"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={!selectedWorker || isSubmitting}
              className={`text-xs font-bold px-5 py-3 rounded-xl transition-all select-none active:scale-[0.98] ${
                selectedWorker && !isSubmitting
                  ? "bg-brand-teal hover:bg-brand-teal-hover text-white shadow-md shadow-brand-teal/10 hover:shadow-brand-teal/20 cursor-pointer"
                  : "bg-[#7a9d9b] text-white opacity-85 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Assigning..." : "Confirm Assignment"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
