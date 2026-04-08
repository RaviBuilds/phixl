"use client";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  console.log("FILE =>", file);
  console.log("FILE Name =>", file?.name);
  console.log("FILE Name split =>", file?.name.split("."));
  const dddd = file?.name.split(".").pop();
  console.log("DDDD =>", dddd);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Accepted files=>", acceptedFiles);
    if (acceptedFiles.length > 0) {
      const currentFile = acceptedFiles[0];
      setFile(currentFile);

      //create a temporary file preview url:
      const objectUrl = URL.createObjectURL(currentFile);
      setPreviewUrl(objectUrl);
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
      maxSize: 5 * 1024 * 1024, // this sets the 5mb limit
    });

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleRestore = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const supabase = createClient();

      //get the user logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not athenticated.");

      // create a unique file path: [user_id]/[random_number].[extension]
      const fileExit = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExit}`;
      const filePath = `${user.id}/${fileName}`;

      // upload it to supabase storage

      const { data, error } = await supabase.storage
        .from("restoration_images")
        .upload(filePath, file);

        if(error) throw error;
        console.log("Upload succesfull! Storage path:", data.path);
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload please try again!!");
    }
    finally{
        setIsUploading(false);
    }
  };

  return (
    <div className="w-full mt-4">
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
            <button
              onClick={handleRestore}
              disabled={isUploading}
              className="bg-red-brand hover:bg-red-brand-light text-color-white-fresh px-6 py-2 rounded-full font-bold text-sm transition-all drop-shadow-[0px_0px_1px_#fff] whitespace-nowrap ml-4 flex items-center justify-center"
            >
              {isUploading ? (<><Loader2 className="w-4 h-4 animate-spin" />Uploading....</>):("Restore Image")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
