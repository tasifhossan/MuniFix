"use client";

import React from "react";
import Link from "next/link";
import { Landmark } from "lucide-react";

interface AuthHeaderProps {
  showNav?: boolean;
}

export default function AuthHeader({ showNav = true }: AuthHeaderProps) {
  return (
    <header className="absolute top-0 inset-x-0 h-20 flex items-center justify-between px-6 md:px-12 z-10">
      <Link href="/" className="flex items-center space-x-2.5">
        <div className="w-9 h-9 bg-brand-teal text-white rounded-xl flex items-center justify-center shadow-md shadow-brand-teal/15">
          <Landmark className="w-5 h-5 fill-current" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-brand-teal select-none">
          MuniFix Ctg
        </span>
      </Link>
      {showNav && (
        <nav className="flex space-x-6 text-sm font-semibold text-gray-500">
          <Link href="/#how-it-works" className="hover:text-brand-teal transition-colors">
            How it Works
          </Link>
          <Link href="/#about" className="hover:text-brand-teal transition-colors">
            About
          </Link>
        </nav>
      )}
    </header>
  );
}
