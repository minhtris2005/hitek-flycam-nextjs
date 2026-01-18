'use client';

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import Image from "next/image";

// Định nghĩa interface cho bài viết liên quan
interface RelatedPost {
  id: string | number;
  title: string;
  slug_vi?: string;
  slug_en?: string;
  currentSlug?: string;
  category?: string;
  image?: string;
  excerpt?: string;
  date?: string;
  read_time?: number;
  author?: string;
}

interface RelatedPostsProps {
  relatedPosts: RelatedPost[];
  currentPostId?: string | number;
  maxDisplay?: number;
}

export const RelatedPosts = ({ 
  relatedPosts, 
  currentPostId,
  maxDisplay = 3
}: RelatedPostsProps) => {
  const { language } = useLanguage();

  // Xác định ngôn ngữ hiển thị
  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  // Lọc bỏ bài viết hiện tại nếu có
  const filteredPosts = relatedPosts
    .filter(post => post.id !== currentPostId)
    .slice(0, maxDisplay);

  // Get post slug
  const getPostSlug = (post: RelatedPost) => {
    return displayLanguage === 'vi'
      ? (post.slug_vi || post.slug_en || post.currentSlug || post.id.toString())
      : (post.slug_en || post.slug_vi || post.currentSlug || post.id.toString());
  };

  if (filteredPosts.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">
          {displayLanguage === 'vi' ? 'Bài viết liên quan' : 'Related Posts'}
        </h2>
        <Link 
          href="/blog"
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors no-underline"
        >
          {displayLanguage === 'vi' ? 'Xem tất cả' : 'View all'}
          <span className="ml-1">→</span>
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const slug = getPostSlug(post);
          const href = `/blog/${slug}`;

          return (
            <Link href={href} key={post.id} className="no-underline">
              <article className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-300 cursor-pointer">
                {/* Image */}
                {post.image ? (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
                    
                    {/* Category badge on image */}
                    {post.category && (
                      <div className="absolute top-3 left-3">
                        <div className="px-3 py-1 bg-primary text-white text-xs rounded-full">
                          {post.category}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-48 w-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    {post.category && (
                      <div className="px-4 py-2 bg-primary text-white text-sm rounded-full">
                        {post.category}
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="font-bold text-lg mb-3 text-black line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Read more link */}
                  <div className="mt-2">
                    <span className="text-sm text-primary font-medium flex items-center gap-1">
                      {displayLanguage === 'vi' ? 'Đọc tiếp' : 'Read more'}
                      <span className="ml-1">→</span>
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
};