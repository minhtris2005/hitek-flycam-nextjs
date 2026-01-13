// app/components/home/NewsSection.tsx
"use client";

import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Import images
import photo1 from "@/public/assets/home/news/photo-1.avif";
import photo2 from "@/public/assets/home/news/photo-2.avif";
import photo3 from "@/public/assets/home/news/photo-3.avif";

interface NewsItem {
  title: string;
  excerpt: string;
  category: string;
}

// Static images
const newsImages = [photo1, photo2, photo3, photo3, photo2, photo1];

// Static metadata
const newsMetadata = [
  { id: 1, date: "15/12/2024", readTime: "5" },
  { id: 2, date: "10/12/2024", readTime: "4" },
  { id: 3, date: "05/12/2024", readTime: "7" },
  { id: 4, date: "05/12/2024", readTime: "8" },
  { id: 5, date: "05/12/2024", readTime: "10" },
  { id: 6, date: "05/12/2024", readTime: "9" }
];

export default function NewsSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Xác định ngôn ngữ hiển thị
  const displayLanguage = t("lang") === 'vi' ? 'vi' : 'en';

  // Get news items from translation
  const newsItems = t<NewsItem[]>("home.newsSection.news");
  
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
              {t<string>("home.newsSection.title")}{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-red-400">
                {t<string>("home.newsSection.highlight")}
              </span>
            </motion.h2>
            
            <motion.p 
              variants={headerVariants}
              className="text-muted-foreground text-lg max-w-2xl"
            >
              {t<string>("home.newsSection.subtitle")}
            </motion.p>
          </div>
          
          <motion.div
            variants={buttonVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-50 transition-all duration-300 group/btn"
            >
              {t<string>("home.newsSection.viewAllNews")}
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
          </motion.div>
        </motion.div>

        {/* News Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {newsItems.map((item: NewsItem, index: number) => (
            <motion.article
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                boxShadow: "0 20px 40px rgba(239, 68, 68, 0.15)"
              }}
              className="group relative"
            >
              {/* News Card */}
              <div className="bg-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border border-border group-hover:border-red-300">
                {/* Image Container */}
                <motion.div 
                  className="relative overflow-hidden h-56"
                >
                  <Image
                    src={newsImages[index]}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                      {displayLanguage === 'vi' ? 'Đọc bài viết' : 'Read Article'}
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
                      <span>{newsMetadata[index]?.date}</span>
                    </motion.div>
                    
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Clock className="w-4 h-4 text-red-500" />
                      <span>{newsMetadata[index]?.readTime} {displayLanguage === 'vi' ? 'phút đọc' : 'min read'}</span>
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
                        {displayLanguage === 'vi' ? 'Đọc tiếp' : 'Read More'}
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
              {/* Background Glow */}
              <motion.div 
                className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
              />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}