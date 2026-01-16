import React from "react";
import Image from "next/image";
import { BlogCarouselProps } from "@/types";
import BlogContent from "./BlogContent";

interface ExtendedBlogCarouselProps extends BlogCarouselProps {
  children?: React.ReactNode;
  blogPostsLength: number;
}

const BlogCarousel: React.FC<ExtendedBlogCarouselProps> = ({
  currentPost,
  currentIndex,
  blogPostsLength,
  backgroundImageRef,
  getFallbackImage,
  children
}) => {
  const imageSrc = currentPost.image || getFallbackImage(currentIndex);
  
  return (
    <div className="relative w-full h-full bg-background">
      <div key={currentPost.id} className="absolute inset-0">
        <div ref={backgroundImageRef as React.RefObject<HTMLDivElement>} className="w-full h-full">
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

        <div className="absolute top-1/2 left-8 md:left-16 lg:left-24 transform -translate-y-1/2 w-full max-w-2xl px-4">
          <div className="max-w-xl">
            <div className="blog-content-wrapper">
              <BlogContent
                currentPost={currentPost}
                currentIndex={currentIndex}
                blogPostsLength={blogPostsLength}
              />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCarousel;