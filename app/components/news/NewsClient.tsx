// components/news/NewsClient.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import NewsCarousel from "./NewsCarousel";
import NewsThumbnailCarousel from "./NewsThumbnailCarousel";
import AllNewsPage from "./AllNewsPage";

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

// Helper to safely get translation value
const getSafeTranslation = (value: unknown, fallback: string = ""): string => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

// Interface cho news từ Supabase
interface SupabaseNewsPost {
  id: string;
  title_vi: string;
  title_en?: string | null;
  excerpt_vi?: string | null;
  excerpt_en?: string | null;
  content_vi?: string | null;
  content_en?: string | null;
  slug_vi: string;
  slug_en?: string | null;
  meta_title_vi?: string | null;
  meta_title_en?: string | null;
  meta_description_vi?: string | null;
  meta_description_en?: string | null;
  image?: string | null;
  date: string;
  author?: string | null;
  category?: string | null;
  status: string;
  is_featured: boolean;
  source?: string | null;
  tags?: string[];
  created_at: string;
  updated_at?: string | null;
  user_id?: string | null;
  views?: number;
}

interface EnhancedNewsPost {
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
  status: 'published' | 'draft';
  created_at: string;
  views?: number;
  likes?: number;
  comments?: number;
  tags?: string[];
  meta_title?: string | null;
  meta_description?: string | null;
  readTime?: string;
  slug?: string | null;
  slug_vi?: string | null;
  slug_en?: string | null;
  date: string;
  is_featured: boolean;
  source?: string | null;
  hasEnglish?: boolean;
  hasVietnamese?: boolean;
}

interface NewsClientProps {
  initialPosts?: EnhancedNewsPost[];
}

export default function NewsClient({ initialPosts }: NewsClientProps) {
  const { language } = useLanguage();
  const [newsPosts, setNewsPosts] = useState<EnhancedNewsPost[]>(initialPosts || []);
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
  const allNewsRef = useRef<HTMLDivElement>(null);

  // Determine display language
  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  // Helper function to calculate read time
  const calculateReadTime = (content: string): number => {
    const words = content?.trim().split(/\s+/).length || 0;
    return Math.ceil(words / 200);
  };

  const fetchNewsPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase env variables');
        setNewsPosts([]);
        return;
      }

      const response = await fetch(
        `${supabaseUrl}/rest/v1/news?status=eq.published&order=created_at.desc&limit=6`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json() as SupabaseNewsPost[];
        
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
              title,
              title_vi: post.title_vi,
              title_en: post.title_en,
              excerpt,
              excerpt_vi: post.excerpt_vi,
              excerpt_en: post.excerpt_en,
              content,
              content_vi: post.content_vi,
              content_en: post.content_en,
              image: post.image,
              category,
              author: post.author,
              status: post.status as 'published' | 'draft',
              created_at: post.created_at,
              views: post.views || 0,
              likes: 0,
              comments: 0,
              tags: post.tags || [],
              meta_title: displayLanguage === 'vi' ? post.meta_title_vi : post.meta_title_en,
              meta_description: displayLanguage === 'vi' ? post.meta_description_vi : post.meta_description_en,
              readTime: `${calculateReadTime(content)} min`,
              slug,
              slug_vi: post.slug_vi,
              slug_en: post.slug_en,
              date: post.date || post.created_at,
              is_featured: post.is_featured || false,
              source: post.source,
              hasEnglish: !!post.title_en || !!post.content_en,
              hasVietnamese: !!post.title_vi || !!post.content_vi,
            };
          });
          
          setNewsPosts(enhancedPosts);
        } else {
          setNewsPosts([]);
        }
      } else {
        console.error('Failed to fetch from Supabase');
        setNewsPosts([]);
      }
    } catch (error) {
      console.error("Error fetching news posts:", error);
      setNewsPosts([]);
    } finally {
      setLoading(false);
    }
  }, [displayLanguage]);

  useEffect(() => {
    if (!initialPosts) {
      fetchNewsPosts();
    }
  }, [fetchNewsPosts, initialPosts]);

  // Add scroll listener to show "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      if (allNewsRef.current) {
        const rect = allNewsRef.current.getBoundingClientRect();
        setShowBackToTop(rect.top < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll down to AllNewsPage
  const scrollToAllNews = () => {
    if (allNewsRef.current) {
      allNewsRef.current.scrollIntoView({
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
    if (isAnimating || newsPosts.length <= 1) return;

    setIsAnimating(true);

    // Disable buttons during animation
    if (nextBtnRef.current) nextBtnRef.current.disabled = true;
    if (prevBtnRef.current) prevBtnRef.current.disabled = true;

    // Determine new index
    const newIndex = type === 'next'
      ? (currentIndex + 1) % newsPosts.length
      : currentIndex === 0 ? newsPosts.length - 1 : currentIndex - 1;

    // Get elements to fade - ONLY IMAGE AND NEWS CONTENT, NOT CONTROLS
    const newsContentWrapper = carouselRef.current?.querySelector('.news-content-wrapper');

    // Start fading out content
    if (newsContentWrapper) {
      (newsContentWrapper as HTMLElement).style.opacity = '0';
      (newsContentWrapper as HTMLElement).style.transform = 'scale(0.98)';
      (newsContentWrapper as HTMLElement).style.transition = 'all 0.3s ease-in-out';
    }

    // After fade out completes, change content
    setTimeout(() => {
      // Change currentIndex
      setCurrentIndex(newIndex);

      // Wait a bit for new content to render, then fade in
      requestAnimationFrame(() => {
        // Restore news content
        if (newsContentWrapper) {
          (newsContentWrapper as HTMLElement).style.opacity = '1';
          (newsContentWrapper as HTMLElement).style.transform = 'scale(1)';
        }
      });

      // End animation and reset styles
      setTimeout(() => {
        // Reset styles
        if (newsContentWrapper) {
          (newsContentWrapper as HTMLElement).style.transition = '';
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
    const post = newsPosts.find(p => p.id === postId);
    if (post) {
      // Use slug by current language
      const slug = displayLanguage === 'vi'
        ? (post.slug_vi || post.slug_en || post.slug || post.id)
        : (post.slug_en || post.slug_vi || post.slug || post.id);
      router.push(`/news/${slug}`);
    } else {
      router.push(`/news/${postId}`);
    }
  };

  // Get posts for thumbnail
  const getThumbnailPosts = () => {
    if (newsPosts.length <= 1) return [];
    const thumbnailPosts = [];
    
    for (let i = 1; i < newsPosts.length; i++) {
      const index = (currentIndex + i) % newsPosts.length;
      thumbnailPosts.push({
        ...newsPosts[index],
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
          {getSafeTranslation('loading_posts', displayLanguage === 'vi' ? 'Đang tải tin tức...' : 'Loading news...')}
        </div>
      </div>
    );
  }

  if (newsPosts.length === 0) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">
          {getSafeTranslation('no_posts', displayLanguage === 'vi' ? 'Chưa có tin tức nào' : 'No news available')}
        </div>
      </div>
    );
  }

  const currentPost = newsPosts[currentIndex];
  const thumbnailPosts = getThumbnailPosts();

  // Prepare props with correct types
  const newsCarouselProps = {
    currentPost,
    currentIndex,
    newsPostsLength: newsPosts.length,
    backgroundImageRef: backgroundImageRef as React.RefObject<HTMLDivElement>,
    getFallbackImage,
  };

  const newsControlsProps = {
    isAnimating,
    onPrev: () => showSlider('prev'),
    onNext: () => showSlider('next'),
    onViewDetails: handleViewDetails,
    onViewAllPosts: scrollToAllNews,
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
      {/* Main News Carousel section */}
      <div 
        ref={carouselRef}
        className="w-full h-screen overflow-hidden relative bg-black"
      >
        <NewsCarousel 
          {...newsCarouselProps}
          {...newsControlsProps}
        />

        {thumbnailPosts.length > 0 && (
          <NewsThumbnailCarousel {...thumbnailCarouselProps} />
        )}
      </div>

      {/* AllNewsPage section - ALWAYS VISIBLE */}
      <div ref={allNewsRef} className="relative">
        <AllNewsPage />
      </div>

      {/* Back to Top button - only shows when scrolled down */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors animate-bounce"
          aria-label={getSafeTranslation('back_to_top', displayLanguage === 'vi' ? 'Về đầu trang' : 'Back to top')}
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
