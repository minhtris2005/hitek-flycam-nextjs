import React from "react";
import { BlogControlsProps } from "@/types";
import { useLanguage } from "@/app/contexts/LanguageContext";

const BlogControls: React.FC<BlogControlsProps> = ({
  isAnimating,
  onPrev,
  onNext,
  onViewDetails,
  onViewAllPosts,
  currentPostId,
  prevBtnRef,
  nextBtnRef
}) => {
  const { t } = useLanguage();
  
  // Determine display language
  const displayLanguage = t("lang") === 'vi' ? 'vi' : 'en';

  // Text by language
  const texts = {
    viewDetails: displayLanguage === 'vi' ? 'XEM CHI TIẾT' : 'VIEW DETAILS',
    viewAllPosts: displayLanguage === 'vi' ? 'XEM TẤT CẢ' : 'VIEW ALL',
    switchPost: displayLanguage === 'vi' ? 'Chuyển bài' : 'Switch posts',
    viewDetailsAria: displayLanguage === 'vi' ? 'Xem chi tiết bài viết' : 'View post details',
    viewAllPostsAria: displayLanguage === 'vi' ? 'Xem tất cả bài viết' : 'View all blog posts',
    prevPost: displayLanguage === 'vi' ? 'Xem bài viết trước' : 'View previous post',
    nextPost: displayLanguage === 'vi' ? 'Xem bài viết tiếp theo' : 'View next post',
  };

  return (
    <>
      {/* Container for all buttons - LEFT ALIGNED */}
      <div className="space-y-10 opacity-0 animate-showContent animation-delay-600">
        {/* Buttons wrapper with responsive layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* VIEW DETAILS Button */}
          <div className="flex-1">
            <button
              onClick={(e) => onViewDetails(currentPostId, e)}
              className="w-full lg:w-auto bg-vibrant-red text-white font-medium tracking-wider py-3 px-8 hover:bg-red-600 transition-all duration-300 text-lg min-w-50 text-left rounded-3xl hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group"
              aria-label={texts.viewDetailsAria}
            >
              <span className="flex items-center justify-between gap-2">
                {texts.viewDetails}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
          </div>

          {/* VIEW ALL POSTS Button */}
          <div className="flex-1">
            <button
              onClick={onViewAllPosts}
              className="w-full lg:w-auto bg-transparent border-2 border-white text-white font-medium tracking-wider py-3 px-8 hover:bg-white/10 transition-all duration-300 text-lg min-w-50 text-left rounded-3xl hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group"
              aria-label={texts.viewAllPostsAria}
            >
              <span className="flex items-center justify-between gap-2">
                {texts.viewAllPosts}
                <span className="group-hover:translate-x-1 transition-transform">↓</span>
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Arrows - HORIZONTAL BELOW DETAILS BUTTON */}
        <div className="flex items-center gap-4">
          <button
            ref={prevBtnRef}
            onClick={onPrev}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg hover:scale-110 active:scale-95 group"
            disabled={isAnimating}
            aria-label={texts.prevPost}
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">&lt;</span>
          </button>

          <span className="text-white text-sm">
            {texts.switchPost}
          </span>

          <button
            ref={nextBtnRef}
            onClick={onNext}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg hover:scale-110 active:scale-95 group"
            disabled={isAnimating}
            aria-label={texts.nextPost}
          >
            <span className="group-hover:translate-x-0.5 transition-transform">&gt;</span>
          </button>
        </div>
      </div>

      {/* CSS for responsive and effects */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .min-w-\\[200px\\] {
            min-width: 100%;
          }
        }
        
        @media (max-width: 640px) {
          .space-y-10 {
            margin-top: 1.5rem;
          }
          
          .text-lg {
            font-size: 1rem;
          }
          
          .px-8 {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }
        
        button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .shadow-lg {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        }
        
        .hover\\:shadow-xl:hover {
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </>
  );
};

export default BlogControls;