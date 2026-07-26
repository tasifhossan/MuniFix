"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Calendar, X, Check } from "lucide-react";

interface FilterBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: {
    category: string;
    priority: string;
    status: string;
    date: string;
  }) => void;
  onClearAll: () => void;
}

export default function FilterBar({ onSearch, onFilterChange, onClearAll }: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    category: "",
    priority: "",
    status: "",
    date: "",
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const categories = [
    { value: "waste", label: "Waste Management" },
    { value: "roads", label: "Engineering / Roads" },
    { value: "water", label: "Water & Sewerage" },
    { value: "lighting", label: "Street Lighting" },
  ];

  const priorities = [
    { value: "critical", label: "Critical" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const statuses = [
    { value: "in progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "pending approval", label: "Pending Approval" },
    { value: "dispatched", label: "Dispatched" },
  ];

  const dates = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "Last 30 Days" },
  ];

  const toggleDropdown = (name: string) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  const handleSelectFilter = (name: keyof typeof activeFilters, value: string) => {
    const updated = { ...activeFilters, [name]: activeFilters[name] === value ? "" : value };
    setActiveFilters(updated);
    onFilterChange(updated);
    setOpenDropdown(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    const cleared = { category: "", priority: "", status: "", date: "" };
    setActiveFilters(cleared);
    setSearchQuery("");
    onClearAll();
    setOpenDropdown(null);
  };

  const renderDropdown = (
    name: keyof typeof activeFilters,
    label: string,
    options: { value: string; label: string }[],
    isDate = false
  ) => {
    const isOpen = openDropdown === name;
    const selectedValue = activeFilters[name];
    const selectedOption = options.find((opt) => opt.value === selectedValue);

    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown(name)}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold select-none transition-all duration-200 ${
            selectedValue
              ? "bg-teal-50 text-brand-teal border border-brand-teal/20"
              : "bg-slate-100 hover:bg-slate-200/80 text-gray-700"
          }`}
        >
          {isDate && <Calendar className="w-4 h-4 text-gray-500 mr-1" />}
          <span>{selectedOption ? selectedOption.label : label}</span>
          <ChevronDown className="w-4 h-4 opacity-70" />
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 p-2 animate-fade-in animate-duration-150">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelectFilter(name, opt.value)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-left"
              >
                <span>{opt.label}</span>
                {selectedValue === opt.value && (
                  <Check className="w-4 h-4 text-brand-teal stroke-[3px]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const hasAnyFilter = Object.values(activeFilters).some(Boolean) || searchQuery;

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3 w-full">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none w-5 h-5 my-auto" />
          <input
            type="text"
            placeholder="Search complaints by description or location..."
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              onSearch(val);
            }}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-brand-teal bg-white transition-all text-gray-800 placeholder-gray-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                onSearch("");
              }}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-brand-teal text-white text-sm font-bold px-8 py-3.5 rounded-2xl hover:bg-brand-teal-hover transition-all duration-300 shadow-md shadow-brand-teal/10 hover:shadow-brand-teal/20 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-black text-gray-500 uppercase tracking-widest mr-1">
          Filter by:
        </span>

        {renderDropdown("category", "Category", categories)}
        {renderDropdown("priority", "Priority", priorities)}
        {renderDropdown("status", "Status", statuses)}
        {renderDropdown("date", "Date", dates, true)}

        {hasAnyFilter && (
          <>
            <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden sm:block" />
            <button
              onClick={handleClear}
              className="text-sm font-bold text-teal-600 hover:text-brand-teal hover:underline px-2 py-1 rounded transition-all"
            >
              Clear all
            </button>
          </>
        )}
      </div>
    </div>
  );
}
