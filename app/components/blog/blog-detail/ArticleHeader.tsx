'use client';

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { ArrowLeft, Share2, Bookmark, Clock, User, Tag, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Định nghĩa interface cho bài viết
interface ArticlePost {
  id: string | number;
  title: string;
  excerpt?: string;
  category?: string;
  author?: string;
  date?: string;
  created_at?: string;
  views?: number;
  read_time?: number;
}

interface ArticleHeaderProps {
  post: ArticlePost;
  hasImage: boolean;
}

export const ArticleHeader = ({ post, hasImage }: ArticleHeaderProps) => {
  const router = useRouter();
  const { t } = useLanguage();

  // Xác định ngôn ngữ hiển thị
  const displayLanguage = t("lang") === 'vi' ? 'vi' : 'en';

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

  // Format ngày theo ngôn ngữ
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);

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

  const handleBack = () => {
    router.push("/blog");
    // Hoặc router.back() nếu muốn quay lại trang trước
    // router.back();
  };

  return (
    <>
      {!hasImage && (
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {displayLanguage === 'vi' ? 'Quay lại' : 'Back'}
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground">
        <Badge variant="outline" className="flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {translateCategory(post.category)}
        </Badge>
        
        {post.author && (
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="font-medium">{post.author}</span>
          </div>
        )}

        {post.date || post.created_at ? (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(post.date || post.created_at)}</span>
          </div>
        ) : null}

        {post.read_time && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.read_time} {displayLanguage === 'vi' ? 'phút đọc' : 'min read'}</span>
          </div>
        )}

        {post.views !== undefined && (
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.views.toLocaleString()} {displayLanguage === 'vi' ? 'lượt xem' : 'views'}</span>
          </div>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
        {post.title}
      </h1>

      {post.excerpt && (
        <div className="text-xl text-muted-foreground mb-8 italic border-l-4 border-primary pl-4 py-2 bg-primary/10">
          {post.excerpt}
        </div>
      )}

      <div className="flex items-center justify-between mb-8 py-4 border-y border-border">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            {displayLanguage === 'vi' ? 'Chia sẻ' : 'Share'}
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="w-4 h-4 mr-2" />
            {displayLanguage === 'vi' ? 'Lưu lại' : 'Save'}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {displayLanguage === 'vi' ? 'Đăng ngày: ' : 'Published: '}
          {formatDate(post.date || post.created_at)}
        </div>
      </div>

      <Separator className="mb-8" />
    </>
  );
};