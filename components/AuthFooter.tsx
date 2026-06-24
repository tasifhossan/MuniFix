"use client";

import React from "react";
import Link from "next/link";

export default function AuthFooter() {
  return (
    <footer className="w-full max-w-md text-center mx-auto mt-12 z-10 text-xs text-gray-400 font-semibold space-y-3">
      <div className="flex justify-center space-x-6 mb-2">
        <Link href="/privacy" className="hover:text-brand-teal transition-colors">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-brand-teal transition-colors">
          Terms of Service
        </Link>
        <a
          href="https://ccc.gov.bd"
          target="_blank"
          rel="noreferrer"
          className="hover:text-brand-teal transition-colors"
        >
          Chattogram City Corporation
        </a>
      </div>
      <span>&copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</span>
    </footer>
  );
}
