// components/news/AllNewsPage.tsx
"use client";
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardFooter } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Badge } from '@/app/components/ui/badge';
import { Calendar, User, Eye, Star } from "lucide-react";

// Helper functions
const calculateReadTime = (content: string): number => {
  const words = content?.trim().split(/\s+/).length || 0;
  return Math.ceil(words / 200);
};

const getFallbackImage = (index: number): string => {
  const images = [
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop',
  ];
  return images[index % images.length];
};

interface NewsPost {
  id: string;
  title_vi: string;
  title_en?: string | null;
  excerpt_vi?: string | null;
  excerpt_en?: string | null;
  content_vi?: string | null;
  content_en?: string | null;
  image?: string | null;
  category?: string | null;
  author?: string | null;
  status: string;
  created_at: string;
  slug_vi: string;
  slug_en?: string | null;
  is_featured: boolean;
  source?: string | null;
  tags?: string[];
  date: string;
  views?: number;
}

interface EnhancedNewsPost {
  id: string;
  displayTitle: string;
  displayExcerpt: string;
  displaySlug: string;
  displayCategory: string;
  readTime: number;
  image?: string | null;
  author?: string | null;
  created_at: string;
  date: string;
  is_featured: boolean;
  source?: string | null;
  tags?: string[];
  views?: number;
}

export default function AllNewsPage() {
  const { language } = useLanguage();
  const [allNews, setAllNews] = useState<EnhancedNewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const router = useRouter();

  // Xác định ngôn ngữ hiển thị
  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  // Categories cho tin tức
  const newsCategories = [
    'Tin tức',
    'Thời sự', 
    'Kinh tế',
    'Thể thao',
    'Giải trí',
    'Công nghệ',
    'Sức khỏe',
    'Giáo dục'
  ];

  // Fetch news từ Supabase REST API
  const fetchAllNews = useCallback(async () => {
    try {
      setLoading(true);
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        setAllNews([]);
        return;
      }
      
      const response = await fetch(
        `${supabaseUrl}/rest/v1/news?status=eq.published&order=created_at.desc`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data: NewsPost[] = await response.json();
        
        if (data && data.length > 0) {
          const enhancedPosts: EnhancedNewsPost[] = data.map((post) => {
            // Lấy dữ liệu theo ngôn ngữ
            const title = displayLanguage === 'vi' 
              ? (post.title_vi || post.title_en || 'Tin tức không có tiêu đề')
              : (post.title_en || post.title_vi || 'Untitled news');
            
            const excerpt = displayLanguage === 'vi'
              ? (post.excerpt_vi || post.excerpt_en || '')
              : (post.excerpt_en || post.excerpt_vi || '');
            
            const content = displayLanguage === 'vi'
              ? (post.content_vi || post.content_en || '')
              : (post.content_en || post.content_vi || '');
            
            const slug = displayLanguage === 'vi'
              ? (post.slug_vi || post.slug_en || `tin-tuc-${post.id}`)
              : (post.slug_en || post.slug_vi || `news-${post.id}`);
            
            const category = post.category || (displayLanguage === 'vi' ? 'Tin tức' : 'News');

            return {
              id: post.id,
              displayTitle: title,
              displayExcerpt: excerpt,
              displaySlug: slug,
              displayCategory: category,
              readTime: calculateReadTime(content),
              image: post.image,
              author: post.author,
              created_at: post.created_at,
              date: post.date || post.created_at,
              is_featured: post.is_featured || false,
              source: post.source,
              tags: post.tags || [],
              views: post.views || 0,
            };
          });
          
          setAllNews(enhancedPosts);
        } else {
          setAllNews([]);
        }
      } else {
        setAllNews([]);
      }
    } catch {
      setAllNews([]);
    } finally {
      setLoading(false);
    }
  }, [displayLanguage]);

  useEffect(() => {
    fetchAllNews();
  }, [fetchAllNews]);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(displayLanguage === 'vi' ? 'vi-VN' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // Xử lý view details
  const handleViewDetails = (post: EnhancedNewsPost) => {
    router.push(`/news/${post.displaySlug}`);
  };

  // Tính toán pagination
  const totalPages = Math.ceil(allNews.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentNews = allNews.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="w-32 h-1" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="h-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4 bg-primary" />
                  <Skeleton className="h-7 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {displayLanguage === 'vi' ? 'Tất cả tin tức' : 'All News'}
          </h1>
          <div className="w-24 h-1 bg-primary rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl">
            {displayLanguage === 'vi' 
              ? 'Cập nhật tin tức mới nhất về công nghệ, kinh doanh, thể thao, giải trí và nhiều lĩnh vực khác'
              : 'Latest news updates on technology, business, sports, entertainment and more'}
          </p>
        </div>

        {/* Filter categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {newsCategories.map((category) => (
              <Badge 
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors px-4 py-2"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {allNews.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-6">📰</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">
              {displayLanguage === 'vi' ? 'Chưa có tin tức nào' : 'No news yet'}
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {displayLanguage === 'vi' 
                ? 'Hiện chưa có tin tức nào được đăng tải. Vui lòng quay lại sau.'
                : 'No news have been published yet. Please check back later.'}
            </p>
            <Button 
              onClick={fetchAllNews}
              className="bg-primary hover:bg-primary/90"
            >
              {displayLanguage === 'vi' ? 'Tải lại' : 'Refresh'}
            </Button>
          </div>
        ) : (
          <>
            {/* Featured news badge */}
            {allNews.some(news => news.is_featured) && (
              <div className="mb-8">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                  <Star className="w-3 h-3 mr-1" />
                  {displayLanguage === 'vi' ? 'Tin nổi bật' : 'Featured News'}
                </Badge>
              </div>
            )}

            {/* News grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentNews.map((news, index) => (
                <Card 
                  key={news.id} 
                  className="h-full flex flex-col border border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group"
                  onClick={() => handleViewDetails(news)}
                >
                  {/* Image with featured badge */}
                  <div className="h-48 overflow-hidden relative">
                    <Image
                      src={news.image || getFallbackImage(startIndex + index)}
                      alt={news.displayTitle}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3}
                    />
                    
                    {/* Featured badge */}
                    {news.is_featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary hover:bg-primary/90 text-white border-0">
                          <Star className="w-3 h-3 mr-1" />
                          {displayLanguage === 'vi' ? 'Nổi bật' : 'Featured'}
                        </Badge>
                      </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-gray-800 hover:bg-white">
                        {news.displayCategory}
                      </Badge>
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <CardContent className="p-6 grow flex flex-col">
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 min-h-14 line-clamp-2 text-gray-800 group-hover:text-primary transition-colors">
                      {news.displayTitle}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm grow min-h-16 line-clamp-3 mb-6">
                      {news.displayExcerpt || '...'}
                    </p>

                    {/* Tags */}
                    {news.tags && news.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {news.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-primary/10 text-primary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Meta info */}
                    <div className="mt-auto pt-5 border-t border-gray-200">
                      <div className="flex flex-col gap-2 text-sm text-gray-500">
                        {/* Author and date */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            <span className="font-medium">{news.author || (displayLanguage === 'vi' ? 'Tác giả' : 'Author')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(news.date)}</span>
                          </div>
                        </div>

                        {/* Views and read time */}
                        <div className="flex items-center justify-between">
                          {news.views !== undefined && news.views > 0 && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{news.views}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            {news.source && (
                              <span className="text-xs text-gray-400 truncate max-w-[100px]">
                                {news.source}
                              </span>
                            )}
                            <span>•</span>
                            <span>{news.readTime} {displayLanguage === 'vi' ? 'phút đọc' : 'min read'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80 text-white transition-all group-hover:shadow-lg"
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(news);
                      }}
                    >
                      {displayLanguage === 'vi' ? 'Đọc tin' : 'Read news'}
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {allNews.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-gray-200">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="lg"
                  className="border-gray-300 hover:border-gray-400 hover:text-primary disabled:opacity-40"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {displayLanguage === 'vi' ? 'Trước' : 'Prev'}
                </Button>

                <div className="text-sm text-gray-600 font-medium">
                  {displayLanguage === 'vi' ? 'Trang' : 'Page'} {currentPage} / {totalPages}
                </div>

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="lg"
                  className="border-gray-300 hover:border-gray-400 hover:text-primary disabled:opacity-40"
                >
                  {displayLanguage === 'vi' ? 'Sau' : 'Next'}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
