// app/components/projects/ProjectDetail/HeroSection/index.tsx
'use client';

import React from "react";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import Image from "next/image";

interface ProjectHeroSectionProps {
  image?: string;
  title: string;
  subtitle?: string;
  category?: string;
  project_type?: string;
  location?: string;
  client?: string;
  completion_date?: string;
  area?: number;
  author?: string;
  className?: string;
  priority?: boolean;
}

export const HeroSection = ({ 
  image, 
  title,
  className = "",
  priority = false
}: ProjectHeroSectionProps) => {
  const router = useRouter();
  const { language } = useLanguage();

  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  const handleBack = () => {
    router.push("/projects");
  };

  // Nếu không có image, render fallback
  if (!image) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-gray-50 to-gray-100" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyMTQsIDMwLCAgMzUsIDAuMDUpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]" />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {displayLanguage === 'vi' ? 'Quay lại dự án' : 'Back to projects'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-96 md:h-[500px] lg:h-[600px] w-full ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority={priority}
          sizes="100vw"
          quality={90}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80" />
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTEwMCAwSDBWMTAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
      </div>

      {/* Content */}
      <div className="absolute inset-0">
        <div className="container mx-auto h-full px-4 md:px-6">
          <div className="h-full flex flex-col justify-end pb-12">
            {/* Back Button */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-white hover:bg-white/20 backdrop-blur-sm border-white/30 hover:border-white/50 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {displayLanguage === 'vi' ? 'Quay lại dự án' : 'Back to projects'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
