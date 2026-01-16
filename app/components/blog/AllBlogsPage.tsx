// app/blog/all/page.tsx
'use client';
import Image from 'next/image'; // Thêm import này ở đầu file
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardFooter } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';

// Helper functions đơn giản
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
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
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

  // Fetch blogs trực tiếp từ Supabase REST API
  const fetchAllBlogs = useCallback(async () => {
    try {
      setLoading(true);
      
      // Gọi Supabase REST API trực tiếp
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase env variables');
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogPost[] = await response.json();
      
      // Transform data
      const enhancedPosts: EnhancedBlogPost[] = data.map((post) => {
        // Lấy dữ liệu theo ngôn ngữ
        const title = displayLanguage === 'vi' 
          ? (post.title_vi || post.title_en || post.title || '')
          : (post.title_en || post.title_vi || post.title || '');
        
        const excerpt = displayLanguage === 'vi'
          ? (post.excerpt_vi || post.excerpt_en || post.excerpt || '')
          : (post.excerpt_en || post.excerpt_vi || post.excerpt || '');
        
        const content = displayLanguage === 'vi'
          ? (post.content_vi || post.content_en || post.content || '')
          : (post.content_en || post.content_vi || post.content || '');
        
        const slug = displayLanguage === 'vi'
          ? (post.slug_vi || post.slug_en || generateSlug(title))
          : (post.slug_en || post.slug_vi || generateSlug(title));

        return {
          ...post,
          displayTitle: title,
          displayExcerpt: excerpt,
          displaySlug: slug,
          readTime: calculateReadTime(content),
        };
      });
      
      setAllBlogs(enhancedPosts);
    } catch (error) {
      console.error('Error fetching blogs:', error);
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
    const date = new Date(dateString);
    return date.toLocaleDateString(displayLanguage === 'vi' ? 'vi-VN' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="h-125">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-8 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {displayLanguage === 'vi' ? 'Tất cả bài viết' : 'All Blog Posts'}
          </h1>
          <div className="w-20 h-1 bg-red-600"></div>
        </div>

        {/* Empty state */}
        {allBlogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-600 text-lg mb-4">
              {displayLanguage === 'vi' ? 'Chưa có bài viết nào được đăng.' : 'No blog posts published yet.'}
            </p>
            <Button onClick={fetchAllBlogs}>
              {displayLanguage === 'vi' ? 'Thử lại' : 'Retry'}
            </Button>
          </div>
        ) : (
          <>
            {/* Blog grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBlogs.map((blog, index) => (
                <Card 
                  key={blog.id} 
                  className="h-full cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleViewDetails(blog)}
                >
                  {/* Image */}
                  <div className="h-48 overflow-hidden">
                    <Image
                      src={blog.image || getFallbackImage(startIndex + index)}
                      alt={blog.displayTitle}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <CardContent className="p-6">
                    {/* Category */}
                    <div className="mb-3">
                      <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                        {blog.category || (displayLanguage === 'vi' ? 'Tin tức' : 'News')}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {blog.readTime} {displayLanguage === 'vi' ? 'phút' : 'min'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">
                      {blog.displayTitle}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {blog.displayExcerpt || blog.content?.substring(0, 150) + '...'}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{blog.author || 'Admin'}</span>
                      </div>
                      <div className="text-right">
                        <div>{formatDate(blog.created_at)}</div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(blog);
                      }}
                    >
                      {displayLanguage === 'vi' ? 'Đọc tiếp' : 'Read more'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  ← {displayLanguage === 'vi' ? 'Trước' : 'Prev'}
                </Button>

                <span className="text-sm text-gray-600">
                  {displayLanguage === 'vi' ? 'Trang' : 'Page'} {currentPage} / {totalPages}
                </span>

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  {displayLanguage === 'vi' ? 'Sau' : 'Next'} →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}