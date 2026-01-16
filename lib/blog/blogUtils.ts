// lib/blog/blogUtils.ts
import { EnhancedBlogPost } from './BlogTypes';

// Chỉ cần 2 hàm cơ bản
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

// Fallback images đơn giản
export const getFallbackImage = (index: number): string => {
  const images = [
    '/images/blog/fallback-1.jpg',
    '/images/blog/fallback-2.jpg',
    '/images/blog/fallback-3.jpg',
    '/images/blog/fallback-4.jpg',
  ];
  return images[index % images.length];
};

// Hàm lấy dữ liệu post theo ngôn ngữ
export const getPostDataByLanguage = (
  post: EnhancedBlogPost, 
  language: 'vi' | 'en'
) => {
  const title = language === 'vi' 
    ? (post.title_vi || post.title_en || post.title)
    : (post.title_en || post.title_vi || post.title);
    
  const excerpt = language === 'vi'
    ? (post.excerpt_vi || post.excerpt_en || post.excerpt)
    : (post.excerpt_en || post.excerpt_vi || post.excerpt);
    
  const content = language === 'vi'
    ? (post.content_vi || post.content_en || post.content)
    : (post.content_en || post.content_vi || post.content);
    
  const slug = language === 'vi'
    ? generateSlug(title)
    : generateSlug(title);

  return { title, excerpt, content, slug };
};