'use client';

import React from "react";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import Image from "next/image";

interface NewsHeroSectionProps {
  image?: string;
  title: string;
  subtitle?: string;
  category?: string;
  date?: string;
  author?: string;
  tags?: string[];
  source?: string;
  is_featured?: boolean;
  className?: string;
  priority?: boolean;
}

export const NewsHeroSection = ({ 
  image, 
  title, 
  subtitle,
  category,
  date,
  author,
  tags = [],
  source,
  is_featured = false,
  className = "",
  priority = false
}: NewsHeroSectionProps) => {
  const router = useRouter();
  const { language } = useLanguage();

  // Xác định ngôn ngữ hiển thị
  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  const handleBack = () => {
    router.push("/news");
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Nếu không có image, render fallback
  if (!image) {
    return (
      <div className={`relative ${className}`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800" />
        <div className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3Ccircle cx='11' cy='11' r='1'/%3E%3C/g%3E%3C/svg%3E")]`} />
        
        <div className="relative container mx-auto px-4 py-16">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-8 hover:bg-white/10 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {displayLanguage === 'vi' ? 'Quay lại tin tức' : 'Back to news'}
          </Button>
          
          {/* Featured badge */}
          {is_featured && (
            <div className="mb-4 inline-flex items-center px-4 py-2 bg-yellow-500 text-yellow-50 text-sm font-semibold rounded-full">
              <span className="mr-2">⭐</span>
              {displayLanguage === 'vi' ? 'Tin nổi bật' : 'Featured News'}
            </div>
          )}

          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {title}
            </h1>
            
            {subtitle && (
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {subtitle}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600 dark:text-gray-400">
              {category && (
                <span className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                  <Tag className="w-3 h-3 mr-2" />
                  {category}
                </span>
              )}
              
              {date && (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(date)}
                </span>
              )}
              
              {author && (
                <span className="inline-flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {displayLanguage === 'vi' ? 'Tác giả:' : 'Author:'} {author}
                </span>
              )}
              
              {source && (
                <span className="inline-flex items-center gap-2 text-sm">
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-500">
                    {displayLanguage === 'vi' ? 'Nguồn:' : 'Source:'} 
                    <a 
                      href={source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-1 text-blue-600 hover:underline"
                    >
                      {new URL(source).hostname}
                    </a>
                  </span>
                </span>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
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
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/70" />
        
        {/* Pattern overlay */}
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
                className="text-white hover:bg-white/20 backdrop-blur-sm border-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {displayLanguage === 'vi' ? 'Quay lại tin tức' : 'Back to news'}
              </Button>
            </div>

            <div className="max-w-4xl">
              {/* Featured badge */}
              {is_featured && (
                <div className="mb-4 inline-flex items-center px-4 py-2 bg-yellow-500 text-yellow-50 text-sm font-semibold rounded-full backdrop-blur-sm">
                  <span className="mr-2">⭐</span>
                  {displayLanguage === 'vi' ? 'Tin nổi bật' : 'Featured News'}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {title}
              </h1>

              {/* Subtitle */}
              {subtitle && (
                <p className="text-xl text-white/90 mb-6">
                  {subtitle}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-white/80">
                {category && (
                  <span className="inline-flex items-center px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                    <Tag className="w-3 h-3 mr-2" />
                    {category}
                  </span>
                )}
                
                {date && (
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(date)}
                  </span>
                )}
                
                {author && (
                  <span className="inline-flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {displayLanguage === 'vi' ? 'Tác giả:' : 'Author:'} {author}
                  </span>
                )}
                
                {source && (
                  <span className="inline-flex items-center gap-2 text-sm">
                    <span className="text-white/60">|</span>
                    <span className="text-white/60">
                      {displayLanguage === 'vi' ? 'Nguồn:' : 'Source:'} 
                      <a 
                        href={source} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-300 hover:text-blue-200 hover:underline"
                      >
                        {new URL(source).hostname}
                      </a>
                    </span>
                  </span>
                )}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
