// components/news/NewsContent.tsx
'use client';

import React from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Calendar, User, Eye, Clock, Tag } from "lucide-react";

interface NewsContentProps {
  currentPost: {
    id: string;
    displayTitle: string;
    displayExcerpt: string;
    displayCategory: string;
    readTime: number;
    author?: string | null;
    created_at: string;
    date: string;
    is_featured: boolean;
    source?: string | null;
    tags?: string[];
    views?: number;
  };
  currentIndex: number;
  newsPostsLength: number;
}

const NewsContent: React.FC<NewsContentProps> = ({ 
  currentPost, 
  currentIndex,
  newsPostsLength
}) => {
  const { language } = useLanguage();
  
  // Determine display language
  const displayLanguage = language === 'vi' ? 'vi' : 'en';
  
  // Format date by language
  const formatDate = () => {
    if (!currentPost.date && !currentPost.created_at) return '';
    
    const dateString = currentPost.date || currentPost.created_at;
    const date = new Date(dateString);
    
    if (displayLanguage === 'vi') {
      return date.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };
  
  // Format author
  const getAuthor = () => {
    const author = currentPost.author || 
      (displayLanguage === 'vi' ? 'Biên tập viên' : 'Editor');
    return author;
  };

  // Format views
  const formatViews = () => {
    if (!currentPost.views || currentPost.views === 0) {
      return displayLanguage === 'vi' ? 'Chưa có lượt xem' : 'No views yet';
    }
    return currentPost.views.toLocaleString();
  };

  // Get category display
  const getCategory = () => {
    // Translate common categories if needed
    const categoryTranslations: Record<string, Record<string, string>> = {
      'Tin tức': { vi: 'Tin tức', en: 'News' },
      'Bất động sản': { vi: 'Bất động sản', en: 'Real Estate' },
      'Thị trường': { vi: 'Thị trường', en: 'Market' },
      'Pháp lý': { vi: 'Pháp lý', en: 'Legal' },
      'Công nghệ': { vi: 'Công nghệ', en: 'Technology' },
    };
    
    const translation = categoryTranslations[currentPost.displayCategory];
    return translation ? translation[displayLanguage] : currentPost.displayCategory;
  };

  // Get source display
  const getSource = () => {
    if (!currentPost.source) return null;
    
    // Shorten long source names
    const source = currentPost.source;
    if (source.length > 25) {
      return source.substring(0, 22) + '...';
    }
    return source;
  };

  return (
    <>
      {/* Header with Author, Date and Index Indicator - Theo style blog */}
      <div className="flex items-center justify-between gap-4 mb-10 opacity-0 animate-showContent">
        <div className="flex items-center gap-4">
          {/* Author */}
          <div className="text-white font-bold tracking-[0.3em] text-xs md:text-sm">
            {getAuthor()}
          </div>

          {/* Separator */}
          <div className="w-1 h-4 bg-primary"></div>

          {/* Date */}
          <div className="text-white text-xs md:text-sm hidden md:block">
            {formatDate()}
          </div>
        </div>

        {/* Current Index Indicator */}
        <div className="text-white text-sm flex items-center gap-2">
          <span className="text-primary font-bold">{currentIndex + 1}</span>
          <span className="text-white/70">/</span>
          <span>{newsPostsLength}</span>
        </div>
      </div>

      {/* Mobile Date - show below on mobile */}
      <div className="text-white/80 text-xs mb-4 opacity-0 animate-showContent md:hidden">
        {formatDate()}
      </div>

      {/* Title - LIMITED TO 3 LINES, LEFT ALIGNED */}
      <h1 className="text-primary font-bold text-3xl md:text-5xl lg:text-5xl mb-10 py-1 opacity-0 animate-showContent animation-delay-200 line-clamp-3 leading-[1.3] md:leading-tight">
        {currentPost.displayTitle}
      </h1>

      {/* Category and Meta Info - Theo style blog */}
      <div className="flex flex-wrap items-center gap-4 mb-12 opacity-0 animate-showContent animation-delay-400">
        {/* Category */}
        <div className="text-white font-bold text-xl md:text-3xl lg:text-3xl">
          {getCategory()}
        </div>

        {/* Meta Info Separator */}
        <div className="w-1 h-4 bg-primary hidden md:block"></div>

        {/* Featured badge - Theo style blog */}
        {currentPost.is_featured && (
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold">
            <span>★</span>
            <span>{displayLanguage === 'vi' ? 'NỔI BẬT' : 'FEATURED'}</span>
          </div>
        )}

        {/* Read time */}
        <div className="flex items-center gap-2 text-white/80 text-sm">
          <Clock className="w-4 h-4" />
          <span>{currentPost.readTime} {displayLanguage === 'vi' ? 'phút đọc' : 'min read'}</span>
        </div>

        {/* Views */}
        {currentPost.views && currentPost.views > 0 && (
          <>
            <div className="w-1 h-4 bg-primary/50 hidden md:block"></div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Eye className="w-4 h-4" />
              <span>{formatViews()}</span>
            </div>
          </>
        )}
      </div>

      {/* Excerpt - LEFT ALIGNED */}
      {currentPost.displayExcerpt && (
        <div className="text-white text-base md:text-lg mb-6 opacity-0 animate-showContent animation-delay-600 line-clamp-2 max-w-2xl">
          {currentPost.displayExcerpt}
        </div>
      )}

      {/* Source - Theo style blog */}
      {currentPost.source && (
        <div className="flex items-center gap-2 mb-6 opacity-0 animate-showContent animation-delay-800">
          <span className="text-white/70 text-sm">
            {displayLanguage === 'vi' ? 'Nguồn:' : 'Source:'}
          </span>
          <span className="text-white font-medium text-sm truncate max-w-[200px]">
            {getSource()}
          </span>
        </div>
      )}

      {/* Tags - Theo style blog */}
      {currentPost.tags && currentPost.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 opacity-0 animate-showContent animation-delay-800">
          <Tag className="w-4 h-4 text-primary" />
          {currentPost.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
          {currentPost.tags.length > 3 && (
            <span className="text-white/60 text-xs">
              +{currentPost.tags.length - 3} {displayLanguage === 'vi' ? 'khác' : 'more'}
            </span>
          )}
        </div>
      )}

      {/* Mobile Meta Info (compact) */}
      <div className="md:hidden mt-4 pt-4 border-t border-white/20 opacity-0 animate-showContent">
        <div className="flex items-center justify-between text-sm text-white/70">
          <div className="flex items-center gap-3">
            <span>{getAuthor()}</span>
            <span className="text-primary">•</span>
            <span>{formatDate()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>{currentPost.readTime}min</span>
          </div>
        </div>
      </div>

      {/* CSS Animation - Theo style blog */}
      <style jsx>{`
        @keyframes showContent {
          0% { opacity: 0; transform: translateY(20px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-showContent { 
          animation: showContent 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
        }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
      `}</style>
    </>
  );
};

export default NewsContent;
