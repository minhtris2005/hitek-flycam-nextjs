'use client';

import React from "react";
import { User } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import Image from "next/image"; // Thêm import Image từ Next.js

// Định nghĩa interface cho tác giả
interface Author {
  id?: string | number;
  name: string;
  bio?: string;
  avatar?: string;
  role?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

// Định nghĩa interface cho bài viết
interface ArticlePost {
  id: string | number;
  title: string;
  author?: string | Author; // Có thể là string hoặc object Author
  category?: string;
}

interface AuthorBioProps {
  post: ArticlePost;
  author?: Author; // Prop author riêng (nếu có)
}

export const AuthorBio = ({ post, author: authorProp }: AuthorBioProps) => {
  const { t } = useLanguage();

  // Xác định ngôn ngữ hiển thị
  const displayLanguage = t("lang") === 'vi' ? 'vi' : 'en';

  // Lấy thông tin author
  const getAuthorInfo = () => {
    // Ưu tiên sử dụng author prop nếu có
    if (authorProp) {
      return {
        name: authorProp.name,
        bio: authorProp.bio,
        avatar: authorProp.avatar,
        role: authorProp.role,
      };
    }

    // Nếu không có author prop, kiểm tra post.author
    if (typeof post.author === 'object') {
      return {
        name: post.author.name,
        bio: post.author.bio,
        avatar: post.author.avatar,
        role: post.author.role,
      };
    }

    // Nếu post.author là string
    return {
      name: post.author || (displayLanguage === 'vi' ? 'Admin' : 'Admin'),
      bio: undefined,
      avatar: undefined,
      role: undefined,
    };
  };

  const author = getAuthorInfo();

  // Dịch category
  const translateCategory = (category: string = "") => {
    const translations: Record<string, { vi: string; en: string }> = {
      'Tin tức': { vi: 'tin tức', en: 'news' },
      'Hướng dẫn': { vi: 'hướng dẫn', en: 'tutorials' },
      'Review': { vi: 'review', en: 'reviews' },
      'Công nghệ': { vi: 'công nghệ', en: 'technology' },
      'Sản phẩm': { vi: 'sản phẩm', en: 'products' },
      'Pháp lý': { vi: 'pháp lý', en: 'legal topics' },
      'Nhiếp ảnh': { vi: 'nhiếp ảnh', en: 'photography' },
      'Bảo trì': { vi: 'bảo trì', en: 'maintenance' },
    };

    if (category && translations[category]) {
      return displayLanguage === 'vi' ? translations[category].vi : translations[category].en;
    }
    return category ? category.toLowerCase() : (displayLanguage === 'vi' ? 'các chủ đề' : 'various topics');
  };

  // Tạo bio mặc định dựa trên category
  const getDefaultBio = () => {
    const category = translateCategory(post.category);
    
    if (displayLanguage === 'vi') {
      return `Tác giả chuyên viết về ${category}. Đã xuất bản nhiều bài viết chất lượng trên blog này.`;
    } else {
      return `An author specializing in ${category}. Has published many quality articles on this blog.`;
    }
  };

  return (
    <div className="mt-12 p-6 bg-accent/30 rounded-xl border border-border">
      <h3 className="text-xl font-bold mb-4 text-foreground">
        {displayLanguage === 'vi' ? 'Về tác giả' : 'About the Author'}
      </h3>
      
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {author.avatar ? (
            <div className="w-16 h-16 rounded-full overflow-hidden relative">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Author info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h4 className="font-bold text-lg text-foreground">
                {author.name}
              </h4>
              {author.role && (
                <p className="text-sm text-muted-foreground">
                  {author.role}
                </p>
              )}
            </div>
          </div>
          
          <p className="text-muted-foreground mt-3">
            {author.bio || getDefaultBio()}
          </p>

          {/* Social links (nếu có) */}
          {(authorProp?.social_links || (typeof post.author === 'object' && post.author.social_links)) && (
            <div className="flex gap-3 mt-4">
              {Object.entries(authorProp?.social_links || (post.author as Author)?.social_links || {}).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`${author.name}'s ${platform}`}
                >
                  {platform === 'twitter' && '𝕏'}
                  {platform === 'linkedin' && 'in'}
                  {platform === 'github' && 'GitHub'}
                  {platform === 'website' && '🌐'}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};