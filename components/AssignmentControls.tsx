"use client";

import React, { useState } from "react";
import { UserCheck, CheckSquare, Search, Filter } from "lucide-react";

interface AssignmentControlsProps {
  selectedCount: number;
  onAssign?: (worker: string) => void;
  onSearchChange?: (val: string) => void;
  onFilterClick?: () => void;
}

export default function AssignmentControls({
  selectedCount = 0,
  onAssign,
  onSearchChange,
  onFilterClick,
}: AssignmentControlsProps) {
  const [selectedWorker, setSelectedWorker] = useState("");
  const [searchVal, setSearchVal] = useState("");

  const handleWorkerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWorker(e.target.value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCount > 0 && selectedWorker && onAssign) {
      onAssign(selectedWorker);
      alert(`Bulk assigned ${selectedCount} complaints to ${selectedWorker}!`);
      setSelectedWorker("");
    }
  };

  const isAssignActive = selectedCount > 0 && selectedWorker !== "";

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-150 p-5 shadow-sm space-y-4.5 font-sans">
      
      {/* Assignment Selection Toolbar */}
      <form onSubmit={handleAssignSubmit} className="flex flex-wrap items-center gap-4">
        
        {/* Selected count indicator */}
        <div className={`inline-flex items-center gap-1.5 px-4 py-2.5 border rounded-xl text-xs font-bold transition-all duration-200 select-none ${
          selectedCount > 0
            ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
            : "bg-slate-50 border-slate-200 text-slate-500"
        }`}>
          <CheckSquare className="w-4 h-4 stroke-[2.2]" />
          <span>{selectedCount} Selected</span>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block h-6 w-[1px] bg-slate-200" />

        {/* Worker assignment dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={selectedWorker}
            onChange={handleWorkerChange}
            className="w-full sm:w-64 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-gray-700 font-semibold focus:outline-none focus:border-brand-teal appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%25236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat cursor-pointer transition-all duration-200"
          >
            <option value="">Select Worker for Assignment</option>
            <option value="Abul Hossain (Zone 04)">Abul Hossain (Zone 04)</option>
            <option value="Ahmed Khan (Zone 15)">Ahmed Khan (Zone 15)</option>
            <option value="Karim Ali (Zone 08)">Karim Ali (Zone 08)</option>
          </select>
        </div>

        {/* Bulk Assign Action Button */}
        <button
          type="submit"
          disabled={!isAssignActive}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all duration-200 select-none ${
            isAssignActive
              ? "bg-brand-teal hover:bg-brand-teal-hover text-white shadow-md shadow-brand-teal/10 hover:shadow-brand-teal/20 cursor-pointer active:scale-[0.98]"
              : "bg-[#82a3a1] text-white opacity-85 cursor-not-allowed"
          }`}
        >
          <UserCheck className="w-4 h-4 stroke-[2.2]" />
          <span>Bulk Assign</span>
        </button>

      </form>

      {/* Filter and Search controls */}
      <div className="flex items-center gap-3">
        {/* Search input field */}
        <div className="relative w-full max-w-[280px]">
          <Search className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none w-4.5 h-4.5 my-auto" />
          <input
            type="text"
            value={searchVal}
            onChange={handleSearch}
            placeholder="Search complaints..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal bg-white text-gray-800 placeholder-gray-400 shadow-inner"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={onFilterClick}
          className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-brand-teal rounded-xl transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <Filter className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

    </div>
  );
}
