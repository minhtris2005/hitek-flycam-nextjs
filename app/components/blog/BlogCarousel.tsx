import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BlogCarouselProps } from "@/types"; // XÓA EnhancedBlogPost khỏi import
import BlogContent from "./BlogContent";
import BlogControls from "@/app/components/blog/BlogControls";

// MỞ RỘNG INTERFACE VỚI PROPS CỦA BlogControls
interface ExtendedBlogCarouselProps extends BlogCarouselProps {
  isAnimating: boolean;
  onPrev: () => void;
  onNext: () => void;
  onViewDetails: (id: string, e?: React.MouseEvent) => void;
  onViewAllPosts?: () => void;
  currentPostId: string;
  prevBtnRef: React.RefObject<HTMLButtonElement>;
  nextBtnRef: React.RefObject<HTMLButtonElement>;
}

const BlogCarousel: React.FC<ExtendedBlogCarouselProps> = ({
  currentPost,
  currentIndex,
  blogPostsLength,
  backgroundImageRef,
  getFallbackImage,
  isAnimating,
  onPrev,
  onNext,
  onViewDetails,
  onViewAllPosts,
  currentPostId,
  prevBtnRef,
  nextBtnRef,
  children
}) => {
  console.log("🚀 BlogCarousel rendering:", {
    hasBlogControls: true,
    currentPostId: currentPost.id,
    currentPostTitle: currentPost.title,
    imageSrc: currentPost.image
  });
  const [postImage, setPostImage] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(true);

  // Fetch image data từ Supabase nếu cần
  useEffect(() => {
    const fetchImageData = async () => {
      if (!currentPost.image) {
        setPostImage(getFallbackImage(currentIndex));
        return;
      }

      // Nếu image là URL Supabase storage
      if (currentPost.image.includes('supabase.co')) {
        try {
          // Kiểm tra xem ảnh có tồn tại không
          const response = await fetch(currentPost.image, { method: 'HEAD' });
          if (response.ok) {
            setPostImage(currentPost.image);
          } else {
            setPostImage(getFallbackImage(currentIndex));
          }
        } catch (error) {
          console.error('Error checking image:', error);
          setPostImage(getFallbackImage(currentIndex));
        }
      } else {
        setPostImage(currentPost.image);
      }
      setImageLoading(false);
    };

    fetchImageData();
  }, [currentPost.image, currentIndex, getFallbackImage]);

  const imageSrc = imageLoading ? getFallbackImage(currentIndex) : postImage;

  return (
    <div className="relative w-full h-full bg-background">
      <div key={currentPost.id} className="absolute inset-0">
        <div ref={backgroundImageRef as React.RefObject<HTMLDivElement>} className="w-full h-full relative">
          <Image
            src={imageSrc}
            alt={currentPost.title}
            fill
            className="object-cover transition-opacity duration-300"
            loading="eager"
            priority
            sizes="100vw"
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxMzEzMTMiLz48L3N2Zz4="
            onError={(e) => {
              const target = e.currentTarget;
              const fallbackSrc = getFallbackImage(currentIndex);
              if (target.src !== fallbackSrc) {
                target.src = fallbackSrc;
              }
            }}
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />

        <div className="absolute top-1/4 left-8 md:left-16 lg:left-24 transform -translate-y-1/4 w-full max-w-2xl px-4">
          <div className="max-w-xl">
            {/* BlogContent ở trên */}
            <div className="blog-content-wrapper mb-8">
              <BlogContent
                currentPost={currentPost}
                currentIndex={currentIndex}
                blogPostsLength={blogPostsLength}
              />
            </div>
            
            {/* BlogControls ở dưới */}
            <BlogControls
              isAnimating={isAnimating}
              onPrev={onPrev}
              onNext={onNext}
              onViewDetails={onViewDetails}
              onViewAllPosts={onViewAllPosts}
              currentPostId={currentPostId}
              prevBtnRef={prevBtnRef}
              nextBtnRef={nextBtnRef}
            />
            
            {/* Vẫn giữ children nếu cần */}
            {children}
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default BlogCarousel;