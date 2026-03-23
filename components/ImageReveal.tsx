"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "@/app/imageReveal.css";
import { StaticImageData } from "next/image";

// define the props

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
    <div className="wrapper1" style={{ backgroundImage: `url(${img1.src})` }}>
      <div className="split1" ref={splitRef1}>
        {Array.from({ length: numSlices1 }, (_, i) => (
          <span
            key={i}
            style={{
              backgroundImage: `url(${img2.src})`,
              backgroundPosition: `0 -${i * sliceHeight1}px`,
            }}
          />
        ))}
      </div>

      <div className="scanner-line1 vertical1" ref={scannerRef}></div>
    </div>
  );
}
