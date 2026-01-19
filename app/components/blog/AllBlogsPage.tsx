// app/blog/all/page.tsx
'use client';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardFooter } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';

// Helper functions
const calculateReadTime = (content: string): number => {
  const words = content?.trim().split(/\s+/).length || 0;
  return Math.ceil(words / 200);
};

const generateSlug = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

const getFallbackImage = (index: number): string => {
  const images = [
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop',
  ];
  return images[index % images.length];
};

interface BlogPost {
  id: string;
  title: string;
  title_vi?: string | null;
  title_en?: string | null;
  excerpt: string;
  excerpt_vi?: string | null;
  excerpt_en?: string | null;
  content: string;
  content_vi?: string | null;
  content_en?: string | null;
  image?: string | null;
  category?: string | null;
  author?: string | null;
  status: string;
  created_at: string;
  slug?: string | null;
  slug_vi?: string | null;
  slug_en?: string | null;
}

interface EnhancedBlogPost extends BlogPost {
  readTime: number;
  displayTitle: string;
  displayExcerpt: string;
  displaySlug: string;
  displayCategory: string;
}

export default function AllBlogsPage() {
  const { t } = useLanguage();
  const [allBlogs, setAllBlogs] = useState<EnhancedBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const router = useRouter();

  // Xác định ngôn ngữ hiển thị
  const displayLanguage = (t('lang')?.toString() === 'vi') ? 'vi' : 'en';

  // Fetch blogs từ Supabase REST API
  const fetchAllBlogs = useCallback(async () => {
    try {
      setLoading(true);
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        setAllBlogs([]);
        return;
      }
      
      const response = await fetch(
        `${supabaseUrl}/rest/v1/blog_posts?status=eq.published&order=created_at.desc`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data: BlogPost[] = await response.json();
        
        if (data && data.length > 0) {
          const enhancedPosts: EnhancedBlogPost[] = data.map((post) => {
            // Lấy dữ liệu theo ngôn ngữ
            const title = displayLanguage === 'vi' 
              ? (post.title_vi || post.title_en || post.title || 'Bài viết không có tiêu đề')
              : (post.title_en || post.title_vi || post.title || 'Untitled post');
            
            const excerpt = displayLanguage === 'vi'
              ? (post.excerpt_vi || post.excerpt_en || post.excerpt || '')
              : (post.excerpt_en || post.excerpt_vi || post.excerpt || '');
            
            const content = displayLanguage === 'vi'
              ? (post.content_vi || post.content_en || post.content || '')
              : (post.content_en || post.content_vi || post.content || '');
            
            const slug = displayLanguage === 'vi'
              ? (post.slug_vi || post.slug_en || generateSlug(title))
              : (post.slug_en || post.slug_vi || generateSlug(title));
            
            const category = post.category || (displayLanguage === 'vi' ? 'Tin tức' : 'News');

            return {
              ...post,
              displayTitle: title,
              displayExcerpt: excerpt,
              displaySlug: slug,
              displayCategory: category,
              readTime: calculateReadTime(content),
            };
          });
          
          setAllBlogs(enhancedPosts);
        } else {
          setAllBlogs([]);
        }
      } else {
        setAllBlogs([]);
      }
    } catch {
      setAllBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [displayLanguage]);

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

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
  const handleViewDetails = (post: EnhancedBlogPost) => {
    router.push(`/blog/${post.displaySlug}`);
  };

  // Tính toán pagination
  const totalPages = Math.ceil(allBlogs.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentBlogs = allBlogs.slice(startIndex, startIndex + postsPerPage);

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
            {displayLanguage === 'vi' ? 'Tất cả bài viết' : 'All Blog Posts'}
          </h1>
          <div className="w-24 h-1 bg-red-600 rounded-full"></div>
        </div>

        {/* Empty state */}
        {allBlogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-6">📝</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">
              {displayLanguage === 'vi' ? 'Chưa có bài viết nào' : 'No blog posts yet'}
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {displayLanguage === 'vi' 
                ? 'Hiện chưa có bài viết nào được đăng tải. Vui lòng quay lại sau.'
                : 'No blog posts have been published yet. Please check back later.'}
            </p>
            <Button 
              onClick={fetchAllBlogs}
              className="bg-primary hover:bg-primary/90"
            >
              {displayLanguage === 'vi' ? 'Tải lại' : 'Refresh'}
            </Button>
          </div>
        ) : (
          <>
            {/* Blog grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentBlogs.map((blog, index) => (
                <Card 
                  key={blog.id} 
                  className="h-full flex flex-col border border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
                  onClick={() => handleViewDetails(blog)}
                >
                  {/* Image */}
                  <div className="h-48 overflow-hidden relative">
                    <Image
                      src={blog.image || getFallbackImage(startIndex + index)}
                      alt={blog.displayTitle}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3}
                    />
                    {/* linear overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <CardContent className="p-6 grow flex flex-col">
                    {/* Category tag */}
                    <div className="mb-4">
                      <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {blog.displayCategory}
                      </span>
                    </div>

                    {/* Title - LUÔN HIỆN 2 DÒNG */}
                    <h3 className="text-xl font-bold mb-3 min-h-14 line-clamp-2 text-gray-800 group-hover:text-primary transition-colors">
                      {blog.displayTitle}
                    </h3>

                    {/* Excerpt - LUÔN HIỆN 3 DÒNG */}
                    <p className="text-gray-600 text-sm grow min-h-16 line-clamp-3 mb-6">
                      {blog.displayExcerpt || blog.content?.substring(0, 120) + '...'}
                    </p>

                    {/* Meta info */}
                    <div className="mt-auto pt-5 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">{blog.author || 'Hitek Team'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <div>{formatDate(blog.created_at)}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80 text-white transition-all"
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(blog);
                      }}
                    >
                      {displayLanguage === 'vi' ? 'Đọc tiếp' : 'Read more'}
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination đơn giản - LUÔN HIỆN KHI CÓ BÀI VIẾT */}
            {allBlogs.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-gray-200">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="lg"
                  className="border-gray-300 hover:border-gray-400 disabled:opacity-40"
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
                  className="border-gray-300 hover:border-gray-400 disabled:opacity-40"
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
