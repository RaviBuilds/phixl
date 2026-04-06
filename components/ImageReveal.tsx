"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { StaticImageData } from "next/image";

interface ImageRevealProps {
  img1: StaticImageData;
  img2: StaticImageData;
}

export default function ImageReveal({ img1, img2 }: ImageRevealProps) {
  const numSlices1 = 100;
  const splitRef1 = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const [sliceHeight1, setSliceHeight1] = useState<number>(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const height = splitRef1.current?.offsetHeight || 640;
      setSliceHeight1(height / numSlices1);
    });

    if (splitRef1.current) {
      resizeObserver.observe(splitRef1.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!sliceHeight1 || !splitRef1.current || !scannerRef.current) return;

    const scanner = scannerRef.current;
    const spans = splitRef1.current.querySelectorAll("span");
    const total = spans.length;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    // Top to bottom — fade out
    for (let i = 0; i < total; i++) {
      const y = i * sliceHeight1;

      tl.to(scanner, {
        y: y,
        duration: 0,
      });

      tl.to(spans[i], {
        opacity: 0,
        duration: 0.05,
        ease: "none",
      });
    }

    // Pause
    tl.to({}, { duration: 2 });

    // Bottom to top — fade in
    for (let i = total - 1; i >= 0; i--) {
      const y = i * sliceHeight1;

      tl.to(scanner, {
        y: y,
        duration: 0,
      });

      tl.to(spans[i], {
        opacity: 1,
        duration: 0.05,
        ease: "none",
      });
    }

    return () => {
      tl.kill(); // important: destroy previous timeline on re-run
    };
  }, [sliceHeight1]);

  return (
    <div
      className="relative mx-auto! my-5 aspect-square w-4/5 max-w-[640px] overflow-hidden rounded-[15px] border-4 border-black bg-cover bg-center bg-no-repeat px-6 shadow-[0_0_40px_15px_#ff00994b] md:px-0"
      style={{ backgroundImage: `url(${img1.src})` }}
    >
      <div
        ref={splitRef1}
        className="absolute left-0 top-0 grid h-full w-full grid-rows-[repeat(100,1fr)]"
      >
        {Array.from({ length: numSlices1 }, (_, i) => (
          <span
            key={i}
            className="m-0 block h-full w-full border-none bg-[length:100%_10000%] bg-no-repeat p-0 opacity-100"
            style={{
              backgroundImage: `url(${img2.src})`,
              backgroundPosition: `0 -${i * sliceHeight1}px`,
            }}
          />
        ))}
      </div>

      <div
        ref={scannerRef}
        className="pointer-events-none absolute left-0 top-0 z-[5] h-1 w-full translate-y-0 bg-gradient-to-r from-[#050a14] via-white to-[#050a14] opacity-60 will-change-transform"
      ></div>
    </div>
  );
}
