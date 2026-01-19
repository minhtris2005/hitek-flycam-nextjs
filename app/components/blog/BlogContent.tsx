import React from "react";
import { BlogContentProps } from "@/types";
import { useLanguage } from "@/app/contexts/LanguageContext";

const BlogContent: React.FC<BlogContentProps> = ({ 
  currentPost, 
  currentIndex,
  blogPostsLength
}) => {
  const { t } = useLanguage();
  
  // Determine display language (only vi or en)
  const displayLanguage = t("lang") === 'vi' ? 'vi' : 'en';
  
  // Helper function to ensure string return
  const getTranslation = (key: string, fallback: string = ''): string => {
    const result = t(key);
    return typeof result === 'string' ? result : fallback;
  };
  
  // Get title by language
  const getTitle = () => {
    if (displayLanguage === 'vi') {
      return currentPost.title_vi || currentPost.title_en || currentPost.title || 'Không có tiêu đề';
    } else {
      return currentPost.title_en || currentPost.title_vi || currentPost.title || 'No title';
    }
  };
  
  // Get category by language (translate category if needed)
  const getCategory = () => {
    // Category can be generic, but if translation is needed use t()
    const category = currentPost.category || (displayLanguage === 'vi' ? 'Tin tức' : 'News');
    
    // Translate common categories if needed
    const categoryTranslations: Record<string, string> = {
      'Tin tức': displayLanguage === 'vi' ? 'Tin tức' : 'News',
      'Hướng dẫn': displayLanguage === 'vi' ? 'Hướng dẫn' : 'Tutorial',
      'Review': displayLanguage === 'vi' ? 'Review' : 'Review',
      'Công nghệ': displayLanguage === 'vi' ? 'Công nghệ' : 'Technology',
      'Sản phẩm': displayLanguage === 'vi' ? 'Sản phẩm' : 'Products',
      'Pháp lý': displayLanguage === 'vi' ? 'Pháp lý' : 'Legal',
      'Nhiếp ảnh': displayLanguage === 'vi' ? 'Nhiếp ảnh' : 'Photography',
      'Bảo trì': displayLanguage === 'vi' ? 'Bảo trì' : 'Maintenance',
    };
    
    return categoryTranslations[category] || category;
  };
  
  
  // Check if post has English version
  const hasEnglishVersion = () => {
    return !!currentPost.title_en || !!currentPost.content_en;
  };
  
  // Check if post has Vietnamese version
  const hasVietnameseVersion = () => {
    return !!currentPost.title_vi || !!currentPost.content_vi;
  };
  
  // Get date and format by language
  const formatDate = () => {
    if (!currentPost.date) return '';
    const date = new Date(currentPost.date);
    
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
    const author = currentPost.author || (displayLanguage === 'vi' ? 'Admin' : 'Admin');
    return author;
  };

  return (
    <>
      {/* Header with Author, Date and Index Indicator - LEFT ALIGNED */}
      <div className="flex items-center justify-between gap-4 mb-10 opacity-0 animate-showContent">
        <div className="flex items-center gap-4">
          {/* Author */}
          <div className="author text-white font-bold tracking-[0.3em] text-xs md:text-sm">
            {getAuthor()}
          </div>

          {/* Separator */}
          <div className="w-1 h-4 bg-primary"></div>

          {/* Date */}
          <div className="text-white text-xs md:text-sm hidden md:block">
            {formatDate()}
          </div>
        </div>

        {/* Current Index Indicator and Language badges */}
        <div className="text-white text-sm flex items-center gap-2">
          {/* Language indicator - only show if post has both languages */}
          {(hasVietnameseVersion() || hasEnglishVersion()) && (
            <>
              <div className="w-1 h-4 bg-primary"></div>
            </>
          )}

          <span className="text-primary font-bold">{currentIndex + 1}</span>
          <span className="text-white/70">/</span>
          <span>{blogPostsLength}</span>
        </div>
      </div>

      {/* Mobile Date - show below on mobile */}
      <div className="text-white/80 text-xs mb-4 opacity-0 animate-showContent md:hidden">
        {formatDate()}
      </div>

      {/* Title - LIMITED TO 3 LINES, LEFT ALIGNED */}
      <h1 className="title text-primary font-bold text-3xl md:text-5xl lg:text-5xl mb-10 py-1 opacity-0 animate-showContent animation-delay-200 line-clamp-3 leading-[1.3] md:leading-tight">
        {getTitle()}
      </h1>

      {/* Category and Read Time - LEFT ALIGNED */}
      <div className="topic text-white font-bold text-xl md:text-3xl lg:text-3xl mb-12 opacity-0 animate-showContent animation-delay-400">
        {getCategory()}
      </div>

      {/* Excerpt - Show if available and not completely hidden */}
      {currentPost.excerpt_vi || currentPost.excerpt_en ? (
        <div className="text-white text-base md:text-lg mb-6 opacity-0 animate-showContent animation-delay-600 line-clamp-2">
          {displayLanguage === 'vi'
            ? (currentPost.excerpt_vi || currentPost.excerpt_en)
            : (currentPost.excerpt_en || currentPost.excerpt_vi)
          }
        </div>
      ) : null}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes showContent {
          0% { opacity: 0; transform: translateY(30px); filter: blur(5px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-showContent { 
          animation: showContent 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
        }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
      `}</style>
    </>
  );
};

export default BlogContent;
