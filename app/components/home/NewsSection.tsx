// app/components/home/NewsSection.tsx
"use client";

import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";

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
  formattedDate: string;
  image?: string | null;
  author?: string | null;
  is_featured: boolean;
  tags?: string[];
  views?: number;
}

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
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop',
  ];
  return images[index % images.length];
};

interface NewsSectionProps {
  initialNews?: NewsPost[];
}

export default function NewsSection({ initialNews }: NewsSectionProps) {
  const { t, language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [newsItems, setNewsItems] = useState<EnhancedNewsPost[]>([]);
  const [loading, setLoading] = useState(initialNews ? false : true);

  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  // Helper function để format date
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

  // Process và chuyển đổi dữ liệu
  useEffect(() => {
    const processNews = (newsData: NewsPost[]) => {
      if (newsData && newsData.length > 0) {
        const enhancedPosts: EnhancedNewsPost[] = newsData.map((post, index) => {
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
            formattedDate: formatDate(post.date || post.created_at),
            image: post.image,
            author: post.author,
            is_featured: post.is_featured || false,
            tags: post.tags || [],
            views: post.views || 0,
          };
        });
        
        setNewsItems(enhancedPosts);
      } else {
        setNewsItems([]);
      }
      setLoading(false);
    };

    if (initialNews) {
      processNews(initialNews);
    } else {
      // Fetch dữ liệu nếu không có initial data
      const fetchNews = async () => {
        try {
          setLoading(true);
          
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          
          if (!supabaseUrl || !supabaseKey) {
            console.warn("Supabase environment variables are not configured");
            setNewsItems([]);
            return;
          }
          
          // Lấy 3 bài viết mới nhất
          const response = await fetch(
            `${supabaseUrl}/rest/v1/news?status=eq.published&order=created_at.desc&limit=3`,
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
            processNews(data);
          } else {
            console.error("Failed to fetch news from Supabase");
            setNewsItems([]);
          }
        } catch (error) {
          console.error("Error fetching news:", error);
          setNewsItems([]);
        } finally {
          setLoading(false);
        }
      };

      fetchNews();
    }
  }, [displayLanguage, initialNews]);

  // Helper function để lấy string từ translation
  const getString = (key: string): string => {
    const value = t(key);
    return typeof value === 'string' ? value : String(value || key);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.7
      }
    }
  };

  const headerVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: -20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const buttonVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: 20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
        delay: 0.5
      }
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-20 bg-greywhite">
        <div className="container mx-auto px-4">
          {/* Header skeleton */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6">
            <div className="flex-1">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <Skeleton className="h-12 w-32" />
          </div>
          
          {/* News grid skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden h-full border border-gray-300">
                <Skeleton className="h-56 w-full" />
                <div className="p-6">
                  <Skeleton className="h-4 w-24 bg-gray-200 rounded mb-4" />
                  <Skeleton className="h-6 w-full bg-gray-200 rounded mb-3" />
                  <Skeleton className="h-4 w-full bg-gray-200 rounded mb-2" />
                  <Skeleton className="h-4 w-2/3 bg-gray-200 rounded mb-6" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32 bg-gray-200 rounded" />
                    <Skeleton className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={ref}
      className="py-20 bg-greywhite"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6"
        >
          <div className="flex-1">
            <motion.h2 
              variants={headerVariants}
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            >
              {getString("home.newsSection.title")}{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-red-400">
                {getString("home.newsSection.highlight")}
              </span>
            </motion.h2>
            
            <motion.p 
              variants={headerVariants}
              className="text-muted-foreground text-lg max-w-2xl"
            >
              {getString("home.newsSection.subtitle")}
            </motion.p>
          </div>
          
          <motion.div
            variants={buttonVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/news">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-2 border-red-600 text-red-600 transition-all duration-300 group/btn"
              >
                {getString("home.newsSection.viewAllNews")}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    repeatDelay: 1 
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* News Grid */}
        {newsItems.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📰</div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-700">
              {displayLanguage === 'vi' ? 'Chưa có tin tức nào' : 'No news yet'}
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {displayLanguage === 'vi' 
                ? 'Hiện chưa có tin tức nào được đăng tải. Vui lòng quay lại sau.'
                : 'No news have been published yet. Please check back later.'}
            </p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {newsItems.map((news) => (
              <motion.article
                key={news.id}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 40px rgba(239, 68, 68, 0.05)"
                }}
                className="group relative"
              >
                {/* News Card */}
                <div className="bg-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border border-gray-300 group-hover:border-red-300">
                  {/* Image Container */}
                  <motion.div 
                    className="relative overflow-hidden h-56"
                  >
                    <Image
                      src={news.image || getFallbackImage(parseInt(news.id) || 0)}
                      alt={news.displayTitle}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <motion.div 
                      className="absolute top-4 right-4"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <span className="bg-linear-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {news.displayCategory}
                      </span>
                    </motion.div>
                    
                    {/* Featured Badge */}
                    {news.is_featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                          {displayLanguage === 'vi' ? 'Nổi bật' : 'Featured'}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Read More Overlay */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Link href={`/news/${news.displaySlug}`} className="z-10">
                        <Button className="bg-white text-red-600 hover:bg-white/90 font-semibold px-6 py-3 rounded-full shadow-lg">
                          {language === 'vi' ? 'Đọc bài viết' : 'Read Article'}
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <motion.div 
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span>{news.formattedDate}</span>
                      </motion.div>
                      
                      <motion.div
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Clock className="w-4 h-4 text-red-500" />
                        <span>{news.readTime} {language === 'vi' ? 'phút đọc' : 'min read'}</span>
                      </motion.div>
                      
                      {news.author && (
                        <motion.div
                          className="flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                        >
                          <User className="w-4 h-4 text-red-500" />
                          <span>{news.author}</span>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Title */}
                    <motion.h3 
                      className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300"
                    >
                      <Link href={`/news/${news.displaySlug}`} className="hover:underline">
                        {news.displayTitle}
                      </Link>
                    </motion.h3>
                    
                    {/* Excerpt */}
                    <motion.p 
                      className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed"
                    >
                      {news.displayExcerpt}
                    </motion.p>
                    
                    {/* Tags */}
                    {news.tags && news.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {news.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Read More Button */}
                    <motion.div
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href={`/news/${news.displaySlug}`}>
                        <Button
                          variant="ghost"
                          className="p-0 h-auto text-red-600 hover:text-red-500 hover:bg-transparent group/btn"
                        >
                          <span className="flex items-center gap-2 font-semibold">
                            {language === 'vi' ? 'Đọc tiếp' : 'Read More'}
                            <motion.span
                              className="inline-block"
                              animate={{ x: [0, 5, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                repeatDelay: 0.5
                              }}
                            >
                              →
                            </motion.span>
                          </span>
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
                {/* Background Glow */}
                <motion.div 
                  className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-br from-red-600/2 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                />
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
