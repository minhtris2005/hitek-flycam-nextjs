// components/blog/BlogClient.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import BlogCarousel from "./BlogCarousel";
import ThumbnailCarousel from "./ThumbnailCarousel";
import AllBlogsPage from "./AllBlogsPage";
import { EnhancedBlogPost } from "@/types";

// Helper functions
const getFallbackImage = (): string => {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522031150111-0fdb8ce8d2e7?w=800&auto=format&fit=crop',
  ];
  const randomIndex = Math.floor(Math.random() * fallbackImages.length);
  return fallbackImages[randomIndex];
};

const getDefaultPosts = (): EnhancedBlogPost[] => {
  const sampleImages = [
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522031150111-0fdb8ce8d2e7?w=800&auto=format&fit=crop',
  ];

  return Array.from({ length: 6 }).map((_, idx) => ({
    id: `${idx + 1}`,
    title: `Bài viết mẫu ${idx + 1}`,
    title_vi: `Bài viết mẫu ${idx + 1}`,
    title_en: `Sample Post ${idx + 1}`,
    excerpt: `Đây là mô tả mẫu cho bài viết ${idx + 1} về drone và flycam`,
    excerpt_vi: `Đây là mô tả mẫu cho bài viết ${idx + 1} về drone và flycam`,
    excerpt_en: `This is sample description for post ${idx + 1} about drones`,
    content: `Nội dung mẫu cho bài viết ${idx + 1}...`,
    content_vi: `Nội dung mẫu cho bài viết ${idx + 1}...`,
    content_en: `Sample content for post ${idx + 1}...`,
    image: sampleImages[idx],
    category: idx % 3 === 0 ? 'Tin tức' : idx % 3 === 1 ? 'Hướng dẫn' : 'Công nghệ',
    author: 'Hitek Team',
    status: 'published',
    created_at: new Date().toISOString(),
    views: Math.floor(Math.random() * 1000),
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 50),
    tags: ['drone', 'flycam', 'technology'],
    meta_title: `Bài viết ${idx + 1}`,
    meta_description: `Mô tả bài viết ${idx + 1}`,
    readTime: `${Math.floor(Math.random() * 10) + 1} min`,
    slug: `bai-viet-mau-${idx + 1}`,
    date: new Date(Date.now() - idx * 86400000).toISOString(),
    slug_vi: `bai-viet-mau-${idx + 1}`,
    slug_en: `sample-post-${idx + 1}`,
    hasEnglish: true,
    hasVietnamese: true,
  }));
};

// Helper to safely get translation value
const getSafeTranslation = (value: unknown, fallback: string = ""): string => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

interface BlogClientProps {
  initialPosts?: EnhancedBlogPost[];
}

// Interface cho Supabase response
interface SupabaseBlogPost {
  id: string;
  title: string;
  title_vi?: string;
  title_en?: string;
  excerpt?: string;
  excerpt_vi?: string;
  excerpt_en?: string;
  content?: string;
  content_vi?: string;
  content_en?: string;
  image?: string;
  category?: string;
  author?: string;
  status: string;
  created_at: string;
  views?: number;
  likes?: number;
  comments?: number;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  readTime?: string;
  slug?: string;
  slug_vi?: string;
  slug_en?: string;
}

export default function BlogClient({ initialPosts }: BlogClientProps) {
  const { t } = useLanguage();
  const [blogPosts, setBlogPosts] = useState<EnhancedBlogPost[]>(initialPosts || []);
  const [loading, setLoading] = useState(!initialPosts);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const router = useRouter();
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const backgroundImageRef = useRef<HTMLDivElement>(null);
  const allBlogsRef = useRef<HTMLDivElement>(null);

  // Determine display language (only vi or en)
  const displayLanguage = getSafeTranslation(t("lang")) === 'vi' ? 'vi' : 'en';

  const fetchBlogPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase env variables');
        setBlogPosts(getDefaultPosts());
        return;
      }

      const response = await fetch(
        `${supabaseUrl}/rest/v1/blog_posts?status=eq.published&order=created_at.desc&limit=6`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json() as SupabaseBlogPost[];
        
        if (data && data.length > 0) {
          const enhancedPosts: EnhancedBlogPost[] = data.map((post) => ({
            id: post.id,
            title: post.title || '',
            title_vi: post.title_vi,
            title_en: post.title_en,
            excerpt: post.excerpt || '',
            excerpt_vi: post.excerpt_vi,
            excerpt_en: post.excerpt_en,
            content: post.content || '',
            content_vi: post.content_vi,
            content_en: post.content_en,
            image: post.image,
            category: post.category,
            author: post.author,
            status: post.status as 'published' | 'draft',
            created_at: post.created_at,
            views: post.views || 0,
            likes: post.likes || 0,
            comments: post.comments || 0,
            tags: post.tags || [],
            meta_title: post.meta_title,
            meta_description: post.meta_description,
            readTime: post.readTime || '5 min',
            slug: post.slug || `post-${post.id}`,
            date: post.created_at || new Date().toISOString(),
            slug_vi: post.slug_vi,
            slug_en: post.slug_en,
            hasEnglish: !!post.title_en || !!post.content_en,
            hasVietnamese: !!post.title_vi || !!post.content_vi,
          }));
          
          setBlogPosts(enhancedPosts);
        } else {
          setBlogPosts(getDefaultPosts());
        }
      } else {
        console.warn('Failed to fetch from Supabase, using default posts');
        setBlogPosts(getDefaultPosts());
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setBlogPosts(getDefaultPosts());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialPosts) {
      fetchBlogPosts();
    }
  }, [fetchBlogPosts, initialPosts]);

  // Add scroll listener to show "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      if (allBlogsRef.current) {
        const rect = allBlogsRef.current.getBoundingClientRect();
        setShowBackToTop(rect.top < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll down to AllBlogsPage
  const scrollToAllBlogs = () => {
    if (allBlogsRef.current) {
      allBlogsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Function to change slide with animation
  const showSlider = (type: 'next' | 'prev') => {
    if (isAnimating || blogPosts.length <= 1) return;

    setIsAnimating(true);

    // Disable buttons during animation
    if (nextBtnRef.current) nextBtnRef.current.disabled = true;
    if (prevBtnRef.current) prevBtnRef.current.disabled = true;

    // Determine new index
    const newIndex = type === 'next'
      ? (currentIndex + 1) % blogPosts.length
      : currentIndex === 0 ? blogPosts.length - 1 : currentIndex - 1;

    // Get elements to fade - ONLY IMAGE AND BLOG CONTENT, NOT CONTROLS
    const blogContentWrapper = carouselRef.current?.querySelector('.blog-content-wrapper');

    // Start fading out content
    if (blogContentWrapper) {
      (blogContentWrapper as HTMLElement).style.opacity = '0';
      (blogContentWrapper as HTMLElement).style.transform = 'scale(0.98)';
      (blogContentWrapper as HTMLElement).style.transition = 'all 0.3s ease-in-out';
    }

    // After fade out completes, change content
    setTimeout(() => {
      // Change currentIndex
      setCurrentIndex(newIndex);

      // Wait a bit for new content to render, then fade in
      requestAnimationFrame(() => {
        // Restore blog content
        if (blogContentWrapper) {
          (blogContentWrapper as HTMLElement).style.opacity = '1';
          (blogContentWrapper as HTMLElement).style.transform = 'scale(1)';
        }
      });

      // End animation and reset styles
      setTimeout(() => {
        // Reset styles
        if (blogContentWrapper) {
          (blogContentWrapper as HTMLElement).style.transition = '';
        }

        setIsAnimating(false);
        if (nextBtnRef.current) nextBtnRef.current.disabled = false;
        if (prevBtnRef.current) prevBtnRef.current.disabled = false;
      }, 400);
    }, 300);
  };

  // Handle thumbnail click
  const handleThumbnailClick = (clickedIndex: number) => {
    if (!isAnimating && clickedIndex !== currentIndex) {
      setCurrentIndex(clickedIndex);
    }
  };

  // Handle view details click
  const handleViewDetails = (postId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
      // Use slug by current language
      const slug = displayLanguage === 'vi'
        ? (post.slug_vi || post.slug_en || post.slug || post.id)
        : (post.slug_en || post.slug_vi || post.slug || post.id);
      router.push(`/blog/${slug}`);
    } else {
      router.push(`/blog/${postId}`);
    }
  };

  // Get posts for thumbnail
  const getThumbnailPosts = () => {
    if (blogPosts.length <= 1) return [];
    const thumbnailPosts = [];
    
    for (let i = 1; i < blogPosts.length; i++) {
      const index = (currentIndex + i) % blogPosts.length;
      thumbnailPosts.push({
        ...blogPosts[index],
        originalIndex: index
      });
    }
    
    return thumbnailPosts;
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <Skeleton className="w-32 h-8 bg-gray-800" />
        <div className="text-white text-xl ml-4">
          {getSafeTranslation(t('loading_posts'), 'Loading posts...')}
        </div>
      </div>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">
          {getSafeTranslation(t('no_posts'), 'No posts available')}
        </div>
      </div>
    );
  }

  const currentPost = blogPosts[currentIndex];
  const thumbnailPosts = getThumbnailPosts();

  // Prepare props with correct types
  const blogCarouselProps = {
    currentPost,
    currentIndex,
    blogPostsLength: blogPosts.length,
    backgroundImageRef: backgroundImageRef as React.RefObject<HTMLDivElement>,
    getFallbackImage,
  };

  const blogControlsProps = {
    isAnimating,
    onPrev: () => showSlider('prev'),
    onNext: () => showSlider('next'),
    onViewDetails: handleViewDetails,
    onViewAllPosts: scrollToAllBlogs,
    currentPostId: currentPost.id,
    prevBtnRef: prevBtnRef as React.RefObject<HTMLButtonElement>,
    nextBtnRef: nextBtnRef as React.RefObject<HTMLButtonElement>,
  };

  const thumbnailCarouselProps = {
    thumbnailPosts,
    isAnimating,
    onThumbnailClick: handleThumbnailClick,
    getFallbackImage,
    thumbnailContainerRef: thumbnailContainerRef as React.RefObject<HTMLDivElement>,
  };

  return (
    <div className="relative">
      {/* Main Blog Carousel section */}
      <div 
        ref={carouselRef}
        className="w-full h-screen overflow-hidden relative bg-black"
      >
        <BlogCarousel 
          {...blogCarouselProps}
          {...blogControlsProps}
        />

        {thumbnailPosts.length > 0 && (
          <ThumbnailCarousel {...thumbnailCarouselProps} />
        )}
      </div>

      {/* AllBlogsPage section - ALWAYS VISIBLE */}
      <div ref={allBlogsRef} className="relative">
        <AllBlogsPage />
      </div>

      {/* Back to Top button - only shows when scrolled down */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-[#d62323] text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors animate-bounce"
          aria-label={getSafeTranslation(t('back_to_top'), 'Back to top')}
        >
          ↑
        </button>
      )}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes showContent {
          0% { opacity: 0; transform: translateY(30px); filter: blur(5px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-showContent { animation: showContent 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        
        @media (max-width: 768px) {
          .thumbnail { 
            max-width: 70vw !important; 
            right: 4px !important; 
            bottom: 4px !important; 
          }
          
          .thumbnail .item { 
            width: 100px !important; 
            height: 140px !important; 
          }
          
          .title { 
            font-size: 2.2rem !important; 
            margin-bottom: 0.75rem !important;
          }
          
          .topic { 
            font-size: 1.75rem !important; 
            margin-bottom: 2rem !important;
          }
          
          .max-w-xs {
            max-width: 180px !important;
          }
          
          .px-12 {
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }
          
          .tracking-\[0\.5em\] {
            letter-spacing: 0.3em !important;
          }
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}