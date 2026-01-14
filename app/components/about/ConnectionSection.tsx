// app/components/about/ConnectionSection.tsx
"use client";

import { ArrowRight, Target, Zap, ExternalLink } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { useLanguage } from "@/app/contexts/LanguageContext";
import Link from "next/link";

// Type definitions
type ConnectionData = {
  title?: string;
  highlightedTitle?: string;
  hitekDroneText?: string;
  description?: string[];
  vision?: string;
  cta?: {
    services?: {
      text?: string;
    };
  };
  additionalInfo?: string;
};

const ConnectionSection = () => {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);

  // Helper function to safely get string
  const getString = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Helper function to parse connection data
  const parseConnectionData = (): ConnectionData => {
    const data = t("about.connection");
    
    if (typeof data !== 'object' || data === null) {
      return {};
    }
    
    const obj = data as Record<string, unknown>;
    
    const parseDescription = (): string[] => {
      const desc = obj.description;
      if (!Array.isArray(desc)) return [];
      return desc.map(item => getString(item));
    };
    
    const parseCta = () => {
      const cta = obj.cta;
      if (typeof cta !== 'object' || cta === null) {
        return {};
      }
      
      const ctaObj = cta as Record<string, unknown>;
      const services = ctaObj.services;
      
      if (typeof services !== 'object' || services === null) {
        return {};
      }
      
      const servicesObj = services as Record<string, unknown>;
      return {
        services: {
          text: getString(servicesObj.text),
        },
      };
    };
    
    return {
      title: getString(obj.title),
      highlightedTitle: getString(obj.highlightedTitle),
      hitekDroneText: getString(obj.hitekDroneText),
      description: parseDescription(),
      vision: getString(obj.vision),
      cta: parseCta(),
      additionalInfo: getString(obj.additionalInfo),
    };
  };

  // Lấy dữ liệu từ translation
  const connectionData = parseConnectionData();
  const description = connectionData.description || [];

  // Hiệu ứng line dọc
  useEffect(() => {
    const interval = setInterval(() => {
      setLineHeight((prev) => (prev === 0 ? 24 : 0));
    }, 100); // 2 giây thay đổi một lần

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={ref}
      className="py-20 bg-greywhite"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            {/* Header */}
            <div className="mb-8">
              {/* Dòng 1: Title */}
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                {connectionData.title}
              </h2>
              
              {/* Dòng 2: highlightedTitle & hitekDroneText - KHÔNG XUỐNG DÒNG */}
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-1 whitespace-nowrap">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-red-400">
                  {connectionData.highlightedTitle}
                </span>
                <span className="text-foreground">
                  {" "}& {connectionData.hitekDroneText}
                </span>
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-6 mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {description[0]}{" "}
                <span className="font-semibold text-foreground">
                  {description[1]}
                </span>{" "}
                {description[2]}{" "}
                <span className="font-semibold text-primary">
                  {description[3]}
                </span>{" "}
                {description[4]}
              </p>
            </div>

            {/* Vision Statement với line dọc animation */}
            <div className="relative mb-8">
              <div className="flex items-start">
                {/* Line dọc với hiệu ứng */}
                <div className="relative mr-6">
                  <div 
                    className="w-2 bg-linear-to-b from-red-600 to-red-400 rounded-full transition-all duration-1000 ease-in-out"
                    style={{ height: `${24 + lineHeight}px` }}
                  />
                  {/* Dot animation */}
                  <div 
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full animate-pulse"
                    style={{ animationDuration: '2s' }}
                  />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground leading-relaxed">
                    {connectionData.vision}
                  </p>
                  {/* Additional Info */}
                  {connectionData.additionalInfo && (
                    <p className="text-sm text-muted-foreground mt-4 italic">
                      {connectionData.additionalInfo}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services">
                <Button className="bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {connectionData.cta?.services?.text}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </Link>

              <a
                href="https://hitekdrone.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Hitek Drone Website"
                className="block"
              >
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 font-semibold px-6 py-3 rounded-full shadow-lg w-full sm:w-auto bg-white hover:bg-white hover:text-red-600"
                >
                  <span className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Website: Hitek Drone
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </Button>
              </a>
            </div>
          </div>

          {/* Right Column - Video */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Video Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-red-200">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full max-w-175 h-auto object-cover"
                  poster="https://hitekdrone.com/wp-content/uploads/2024/07/video-web-hitek-480p.mp4?thumbnail=1"
                  title="Hitek Flycam Introduction Video"
                  aria-label="Hitek Flycam company introduction video"
                >
                  <source 
                    src="https://hitekdrone.com/wp-content/uploads/2024/07/video-web-hitek-480p.mp4" 
                    type="video/mp4" 
                  />
                  Your browser does not support the video tag.
                </video>
                
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectionSection;