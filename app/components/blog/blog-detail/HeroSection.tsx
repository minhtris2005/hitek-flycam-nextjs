'use client';

import React from "react";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import Image from "next/image";

interface HeroSectionProps {
  image?: string;
  title: string;
  subtitle?: string;
  category?: string;
  date?: string;
  author?: string;
  className?: string;
  priority?: boolean;
}

export const HeroSection = ({ 
  image, 
  title, 
  subtitle,
  category,
  date,
  author,
  className = "",
  priority = false
}: HeroSectionProps) => {
  const router = useRouter();
  const { t } = useLanguage();

  // Xác định ngôn ngữ hiển thị
  const displayLanguage = t("lang") === 'vi' ? 'vi' : 'en';

  const handleBack = () => {
    router.push("/blog");
    // Hoặc router.back() nếu muốn quay lại trang trước
    // router.back();
  };

  // Nếu không có image, có thể render một fallback
  if (!image) {
    return (
      <div className={`bg-linear-to-r from-primary/10 to-primary/5 rounded-xl p-8 mb-8 ${className}`}>
        <div className="container mx-auto">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {displayLanguage === 'vi' ? 'Quay lại' : 'Back'}
          </Button>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-xl text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-100 md:h-125 w-full ${className}`}>
      {/* Background Image with Next.js Image component */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority={priority}
          sizes="100vw"
          quality={85}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0">
        <div className="container mx-auto h-full px-4 md:px-6">
          <div className="h-full flex flex-col justify-end pb-8">
            {/* Back Button */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {displayLanguage === 'vi' ? 'Quay lại blog' : 'Back to blog'}
              </Button>
            </div>

            {/* Metadata */}
            {(category || date || author) && (
              <div className="flex flex-wrap items-center gap-3 mb-4 text-white/80 text-sm">
                {category && (
                  <span className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    {category}
                  </span>
                )}
                {date && (
                  <span>{new Date(date).toLocaleDateString()}</span>
                )}
                {author && (
                  <span className="flex items-center gap-1">
                    <span>•</span>
                    {displayLanguage === 'vi' ? 'Bởi' : 'By'} {author}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};