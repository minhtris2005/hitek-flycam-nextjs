'use client';

import React from "react";
import { Badge } from "@/app/components/ui/badge";
import { User, Tag } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Định nghĩa interface cho bài viết
interface ArticlePost {
  id: string | number;
  title: string;
  category?: string;
  author?: string;
  date?: string;
  created_at?: string;
  read_time?: number;
  views?: number;
}

interface ArticleMetadataProps {
  post: ArticlePost;
  readTime?: number;
  viewCount?: number;
}

export const ArticleMetadata = ({ 
  post
}: ArticleMetadataProps) => {
  const { language } = useLanguage();

  // Xác định ngôn ngữ hiển thị
  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  // Dịch category
  const translateCategory = (category: string = "") => {
    const translations: Record<string, { vi: string; en: string }> = {
      'Tin tức': { vi: 'Tin tức', en: 'News' },
      'Hướng dẫn': { vi: 'Hướng dẫn', en: 'Tutorial' },
      'Review': { vi: 'Review', en: 'Review' },
      'Công nghệ': { vi: 'Công nghệ', en: 'Technology' },
      'Sản phẩm': { vi: 'Sản phẩm', en: 'Products' },
      'Pháp lý': { vi: 'Pháp lý', en: 'Legal' },
      'Nhiếp ảnh': { vi: 'Nhiếp ảnh', en: 'Photography' },
      'Bảo trì': { vi: 'Bảo trì', en: 'Maintenance' },
    };

    if (category && translations[category]) {
      return displayLanguage === 'vi' ? translations[category].vi : translations[category].en;
    }
    return category || (displayLanguage === 'vi' ? 'Tin tức' : 'News');
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground">
      {/* Chỉ giữ lại Tag (Category) */}
      {post.category && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {translateCategory(post.category)}
        </Badge>
      )}

      {/* Chỉ giữ lại Tác giả */}
      {post.author && (
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span className="font-medium">{post.author}</span>
        </div>
      )}
    </div>
  );
};