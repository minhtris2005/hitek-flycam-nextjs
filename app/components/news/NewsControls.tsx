// components/news/NewsControls.tsx
'use client';

import React from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NewsControlsProps {
  isAnimating: boolean;
  onPrev: () => void;
  onNext: () => void;
  onViewDetails: (id: string, e?: React.MouseEvent) => void;
  onViewAllPosts?: () => void;
  currentPostId: string;
  prevBtnRef: React.RefObject<HTMLButtonElement>;
  nextBtnRef: React.RefObject<HTMLButtonElement>;
}

const NewsControls: React.FC<NewsControlsProps> = ({
  isAnimating,
  onPrev,
  onNext,
  onViewDetails,
  onViewAllPosts,
  currentPostId,
  prevBtnRef,
  nextBtnRef
}) => {
  const { language } = useLanguage();
  
  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  const texts = {
    viewDetails: displayLanguage === 'vi' ? 'XEM CHI TIẾT' : 'VIEW DETAILS',
    viewAllPosts: displayLanguage === 'vi' ? 'XEM TẤT CẢ' : 'VIEW ALL',
    switchPost: displayLanguage === 'vi' ? 'Chuyển tin' : 'Switch news',
    viewDetailsAria: displayLanguage === 'vi' ? 'Xem chi tiết tin tức' : 'View news details',
    viewAllPostsAria: displayLanguage === 'vi' ? 'Xem tất cả tin tức' : 'View all news',
    prevPost: displayLanguage === 'vi' ? 'Xem tin trước' : 'View previous news',
    nextPost: displayLanguage === 'vi' ? 'Xem tin tiếp theo' : 'View next news',
  };

  return (
    <div className="space-y-8">
      {/* Buttons wrapper - Theo style blog */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* VIEW DETAILS Button - Primary */}
        <div className="flex-1">
          <button
            onClick={(e) => onViewDetails(currentPostId, e)}
            className="w-full lg:w-auto bg-primary text-white font-medium tracking-wider py-3 px-8 hover:bg-primary/90 transition-all duration-300 text-lg min-w-50 text-left rounded-3xl hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group cursor-pointer"
            aria-label={texts.viewDetailsAria}
          >
            <span className="flex items-center justify-between gap-2">
              {texts.viewDetails}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </div>

        {/* VIEW ALL POSTS Button - Secondary */}
        <div className="flex-1">
          <button
            onClick={onViewAllPosts}
            className="cursor-pointer w-full lg:w-auto bg-transparent border-2 border-white text-white font-medium tracking-wider py-3 px-8 hover:bg-white/10 transition-all duration-300 text-lg min-w-50 text-left rounded-3xl hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group"
            aria-label={texts.viewAllPostsAria}
          >
            <span className="flex items-center justify-between gap-2">
              {texts.viewAllPosts}
              <span className="group-hover:translate-x-1 transition-transform">↓</span>
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Arrows - Theo style blog */}
      <div className="flex items-center gap-4">
        <button
          ref={prevBtnRef}
          onClick={onPrev}
          className="cursor-pointer w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg hover:scale-110 active:scale-95 group"
          disabled={isAnimating}
          aria-label={texts.prevPost}
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <span className="text-white text-sm">
          {texts.switchPost}
        </span>

        <button
          ref={nextBtnRef}
          onClick={onNext}
          className="cursor-pointer w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg hover:scale-110 active:scale-95 group"
          disabled={isAnimating}
          aria-label={texts.nextPost}
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* CSS Animation - Theo style blog */}
      <style jsx>{`
        button {
          backdrop-filter: blur(10px);
        }
        
        @media (max-width: 768px) {
          .space-y-8 {
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsControls;
