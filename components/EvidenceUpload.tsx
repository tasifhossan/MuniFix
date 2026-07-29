import React, { useState, useRef } from "react";
import { X, Camera } from "lucide-react";

interface EvidenceUploadProps {
  onFileSelect?: (file: File | null) => void;
  onFilesSelect?: (files: File[]) => void;
}

export default function EvidenceUpload({ onFileSelect, onFilesSelect }: EvidenceUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
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

  const processFiles = (newFiles: FileList | File[]) => {
    const validFiles: File[] = [];
    const urls: string[] = [];

    const currentTotal = selectedFiles.length;
    const slotsLeft = 6 - currentTotal;
    
    let filesArray = Array.from(newFiles).filter(f => f.type.startsWith("image/"));
    if (filesArray.length > slotsLeft) {
      alert(`You can only upload up to 6 images. Only the first ${slotsLeft} images were added.`);
      filesArray = filesArray.slice(0, slotsLeft);
    }

    filesArray.forEach((file) => {
      validFiles.push(file);
      urls.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      const updatedFiles = [...selectedFiles, ...validFiles];
      const updatedUrls = [...previewUrls, ...urls];
      setSelectedFiles(updatedFiles);
      setPreviewUrls(updatedUrls);
      
      onFilesSelect?.(updatedFiles);
      if (updatedFiles.length > 0) {
        onFileSelect?.(updatedFiles[0]);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (idxToRemove: number) => {
    URL.revokeObjectURL(previewUrls[idxToRemove]);

    const updatedFiles = selectedFiles.filter((_, idx) => idx !== idxToRemove);
    const updatedUrls = previewUrls.filter((_, idx) => idx !== idxToRemove);

    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedUrls);

    onFilesSelect?.(updatedFiles);
    onFileSelect?.(updatedFiles[0] || null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">
        Evidence Photos
      </label>

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-200 aspect-video group bg-slate-50">
              <img
                src={url}
                alt={`Evidence preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-full shadow-lg transition-all duration-200 cursor-pointer"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4 stroke-[2.5px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length < 6 ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`relative rounded-3xl border-2 border-dashed flex flex-col items-center justify-center py-8 px-4 cursor-pointer transition-all duration-300 select-none ${
            dragActive
              ? "border-[#005c55] bg-teal-50/30 scale-[0.99]"
              : "border-gray-200 hover:border-[#005c55]/50 hover:bg-slate-50/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
          
          <div className="p-3 bg-slate-100 text-gray-500 rounded-full mb-3">
            <Camera className="w-6 h-6 text-[#005c55]/80" />
          </div>

          <p className="text-sm font-bold text-gray-700 text-center">
            Upload evidence photos ({selectedFiles.length}/6)
          </p>
          <p className="text-xs text-gray-400 font-semibold text-center mt-1">
            Drag & drop images here, or click to browse (Max 5MB each)
          </p>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 text-[#005c55] text-xs font-bold rounded-2xl text-center border border-emerald-100 select-none">
          Maximum of 6 images reached. Remove an image to upload another.
        </div>
      )}
    </div>
  );
}
