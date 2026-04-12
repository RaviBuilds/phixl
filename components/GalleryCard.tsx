"use client";

import { ZoomIn, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { deleteImageAction } from "@/actions/deleteImageAction";

interface GalleryCardProps {
  publicUrl: string;
  id: string; // Needed for deletion
  imagePath: string; // Needed for storage deletion
}

export default function GalleryCard({
  publicUrl,
  id,
  imagePath,
}: GalleryCardProps): React.ReactElement {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // TODO: Create a handleAction function here that calls a new Server Action (deleteImageAction)
  const handleAction =()=>{
    console.log("hello");
   const response =  deleteImageAction({publicUrl, id, imagePath});

  }
  // Inside that function, wrap the server action call in startTransition()

  return (
    <>
      {/* --- Zoom Modal (Rendered outside the card layout to prevent z-index issues) --- */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out p-4"
        >
          <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
            <Image
              src={publicUrl}
              alt="Zoomed Restored Image"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* --- Main Card Layout --- */}
      <div className="relative group overflow-hidden rounded-xl bg-gray-900 border border-gray-800 shadow-lg aspect-square">
        {/* Background Image */}
        <Image
          src={publicUrl}
          alt="Restored"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Overlay with Action Buttons */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
          <button
            onClick={() => setIsZoomed(true)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors"
            title="View Fullsize"
          >
            <ZoomIn size={24} />
          </button>

          <button
            onClick={() => handleAction()}
            disabled={isPending}
            className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-300 hover:text-red-100 backdrop-blur-sm transition-colors disabled:opacity-50 hover:z-500"
            title="Delete Image"
          >
            {isPending ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <Trash2 size={24} />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
