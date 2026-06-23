"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export default function Input({
  label,
  icon,
  error,
  type = "text",
  name,
  className = "",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const finalType = isPassword ? (showPassword ? "text" : "password") : type;

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
        <input
          type={finalType}
          name={name}
          className={`w-full ${
            icon ? "pl-10" : "px-4"
          } ${
            isPassword ? "pr-10" : "pr-4"
          } py-3 rounded-xl border ${
            error ? "border-red-500 focus:border-red-500" : "border-gray-250 focus:border-brand-teal"
          } text-sm focus:outline-none transition-all text-gray-800 placeholder-gray-400 bg-white`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 mt-1">{error}</p>}
    </div>
  );
}
