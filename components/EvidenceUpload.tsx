"use client";

import React, { useState, useRef } from "react";
import { ImagePlus, X, UploadCloud, Camera } from "lucide-react";

interface EvidenceUploadProps {
  onFileSelect?: (file: File | null) => void;
}

export default function EvidenceUpload({ onFileSelect }: EvidenceUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect?.(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onFileSelect?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">
        Evidence Photos
      </label>

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 aspect-[2/1] sm:aspect-[3/1] bg-slate-50 group">
          <img
            src={previewUrl}
            alt="Evidence preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-200"
              aria-label="Remove image"
            >
              <X className="w-5 h-5 stroke-[2.5px]" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`relative rounded-3xl border-2 border-dashed flex flex-col items-center justify-center py-10 px-4 cursor-pointer transition-all duration-300 select-none ${
            dragActive
              ? "border-brand-teal bg-teal-50/30 scale-[0.99]"
              : "border-gray-200 hover:border-brand-teal/50 hover:bg-slate-50/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
          
          <div className="p-4 bg-slate-100 text-gray-500 rounded-full mb-4 transition-colors group-hover:bg-teal-50 group-hover:text-brand-teal">
            <Camera className="w-8 h-8 text-brand-teal/80" />
          </div>

          <p className="text-sm font-bold text-gray-700 text-center">
            Drag & drop images here
          </p>
          <p className="text-xs text-gray-400 font-semibold text-center mt-1">
            or click to browse from your device (Max 10MB)
          </p>
        </div>
      )}
    </div>
  );
}
