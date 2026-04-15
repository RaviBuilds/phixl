"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  ImageIcon,
  RefreshCw,
  UploadCloud,
  X,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
// Import your new button!
import RestoreButton from "./RestoreButton";

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const currentFile = acceptedFiles[0];
      setFile(currentFile);
      const objectUrl = URL.createObjectURL(currentFile);
      setPreviewUrl(objectUrl);
      setRestoredImage(null);
      setErrorMsg(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
      },
      maxSize: 5 * 1024 * 1024, // 5MB
    });

  const clearFile = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFile(null);
    setRestoredImage(null);
    setErrorMsg(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleDownload = async () => {
    if (!restoredImage) return;
    try {
      const response = await fetch(restoredImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `restored-${file?.name || "image.png"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Download failed:", error);
      setErrorMsg(
        "Failed to download image. You can right-click the image and save it.",
      );
    }
  };

  // --- STATE 3: Restored Image View ---
  if (restoredImage && previewUrl) {
    return (
      <div className="w-full mt-4 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-blue-low-200 border border-gray-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between shadow-custom">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="bg-green-500/20 p-3 rounded-full">
              <CheckCircle className="text-green-500 w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="text-color-white-fresh font-bold text-lg">
                Image restored successfully!
              </h3>
              <p className="text-color-gray text-sm">
                Your image is ready to download.
              </p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="bg-red-brand hover:bg-red-brand-light text-color-white-fresh px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 drop-shadow-[0px_0px_1px_#fff]"
          >
            <Download className="w-5 h-5" />
            Download Image
          </button>
        </div>

        <div className="w-full max-w-2xl text-left mb-3">
          <h4 className="text-color-white-low text-sm font-bold uppercase tracking-wider">
            Result Preview
          </h4>
        </div>

        <div className="w-full max-w-2xl rounded-2xl overflow-hidden border-2 border-gray-800 shadow-custom">
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage src={previewUrl} alt="Original Image" />
            }
            itemTwo={
              <ReactCompareSliderImage
                src={restoredImage}
                alt="Restored Image"
              />
            }
          />
        </div>

        <button
          onClick={(e) => clearFile(e)}
          className="mt-8 flex items-center gap-2 bg-blue-low-200 hover:bg-gray-700 text-color-white-fresh px-6 py-3 rounded-full font-bold transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          Restore Another Image
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      {errorMsg && (
        <div className="w-full mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
          <p className="text-red-200 text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {/* --- STATE 1: Dropzone View --- */}
      {!previewUrl ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 md:p-24 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ease-in-out
        ${isDragActive ? "border-red-brand bg-red-brand/15" : "border-gray-700 hover:border-gray-500 hover:bg-blue-low-200"}
        ${isDragReject ? "border-red-500 bg-red-500/10" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <UploadCloud className="text-red-brand w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-color-white-fresh mb-2">
            {isDragActive
              ? "Drop image here..."
              : "Click or drag image to upload"}
          </h3>
          <p className="text-sm text-color-gray">
            Supports JPG, PNG, and WebP (Max 5MB)
          </p>
        </div>
      ) : (
        /* --- STATE 2: File Selected View --- */
        <div className="bg-blue-low-200 border border-gray-800 rounded-2xl p-6 flex flex-col items-center">
          <div className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden border border-gray-700 mb-6 bg-black-background">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain"
            />
            <button
              onClick={clearFile}
              className="absolute top-3 right-3 bg-black/60 hover:bg-red-500 text-color-white p-2 rounded-full transition-colors backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-row items-center justify-between w-full max-w-md bg-black-background p-4 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <ImageIcon className="text-red-brand w-5 h-5 flex-shrink-0" />
              <span className="text-sm text-color-white-low truncate">
                {file?.name}
              </span>
            </div>

            {/* The Decoupled Restore Button */}
            {file && (
              <RestoreButton
                file={file}
                onSuccess={(url) => setRestoredImage(url)}
                onError={(msg) => setErrorMsg(msg)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
