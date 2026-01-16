// components/blog/BlogClient.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import BlogCarousel from "./BlogCarousel";
import ThumbnailCarousel from "./ThumbnailCarousel";
import BlogControls from "./BlogControls";
import AllBlogsPage from "./AllBlogsPage";
import { EnhancedBlogPost } from "@/types";

// Helper functions
const getFallbackImage = (index: number): string => {
  const fallbackImages = [
    "/images/fallback/drone-tech.jpg",
    "/images/fallback/flycam-news.jpg",
    "/images/fallback/aerial-photography.jpg",
    "/images/fallback/drone-review.jpg",
    "/images/fallback/uav-technology.jpg",
    "/images/fallback/aerial-videography.jpg"
  ];
  return fallbackImages[index % fallbackImages.length];
};

const getDefaultPosts = (): EnhancedBlogPost[] => {
  return [
    {
      id: "1",
      title: "Welcome to Hitek Flycam Blog",
      title_vi: "Chào mừng đến với Blog Hitek Flycam",
      title_en: "Welcome to Hitek Flycam Blog",
      excerpt: "Discover the latest in drone technology and aerial photography",
      excerpt_vi: "Khám phá những công nghệ drone và nhiếp ảnh trên không mới nhất",
      excerpt_en: "Discover the latest in drone technology and aerial photography",
      content: "Welcome to our blog about drone technology and aerial photography...",
      content_vi: "Chào mừng đến với blog về công nghệ drone và nhiếp ảnh trên không...",
      content_en: "Welcome to our blog about drone technology and aerial photography...",
      image: "/images/default/drone-blog.jpg",
      category: "Technology",
      author: "Hitek Flycam Team",
      status: "published",
      created_at: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: 0,
      tags: ["drone", "technology", "blog"],
      meta_title: "Welcome to Hitek Flycam Blog",
      meta_description: "Discover the latest in drone technology and aerial photography",
      readTime: "5 min",
      slug: "welcome-to-hitek-flycam-blog",
      date: new Date().toISOString(),
      slug_vi: "chao-mung-den-voi-blog-hitek-flycam",
      slug_en: "welcome-to-hitek-flycam-blog",
      hasEnglish: true,
      hasVietnamese: true,
    }
  ];
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

  // Fetch main blog data (first 6 posts)
  const fetchBlogPosts = useCallback(async () => {
    try {
      // Replace with your actual fetch logic
      // const response = await fetch('/api/blog-posts');
      // const data = await response.json();
      
      // For now, use default posts
      setBlogPosts(getDefaultPosts());
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setBlogPosts(getDefaultPosts());
    } finally {
      setLoading(false);
    }
  }, []); // Removed displayLanguage dependency

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
        <BlogCarousel {...blogCarouselProps}>
          <BlogControls {...blogControlsProps} />
        </BlogCarousel>

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