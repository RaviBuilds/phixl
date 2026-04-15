"use client";
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { ArrowLeftRight } from "lucide-react";

interface ImageRevealProps {
  img1: StaticImageData; // Original
  img2: StaticImageData; // Restored
}

export default function ImageReveal({ img1, img2 }: ImageRevealProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(event.target.value));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[640px] mx-auto px-6 md:px-0">
      {/* Labels placed ABOVE the image for mobile thumb visibility */}
      <div className="flex justify-between w-full px-2 mb-3 text-[0.8rem] font-bold uppercase tracking-wider">
        <span className="text-gray-400">Original</span>
        <span className="text-red-brand-light">Restored</span>
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-[15px] border-4 border-[#1a1a24] shadow-[0_0_40px_15px_#ff009930] group select-none">
        {/* Base Image: Restored */}
        <Image
          src={img2}
          alt="Fully restored family photo"
          fill
          priority={true}
          className="object-cover pointer-events-none"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
        />

        {/* Foreground Image: Original */}
        <div
          className="absolute inset-0 z-10"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          <Image
            src={img1}
            priority={true}
            alt="Original faded and damaged photo"
            fill
            
            className="object-cover pointer-events-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
          />
        </div>

        {/* The Native HTML5 Range Input */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          aria-label="Drag to compare original and restored photo"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 touch-pan-y"
        />

        {/* THE FIX: Removed 'transition-all duration-75' so it tracks instantly */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white z-20 pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        >
          {/* Thumb Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-gray-200">
            <ArrowLeftRight className="w-5 h-5 text-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
