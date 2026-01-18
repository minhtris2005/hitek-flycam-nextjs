import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ThumbnailCarouselProps, EnhancedBlogPost } from "@/types";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface ThumbnailPost extends EnhancedBlogPost {
  originalIndex: number;
}

const ThumbnailCarousel: React.FC<ThumbnailCarouselProps> = ({
  thumbnailPosts,
  isAnimating,
  onThumbnailClick,
  getFallbackImage,
  thumbnailContainerRef
}) => {
  const { t } = useLanguage();

  // Determine display language
  const displayLanguage = t("lang") === 'vi' ? 'vi' : 'en';

  // Function to get title by language
  const getTitle = (post: ThumbnailPost) => {
    const noTitleText = String(t('no_title')) || (displayLanguage === 'vi' ? 'Không có tiêu đề' : 'No title');
    
    if (displayLanguage === 'vi') {
      return post.title_vi || post.title_en || post.title || noTitleText;
    } else {
      return post.title_en || post.title_vi || post.title || noTitleText;
    }
  };

  // Function to get category by language
  const getCategory = (category: string | null | undefined) => {
    if (!category) {
      return displayLanguage === 'vi' ? 'Tin tức' : 'News';
    }

    const categoryTranslations: Record<string, { vi: string, en: string }> = {
      'Tin tức': { vi: 'Tin tức', en: 'News' },
      'Hướng dẫn': { vi: 'Hướng dẫn', en: 'Tutorial' },
      'Review': { vi: 'Review', en: 'Review' },
      'Công nghệ': { vi: 'Công nghệ', en: 'Technology' },
      'Sản phẩm': { vi: 'Sản phẩm', en: 'Products' },
      'Pháp lý': { vi: 'Pháp lý', en: 'Legal' },
      'Nhiếp ảnh': { vi: 'Nhiếp ảnh', en: 'Photography' },
      'Bảo trì': { vi: 'Bảo trì', en: 'Maintenance' },
    };

    const translation = categoryTranslations[category];
    if (translation) {
      return displayLanguage === 'vi' ? translation.vi : translation.en;
    }
    
    return category;
  };

  // Function to handle thumbnail click
  const handleThumbnailClick = (post: ThumbnailPost, originalIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAnimating) return;

    onThumbnailClick(originalIndex);
  };

  // Function to get safe image source
  const getImageSrc = (post: ThumbnailPost): string => {
    return post.image || getFallbackImage(post.originalIndex);
  };

  return (
    <div className="thumbnail-section absolute bottom-30 right-8 z-20">
      {/* Title with dynamic language */}
      <div className="text-white mb-4">
        <h3 className="text-xl font-bold">
          {displayLanguage === 'vi' ? 'CÁC BÀI VIẾT NỔI BẬT' : 'FEATURED POSTS'}
        </h3>
        <div className="w-16 h-1 bg-vibrant-red mt-2"></div>
      </div>
      
      <div 
        ref={thumbnailContainerRef}
        className="thumbnail flex gap-3 overflow-x-auto px-2 py-2"
        aria-label={displayLanguage === 'vi' ? "Các bài viết khác" : "Other posts"}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#ef4444 transparent',
          maxWidth: '50vw',
        }}
      >
        {thumbnailPosts.map((post) => {
          const title = getTitle(post);
          const category = getCategory(post.category);
          const imageSrc = getImageSrc(post);
          const slug = post.slug_vi || post.slug_en || post.slug || post.id.toString();
          
          return (
            <article
              key={post.id}
              data-post-id={post.id}
              className="item w-36 h-48 shrink-0 rounded-xl overflow-hidden cursor-pointer relative group"
              onClick={(e) => handleThumbnailClick(post, post.originalIndex, e)}
              aria-label={`Bài viết: ${title}`}
            >
              <div className="w-full h-full relative">
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  sizes="144px"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxMzEzMTMiLz48L3N2Zz4="
                />
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/70 to-transparent p-3">
                <h2 className="title text-white font-bold text-sm line-clamp-2">
                  {title.length > 30 ? title.substring(0, 30) + '...' : title}
                </h2>
                <div className="flex items-center justify-between mt-1">
                  <div className="des text-white/80 text-xs">
                    {category}
                  </div>
                </div>
              </div>

              {/* Hover overlay với Link */}
              <Link 
                href={`/blog/${slug}`}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center no-underline"
              >
                <span className="text-white text-sm font-medium">
                  {displayLanguage === 'vi' ? 'Đọc ngay' : 'Read now'} →
                </span>
              </Link>
            </article>
          );
        })}
      </div>
      
      {/* CSS for scrollbar and thumbnail-section */}
      <style jsx>{`
        .thumbnail::-webkit-scrollbar {
          height: 6px;
        }
        .thumbnail::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .dark .thumbnail::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .thumbnail::-webkit-scrollbar-thumb {
          background: #ef4444;
          border-radius: 3px;
        }
        .thumbnail::-webkit-scrollbar-thumb:hover {
          background: #dc2626;
        }

        .thumbnail-section {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .dark .thumbnail-section {
          background: rgba(30, 30, 30, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        }

        .thumbnail-section h3 {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .dark .thumbnail-section h3 {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
        }

        .item {
          transition: all 0.3s ease;
        }

        .item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
        }

        .dark .item:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.7);
        }
        
        @media (max-width: 768px) {
          .thumbnail-section {
            right: 4px;
            bottom: 4px;
            max-width: 90vw;
            padding: 12px;
          }
          
          .thumbnail {
            max-width: 80vw !important;
          }
          
          .item {
            width: 120px !important;
            height: 160px !important;
          }
          
          .thumbnail-section h3 {
            font-size: 1.1rem;
          }
        }
        
        @media (max-width: 480px) {
          .thumbnail-section {
            left: 4px;
            right: 4px;
            max-width: 100%;
          }
          
          .thumbnail {
            max-width: 100% !important;
          }
          
          .item {
            width: 100px !important;
            height: 140px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ThumbnailCarousel;