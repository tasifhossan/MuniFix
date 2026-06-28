"use client";

import React, { useState } from "react";
import { Check, Camera } from "lucide-react";

interface WorkerActionCenterProps {
  initialStatus?: "In Progress" | "Assigned" | "Resolved";
  onUpdate?: (data: { status: string; notes: string }) => void;
  lastSyncText?: string;
}

export default function WorkerActionCenter({
  initialStatus = "In Progress",
  onUpdate,
  lastSyncText = "Last sync: 2 minutes ago",
}: WorkerActionCenterProps) {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onUpdate) {
        onUpdate({ status, notes });
      }
      alert(`Task status successfully updated to "${status}"!`);
    }, 1000);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm flex flex-col font-sans shrink-0 w-full lg:w-80 xl:w-96">
      {/* Dark Teal Action Header */}
      <div className="bg-brand-teal text-white p-5 flex flex-col gap-1 shrink-0">
        <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
          Action Center
        </h3>
        <p className="text-[10px] sm:text-xs font-semibold text-teal-100/90 leading-relaxed">
          Update progress and submit resolution proof.
        </p>
      </div>

      {/* Action Center Form Body */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 flex-1 flex flex-col">
        {/* Dropdown status update */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">
            Update Status
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-teal text-gray-800 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%25236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat cursor-pointer transition-all duration-200"
            >
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Action resolution notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">
            Resolution Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the actions taken or reason for delay..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal bg-white text-gray-800 placeholder-gray-450 font-medium resize-none min-h-[110px] transition-all duration-200"
          />
        </div>

        {/* Proof of Work Photo Upload block */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">
            Proof of Work (Photos)
          </label>
          <div className="border-2 border-dashed border-slate-200 hover:border-brand-teal/50 rounded-xl p-6 text-center cursor-pointer bg-slate-50/30 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-2 group">
            <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
              <Camera className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-700 block">
                Upload Photos
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                JPG, PNG up to 10MB
              </span>
            </div>
          </div>
        </div>

        {/* Submit update triggers */}
        <div className="pt-2 mt-auto space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-brand-teal/10 hover:shadow-brand-teal/20 select-none active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4.5 h-4.5 stroke-[2.5]" />
            <span>{isSubmitting ? "Updating..." : "Update Task"}</span>
          </button>
          
          {lastSyncText && (
            <span className="text-[10px] font-black text-gray-400 text-center block tracking-wide uppercase">
              {lastSyncText}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
