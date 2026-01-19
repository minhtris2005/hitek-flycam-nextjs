// components/news/NewsThumbnailCarousel.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Newspaper, Clock, Eye } from "lucide-react";

interface NewsPost {
  id: string;
  displayTitle: string;
  displayExcerpt: string;
  displaySlug: string;
  displayCategory: string;
  readTime: number;
  image?: string | null;
  author?: string | null;
  created_at: string;
  date: string;
  is_featured: boolean;
  source?: string | null;
  tags?: string[];
  views?: number;
}

interface ThumbnailNewsPost extends NewsPost {
  originalIndex: number;
}

interface NewsThumbnailCarouselProps {
  thumbnailPosts: ThumbnailNewsPost[];
  isAnimating: boolean;
  onThumbnailClick: (clickedIndex: number) => void;
  getFallbackImage: () => string;
  thumbnailContainerRef: React.RefObject<HTMLDivElement>;
}

const NewsThumbnailCarousel: React.FC<NewsThumbnailCarouselProps> = ({
  thumbnailPosts,
  isAnimating,
  onThumbnailClick,
  getFallbackImage,
  thumbnailContainerRef
}) => {
  const { t } = useLanguage();

  // Determine display language
  const displayLanguage = t("lang") === 'vi' ? 'vi' : 'en';

  // Function to handle thumbnail click
  const handleThumbnailClick = (post: ThumbnailNewsPost, originalIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAnimating) return;

    onThumbnailClick(originalIndex);
  };

  // Function to get safe image source
  const getImageSrc = (post: ThumbnailNewsPost): string => {
    return post.image || getFallbackImage();
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(displayLanguage === 'vi' ? 'vi-VN' : 'en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // Truncate title for thumbnail
  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <div className="thumbnail-section absolute bottom-30 right-8 z-20">
      {/* Title with dynamic language */}
      <div className="text-white mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Newspaper className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-bold">
            {displayLanguage === 'vi' ? 'TIN MỚI NHẤT' : 'LATEST NEWS'}
          </h3>
        </div>
        <div className="w-16 h-1 bg-blue-500 mt-2"></div>
        <p className="text-gray-300 text-sm mt-2">
          {displayLanguage === 'vi' ? 'Cập nhật tin tức mới nhất' : 'Stay updated with latest news'}
        </p>
      </div>
      
      <div 
        ref={thumbnailContainerRef}
        className="thumbnail flex gap-3 overflow-x-auto px-2 py-2"
        aria-label={displayLanguage === 'vi' ? "Các tin tức khác" : "Other news"}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#3b82f6 transparent',
          maxWidth: '50vw',
        }}
      >
        {thumbnailPosts.map((post) => {
          const imageSrc = getImageSrc(post);
          const slug = post.displaySlug || `news-${post.id}`;
          const isFeatured = post.is_featured;
          
          return (
            <article
              key={post.id}
              data-post-id={post.id}
              className="item w-40 h-52 shrink-0 rounded-lg overflow-hidden cursor-pointer relative group"
              onClick={(e) => handleThumbnailClick(post, post.originalIndex, e)}
              aria-label={`Tin tức: ${post.displayTitle}`}
            >
              <div className="w-full h-full relative">
                <Image
                  src={imageSrc}
                  alt={post.displayTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  sizes="160px"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxMDI2NDMiLz48L3N2Zz4="
                />
                
                {/* Featured badge */}
                {isFeatured && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="text-[8px]">★</span>
                      <span>{displayLanguage === 'vi' ? 'Nổi bật' : 'Hot'}</span>
                    </div>
                  </div>
                )}

                {/* Date badge */}
                <div className="absolute top-2 right-2 z-10">
                  <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                    {formatDate(post.date || post.created_at)}
                  </div>
                </div>
              </div>
              
              {/* Gradient overlay with content */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3">
                {/* Category badge */}
                <div className="mb-2">
                  <span className="inline-block bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                    {post.displayCategory}
                  </span>
                </div>

                {/* Title */}
                <h2 className="title text-white font-bold text-sm line-clamp-2 mb-2">
                  {truncateTitle(post.displayTitle, 45)}
                </h2>

                {/* Meta info */}
                <div className="flex items-center justify-between text-gray-300 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}min</span>
                  </div>
                  
                  {post.views && post.views > 0 && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.views}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hover overlay với Link và Read button */}
              <Link 
                href={`/news/${slug}`}
                className="absolute inset-0 bg-blue-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center no-underline p-4"
              >
                <span className="text-white text-sm font-medium text-center mb-2 line-clamp-2">
                  {truncateTitle(post.displayTitle, 60)}
                </span>
                <span className="text-blue-300 text-xs text-center flex items-center gap-1">
                  {displayLanguage === 'vi' ? 'Đọc tin ngay' : 'Read now'} 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </article>
          );
        })}
      </div>
      
      {/* Scroll indicator */}
      {thumbnailPosts.length > 3 && (
        <div className="text-center mt-3">
          <div className="inline-flex items-center gap-1 text-gray-400 text-xs">
            <span>←</span>
            <span>{displayLanguage === 'vi' ? 'Kéo để xem thêm' : 'Scroll for more'}</span>
            <span>→</span>
          </div>
        </div>
      )}
      
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
          background: #3b82f6;
          border-radius: 3px;
        }
        .thumbnail::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }

        .thumbnail-section {
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(12px);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1) inset;
        }

        .dark .thumbnail-section {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(59, 130, 246, 0.4);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        }

        .thumbnail-section h3 {
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
        }

        .dark .thumbnail-section h3 {
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
        }

        .item {
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .item:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(59, 130, 246, 0.5);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .dark .item:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(59, 130, 246, 0.6);
        }

        /* Featured item glow effect */
        .item[data-featured="true"] {
          animation: subtle-glow 3s ease-in-out infinite;
        }

        @keyframes subtle-glow {
          0%, 100% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 193, 7, 0.3); }
          50% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 193, 7, 0.6); }
        }
        
        @media (max-width: 768px) {
          .thumbnail-section {
            right: 4px;
            bottom: 4px;
            max-width: 90vw;
            padding: 16px;
          }
          
          .thumbnail {
            max-width: 80vw !important;
          }
          
          .item {
            width: 140px !important;
            height: 180px !important;
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
            width: 120px !important;
            height: 160px !important;
          }
          
          .thumbnail-section h3 {
            font-size: 1rem;
          }
          
          .thumbnail-section p {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsThumbnailCarousel;
