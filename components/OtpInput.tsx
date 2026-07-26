"use client";

import React, { useRef } from "react";

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
}

export default function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, index: number) => {
    // Only allow digits
    if (val && !/^\d$/.test(val)) return;

    const newOtp = [...value];
    newOtp[index] = val;
    onChange(newOtp);

    // Auto-focus next input box
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...value];
      if (!value[index] && index > 0) {
        // Clear previous input and focus it
        newOtp[index - 1] = "";
        onChange(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        newOtp[index] = "";
        onChange(newOtp);
      }
    }
  };

  // Support pasting full digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const regex = new RegExp(`^\\d{${length}}$`);
    if (regex.test(text)) {
      const digits = text.split("").slice(0, length);
      onChange(digits);
      // Focus last input
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <div onPaste={handlePaste} className="flex gap-2.5 sm:gap-3 justify-center mb-6">
      {value.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-10 h-12 sm:w-11 sm:h-13 text-center text-xl font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all text-gray-850 placeholder-gray-400 bg-slate-50/50"
        />
      ))}
    </div>
  );
}
