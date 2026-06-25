"use client";

import { ZoomIn, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { deleteImageAction } from "@/actions/deleteImageAction";

interface GalleryCardProps {
  publicUrl: string;
  id: string;
  imagePath: string;
}

export default function GalleryCard({
  publicUrl,
  id,
  imagePath,
}: GalleryCardProps): React.ReactElement {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // startTransition controls the isPending state automatically!
  const [isPending, startTransition] = useTransition();

  const handleAction = () => {
    // 1. Wrap the async call in startTransition so the spinner activates
    startTransition(async () => {
      // 2. Await the server action
      const response = await deleteImageAction({
        publicUrl,
        id,
        imagePath,
      });

      if (response.success) {
        console.log("Image deleted successfully");
        // We do NOT need revalidatePath here. The Server Action handles it!
      } else {
        console.error("Failed to delete image");
      }
    });
  };

  return (
    <>
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
             
            />
          </div>
        </div>
      )}

      <div className="glass-card-interactive relative group overflow-hidden shadow-lg aspect-square">
        <Image
          src={publicUrl}
          alt="Restored"
          fill
          
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
          <button
            onClick={() => setIsZoomed(true)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors"
            title="View Fullsize"
          >
            <ZoomIn size={24} />
          </button>

          <button
            onClick={handleAction} // Fixed the click handler syntax
            disabled={isPending}
            className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-300 hover:text-red-100 backdrop-blur-sm transition-colors disabled:opacity-50"
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
