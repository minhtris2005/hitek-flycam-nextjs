// app/components/home/NewsSection.tsx
"use client";

import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Skeleton } from "@/app/components/ui/skeleton";

// Import fallback images
import photo1 from "@/public/assets/home/news/photo-1.webp";
import photo2 from "@/public/assets/home/news/photo-2.webp";
import photo3 from "@/public/assets/home/news/photo-3.webp";

interface News {
  id: string;
  title_vi: string;
  title_en?: string | null;
  excerpt_vi?: string | null;
  excerpt_en?: string | null;
  content_vi?: string | null;
  content_en?: string | null;
  image?: string | null;
  category?: string | null;
  date?: string | null;
  created_at?: string;
  slug_vi: string;
  slug_en?: string | null;
  is_featured?: boolean | null;
}

interface DisplayNews {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  slug: string;
  date: string;
  readTime: number;
}

// Static fallback images
const fallbackImages = [photo1, photo2, photo3, photo3, photo2, photo1];

// Calculate read time from content
const calculateReadTime = (content: string): number => {
  const words = content?.trim().split(/\s+/).length || 0;
  return Math.max(Math.ceil(words / 200), 3);
};

// Format date
const formatDate = (dateString: string, language: 'vi' | 'en'): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return '';
  }
};

export default function NewsSection() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [newsItems, setNewsItems] = useState<DisplayNews[]>([]);
  const [loading, setLoading] = useState(true);

  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  // Helper function to get string from translation
  const getString = (key: string): string => {
    const value = t(key);
    return typeof value === 'string' ? value : String(value || key);
  };

  // Fetch news from Supabase
  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase env variables');
        setNewsItems([]);
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
        const data: News[] = await response.json();

        if (data && data.length > 0) {
          const displayNews: DisplayNews[] = data.map((news, index) => {
            const title = displayLanguage === 'vi'
              ? (news.title_vi || news.title_en || 'Tin tức')
              : (news.title_en || news.title_vi || 'News');

            const excerpt = displayLanguage === 'vi'
              ? (news.excerpt_vi || news.excerpt_en || '')
              : (news.excerpt_en || news.excerpt_vi || '');

            const content = displayLanguage === 'vi'
              ? (news.content_vi || news.content_en || '')
              : (news.content_en || news.content_vi || '');

            const slug = displayLanguage === 'vi'
              ? (news.slug_vi || news.slug_en || news.id)
              : (news.slug_en || news.slug_vi || news.id);

            const category = news.category || (displayLanguage === 'vi' ? 'Tin tức' : 'News');

            return {
              id: news.id,
              title,
              excerpt,
              category,
              image: news.image || fallbackImages[index % fallbackImages.length].src,
              slug,
              date: formatDate(news.date || news.created_at || '', displayLanguage),
              readTime: calculateReadTime(content),
            };
          });

          setNewsItems(displayNews);
        } else {
          setNewsItems([]);
        }
      } else {
        setNewsItems([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  }, [displayLanguage]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

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
      <section ref={ref} className="py-20 bg-greywhite">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6">
            <div className="flex-1">
              <Skeleton className="h-12 w-80 mb-4" />
              <Skeleton className="h-6 w-96" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-card rounded-2xl overflow-hidden border border-gray-300">
                <Skeleton className="h-56 w-full" />
                <div className="p-6">
                  <div className="flex gap-4 mb-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (newsItems.length === 0) {
    return (
      <section ref={ref} className="py-20 bg-greywhite">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-5xl mb-6">📰</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">
              {displayLanguage === 'vi' ? 'Chưa có tin tức nào' : 'No news yet'}
            </h3>
            <p className="text-gray-600">
              {displayLanguage === 'vi' ? 'Vui lòng quay lại sau.' : 'Please check back later.'}
            </p>
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {newsItems.map((item, index) => (
            <motion.article
              key={item.id}
              variants={itemVariants}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(239, 68, 68, 0.05)"
              }}
              className="group relative"
            >
              <Link href={`/news/${item.slug}`}>
                {/* News Card */}
                <div className="bg-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border border-gray-300 group-hover:border-red-300">
                  {/* Image Container */}
                  <motion.div
                    className="relative overflow-hidden h-56"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 3}
                    />

                    {/* linear Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <motion.div
                      className="absolute top-4 right-4"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <span className="bg-linear-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {item.category}
                      </span>
                    </motion.div>

                    {/* Read More Overlay */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Button className="bg-white text-red-600 hover:bg-white/90 font-semibold px-6 py-3 rounded-full shadow-lg">
                        {language === 'vi' ? 'Đọc bài viết' : 'Read Article'}
                      </Button>
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
                        <span>{item.date}</span>
                      </motion.div>

                      <motion.div
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Clock className="w-4 h-4 text-red-500" />
                        <span>{item.readTime} {language === 'vi' ? 'phút đọc' : 'min read'}</span>
                      </motion.div>
                    </div>

                    {/* Title */}
                    <motion.h3
                      className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300"
                    >
                      {item.title}
                    </motion.h3>

                    {/* Excerpt */}
                    <motion.p
                      className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed"
                    >
                      {item.excerpt}
                    </motion.p>

                    {/* Read More Button */}
                    <motion.div
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
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
                    </motion.div>
                  </div>
                </div>
              </Link>
              {/* Background Glow */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-br from-red-600/2 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
              />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
