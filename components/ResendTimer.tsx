"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface ResendTimerProps {
  initialSeconds?: number;
  onResend: () => void;
}

export default function ResendTimer({ initialSeconds = 119, onResend }: ResendTimerProps) {
  const [timer, setTimer] = useState(initialSeconds);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleResendClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (timer > 0) return;
    setTimer(initialSeconds);
    onResend();
  };

  return (
    <div className="text-center text-xs space-y-2 font-semibold">
      <div className="flex items-center justify-center space-x-1.5 text-gray-400">
        <Clock className="w-3.5 h-3.5" />
        <span>Resend code in {formatTimer()}</span>
      </div>
      <button
        onClick={handleResendClick}
        disabled={timer > 0}
        className={`transition-colors py-1 px-3 rounded-lg ${
          timer > 0
            ? "text-gray-300 cursor-not-allowed"
            : "text-brand-teal hover:text-brand-teal-hover cursor-pointer"
        }`}
      >
        Resend code
      </button>
    </div>
  );
}
