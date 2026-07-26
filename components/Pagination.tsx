"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];

  // Generate page numbers helper
  // For simplicity, we can mock the exact structure in the screenshot: 1, 2, 3, "...", 12
  // Or write a clean algorithm that renders them dynamically.
  // Let's write a simple layout matching the screenshot:
  // Current: 1. Pages: 1, 2, 3, ..., 12
  const renderPageButtons = () => {
    const buttons = [];
    
    // Add Page 1, 2, 3
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold border transition-all duration-200 select-none ${
            currentPage === i
              ? "bg-brand-teal border-brand-teal text-white shadow-md shadow-brand-teal/10"
              : "bg-white border-gray-200 text-gray-600 hover:border-brand-teal hover:text-brand-teal"
          }`}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis if total pages is large
    if (totalPages > 4) {
      buttons.push(
        <span key="ellipsis" className="text-gray-400 font-medium px-1 flex items-end pb-2.5">
          ...
        </span>
      );
      
      // Add last page (12)
      buttons.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold border transition-all duration-200 select-none ${
            currentPage === totalPages
              ? "bg-brand-teal border-brand-teal text-white shadow-md shadow-brand-teal/10"
              : "bg-white border-gray-200 text-gray-600 hover:border-brand-teal hover:text-brand-teal"
          }`}
        >
          {totalPages}
        </button>
      );
    } else if (totalPages === 4) {
      buttons.push(
        <button
          key={4}
          onClick={() => onPageChange(4)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold border transition-all duration-200 select-none ${
            currentPage === 4
              ? "bg-brand-teal border-brand-teal text-white"
              : "bg-white border-gray-200 text-gray-600 hover:border-brand-teal hover:text-brand-teal"
          }`}
        >
          4
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8 py-4">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-brand-teal hover:text-brand-teal disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600 disabled:cursor-not-allowed transition-all duration-200 select-none"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
      </button>

      {/* Page Numbers */}
      {renderPageButtons()}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-brand-teal hover:text-brand-teal disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600 disabled:cursor-not-allowed transition-all duration-200 select-none"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5 stroke-[2.5px]" />
      </button>
    </div>
  );
}
