"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform select-none active:scale-[0.98] outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary:
      "bg-brand-teal text-white hover:bg-brand-teal-hover shadow-lg shadow-brand-teal/10 hover:shadow-brand-teal/20 focus:ring-brand-teal/40 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:transform-none",
    secondary:
      "bg-brand-orange text-white hover:bg-amber-600 shadow-lg shadow-brand-orange/10 hover:shadow-brand-orange/20 focus:ring-brand-orange/40 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:transform-none",
    outline:
      "border border-gray-300 text-brand-teal bg-white hover:bg-teal-50/30 hover:border-brand-teal focus:ring-brand-teal/40 disabled:border-gray-200 disabled:text-gray-300 disabled:bg-white disabled:transform-none",
    dark:
      "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 focus:ring-slate-900/40 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:transform-none"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
