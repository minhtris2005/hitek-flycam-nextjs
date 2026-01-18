import React from "react";
import { Button } from "@/app/components/ui/button";
import { Share2, Bookmark } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Định nghĩa interface cho bài viết
interface ArticlePost {
  id: string | number;
  title: string;
  date?: string;
  created_at?: string;
  // Thêm các thuộc tính khác của bài viết nếu cần
}

interface ArticleActionsProps {
  post: ArticlePost;
}

export const ArticleActions = ({ post }: ArticleActionsProps) => {
  const { t } = useLanguage();

  // Xác định ngôn ngữ hiển thị
  const displayLanguage = t("lang") === 'vi' ? 'vi' : 'en';

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

  return (
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
  );
};