"use client";

import React from "react";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: React.ReactNode;
  options: Option[];
  placeholder?: string;
  error?: string;
}

export default function Select({
  label,
  icon,
  options,
  placeholder = "Select an option",
  error,
  name,
  className = "",
  value,
  ...props
}: SelectProps) {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <select
          name={name}
          value={value}
          className={`w-full ${
            icon ? "pl-10" : "px-4"
          } pr-10 py-3 rounded-xl border ${
            error ? "border-red-500 focus:border-red-500" : "border-gray-250 focus:border-brand-teal"
          } text-sm focus:outline-none bg-white transition-all text-gray-800 appearance-none`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom Dropdown arrow */}
        <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 mt-1">{error}</p>}
    </div>
  );
}
