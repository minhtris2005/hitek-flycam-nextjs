// app/components/subService/HeroBanner.tsx
"use client";

import { ReactNode, useRef } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";

interface HeroBannerProps {
  title: string;
  subtitle: string | ReactNode;
  backgroundImage: StaticImageData;
  overlayOpacity?: number;
  overlayColor?: string;
  height?: string;
  titleSize?: string;
  subtitleSize?: string;
  imageClassName?: string;
}

export default function HeroBanner({
  title,
  subtitle,
  backgroundImage,
  overlayOpacity = 0.2,
  overlayColor = "black",
  height = "400px",
  titleSize = "text-6xl",
  subtitleSize = "text-2xl",
  imageClassName,
}: HeroBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Đảm bảo height là string có đơn vị
  const containerHeight = height.includes('px') ? height : `${parseInt(height)}px`;

  return (
   
      <div 
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height: containerHeight }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className={`object-cover ${imageClassName || ''}`}
            priority
            quality={85}
            sizes="100vw"
            style={{
              objectPosition: 'center center'
            }}
          />
        </div>

        {/* Overlay */}
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            backgroundColor: overlayColor,
            opacity: overlayOpacity 
          }} 
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-white text-center px-4 max-w-6xl mx-auto">
            <h1 className={`${titleSize} font-bold mb-4`}>{title}</h1>
            <div className={`${subtitleSize} opacity-90`}>{subtitle}</div>
          </div>
        </div>
      </div>
  );
}