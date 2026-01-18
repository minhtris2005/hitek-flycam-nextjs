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
  
  const displayLanguage = t("lang") === 'vi' ? 'vi' : 'en';

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
    <div className="space-y-8"> {/* ĐỔI: xóa opacity-0 */}
      {/* Buttons wrapper */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* VIEW DETAILS Button */}
        <div className="flex-1">
          <button
            onClick={(e) => onViewDetails(currentPostId, e)}
            className="w-full lg:w-auto bg-primary text-white font-medium tracking-wider py-3 px-8 hover:bg-red-600 transition-all duration-300 text-lg min-w-50 text-left rounded-3xl hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group cursor-pointer"
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

      {/* Navigation Arrows */}
      <div className="flex items-center gap-4">
        <button
          ref={prevBtnRef}
          onClick={onPrev}
          className="cursor-pointer w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg hover:scale-110 active:scale-95 group"
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
          className="cursor-pointer w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg hover:scale-110 active:scale-95 group"
          disabled={isAnimating}
          aria-label={texts.nextPost}
        >
          <span className="group-hover:translate-x-0.5 transition-transform">&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default BlogControls;