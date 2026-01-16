// lib/blog/BlogTypes.ts
import { BlogPost } from '@/types';

export interface EnhancedBlogPost extends BlogPost {
  readTime: number; // Đổi từ string sang number
  slug: string;
}

// Không cần các props phức tạp khác
export interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  displayLanguage: 'vi' | 'en';
}