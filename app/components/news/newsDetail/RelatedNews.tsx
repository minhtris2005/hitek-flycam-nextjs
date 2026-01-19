'use client';

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import Image from "next/image";

// Định nghĩa interface cho tin tức liên quan
interface RelatedNews {
  id: string | number;
  title: string;
  slug: string;
  category?: string;
  image?: string;
  excerpt?: string;
  date?: string;
  author?: string;
  is_featured?: boolean;
}

interface RelatedNewsProps {
  relatedPosts: RelatedNews[];
  currentPostId?: string | number;
  maxDisplay?: number;
}

export const RelatedNews = ({ 
  relatedPosts, 
  currentPostId,
  maxDisplay = 3
}: RelatedNewsProps) => {
  const { language } = useLanguage();

  // Xác định ngôn ngữ hiển thị
  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  // Lọc bỏ tin tức hiện tại nếu có
  const filteredPosts = relatedPosts
    .filter(post => post.id !== currentPostId)
    .slice(0, maxDisplay);

  if (filteredPosts.length === 0) return null;

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">
          {displayLanguage === 'vi' ? 'Tin tức liên quan' : 'Related News'}
        </h2>
        <Link 
          href="/news"
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors no-underline"
        >
          {displayLanguage === 'vi' ? 'Xem tất cả' : 'View all'}
          <span className="ml-1">→</span>
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const href = `/news/${post.slug}`;

          return (
            <Link href={href} key={post.id} className="no-underline group">
              <article className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-300 cursor-pointer h-full flex flex-col">
                {/* Featured badge */}
                {post.is_featured && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="px-3 py-1 bg-yellow-500 text-yellow-50 text-xs font-semibold rounded-full flex items-center gap-1">
                      <span className="text-xs">⭐</span>
                      {displayLanguage === 'vi' ? 'Nổi bật' : 'Featured'}
                    </div>
                  </div>
                )}

                {/* Image */}
                {post.image ? (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
                    
                    {/* Category badge on image */}
                    {post.category && (
                      <div className="absolute top-3 right-3">
                        <div className="px-3 py-1 bg-primary text-white text-xs rounded-full">
                          {post.category}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-48 w-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                    {post.category && (
                      <div className="absolute top-3 right-3">
                        <div className="px-4 py-2 bg-primary text-white text-sm rounded-full">
                          {post.category}
                        </div>
                      </div>
                    )}
                    <div className="text-4xl text-primary/30">📰</div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Metadata */}
                  <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                    {post.date && (
                      <span className="flex items-center gap-1">
                        <span className="text-xs">📅</span>
                        {formatDate(post.date)}
                      </span>
                    )}
                    {post.author && (
                      <span className="flex items-center gap-1">
                        <span className="text-xs">👤</span>
                        {post.author}
                      </span>
                    )}
                  </div>

                  {/* Category badge */}
                  {post.category && (
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3 self-start">
                      {post.category}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="font-bold text-lg mb-2 text-black line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Read more link */}
                  <div className="mt-auto pt-3 border-t border-gray-200">
                    <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      {displayLanguage === 'vi' ? 'Đọc tiếp' : 'Read more'}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
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
