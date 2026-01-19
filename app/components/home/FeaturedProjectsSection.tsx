// app/components/home/FeaturedProjectsSection.tsx
"use client";

import { ArrowRight, MapPin, Ruler, Calendar, Building, Eye } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";

interface Project {
  id: string;
  title_vi: string;
  title_en?: string | null;
  excerpt_vi?: string | null;
  excerpt_en?: string | null;
  slug_vi: string;
  slug_en?: string | null;
  image?: string | null;
  category?: string | null;
  project_type?: string | null;
  location?: string | null;
  area?: number | null;
  client?: string | null;
  completion_date?: string | null;
  status: string;
  created_at: string;
  views?: number | null;
}

interface EnhancedProject {
  id: string;
  displayTitle: string;
  displayExcerpt: string;
  displaySlug: string;
  displayCategory: string;
  displayProjectType: string;
  displayLocation: string;
  formattedArea: string;
  formattedDate: string;
  image?: string | null;
  views?: number | null;
  client?: string | null;
  is_featured?: boolean;
}

// Helper function để lấy fallback image
const getFallbackImage = (index: number): string => {
  const images = [
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
  ];
  return images[index % images.length];
};

interface FeaturedProjectsSectionProps {
  initialProjects?: Project[];
}

export default function FeaturedProjectsSection({ initialProjects }: FeaturedProjectsSectionProps) {
  const { t, language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [projects, setProjects] = useState<EnhancedProject[]>([]);
  const [loading, setLoading] = useState(initialProjects ? false : true);

  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  // Helper function để format area
  const formatArea = (area?: number) => {
    if (!area) return '';
    if (displayLanguage === 'vi') {
      return area >= 10000 
        ? `${(area / 10000).toFixed(1)} ha` 
        : `${area.toLocaleString('vi-VN')} m²`;
    } else {
      return area >= 10000 
        ? `${(area / 10000).toFixed(1)} ha` 
        : `${area.toLocaleString('en-US')} m²`;
    }
  };

  // Helper function để format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(displayLanguage === 'vi' ? 'vi-VN' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Translate project type
  const translateProjectType = (type?: string) => {
    if (!type) return displayLanguage === 'vi' ? 'Dự án' : 'Project';
    
    const translations: Record<string, { vi: string, en: string }> = {
      'Quay chụp': { vi: 'Quay chụp', en: 'Filming' },
      'Khảo sát': { vi: 'Khảo sát', en: 'Survey' },
      'Xây dựng': { vi: 'Xây dựng', en: 'Construction' },
      'Nông nghiệp': { vi: 'Nông nghiệp', en: 'Agriculture' },
      'Bất động sản': { vi: 'Bất động sản', en: 'Real Estate' },
      'Sự kiện': { vi: 'Sự kiện', en: 'Events' },
      'Công nghiệp': { vi: 'Công nghiệp', en: 'Industrial' },
      'Môi trường': { vi: 'Môi trường', en: 'Environmental' },
    };
    
    return translations[type] 
      ? (displayLanguage === 'vi' ? translations[type].vi : translations[type].en)
      : type;
  };

  // Process và chuyển đổi dữ liệu
  useEffect(() => {
    const processProjects = (projectsData: Project[]) => {
      if (projectsData && projectsData.length > 0) {
        const enhancedProjects: EnhancedProject[] = projectsData.map((project, index) => {
          // Lấy dữ liệu theo ngôn ngữ
          const title = displayLanguage === 'vi' 
            ? project.title_vi
            : (project.title_en || project.title_vi || 'Untitled project');
          
          const excerpt = displayLanguage === 'vi'
            ? (project.excerpt_vi || '')
            : (project.excerpt_en || project.excerpt_vi || '');
          
          const slug = displayLanguage === 'vi'
            ? project.slug_vi
            : (project.slug_en || project.slug_vi);
          
          const category = project.category || (displayLanguage === 'vi' ? 'Dự án' : 'Project');

          return {
            id: project.id,
            displayTitle: title,
            displayExcerpt: excerpt,
            displaySlug: slug,
            displayCategory: category,
            displayProjectType: translateProjectType(project.project_type),
            displayLocation: project.location || '',
            formattedArea: formatArea(project.area),
            formattedDate: formatDate(project.completion_date || project.created_at),
            image: project.image,
            views: project.views || 0,
            client: project.client || '',
          };
        });
        
        setProjects(enhancedProjects);
      } else {
        setProjects([]);
      }
      setLoading(false);
    };

    if (initialProjects) {
      processProjects(initialProjects);
    } else {
      // Fetch dữ liệu nếu không có initial data
      const fetchFeaturedProjects = async () => {
        try {
          setLoading(true);
          
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          
          if (!supabaseUrl || !supabaseKey) {
            console.warn("Supabase environment variables are not configured");
            setProjects([]);
            return;
          }
          
          // Lấy 6 projects mới nhất
          const response = await fetch(
            `${supabaseUrl}/rest/v1/projects?status=eq.published&order=created_at.desc&limit=6`,
            {
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.ok) {
            const data: Project[] = await response.json();
            processProjects(data);
          } else {
            console.error("Failed to fetch projects from Supabase");
            setProjects([]);
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
          setProjects([]);
        } finally {
          setLoading(false);
        }
      };

      fetchFeaturedProjects();
    }
  }, [displayLanguage, initialProjects]);

  // Helper function to safely get string
  const getString = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === null || value === undefined) return '';
    return String(value);
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
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
        duration: 0.7
      }
    }
  };

  const titleVariants: Variants = {
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

  const contactUrl = "/contact";

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-16 bg-greywhite">
        <div className="container mx-auto px-4">
          {/* Header skeleton */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
            <div className="flex-1">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <Skeleton className="h-12 w-32" />
          </div>
          
          {/* Projects grid skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden h-full border border-gray-300">
                <Skeleton className="h-56 w-full" />
                <div className="p-6">
                  <Skeleton className="h-4 w-20 mb-4" />
                  <Skeleton className="h-7 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA skeleton */}
          <div className="mt-16 text-center">
            <Skeleton className="h-6 w-64 mx-auto mb-6" />
            <Skeleton className="h-14 w-48 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={ref}
      className="py-16 bg-greywhite"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6"
        >
          <div className="flex-1">
            <motion.h2 
              variants={titleVariants}
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            >
              {getString(t("home.featuredProjects.title"))}{" "}
              <motion.span 
                className="text-primary"
              >
                {getString(t("home.featuredProjects.highlight"))}
              </motion.span>
            </motion.h2>
            <motion.p 
              variants={titleVariants}
              className="text-muted-foreground text-lg max-w-2xl"
            >
              {getString(t("home.featuredProjects.subtitle"))}
            </motion.p>
          </div>
          
          <motion.div
            variants={buttonVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/projects">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-2 border-primary text-primary transition-all duration-300"
              >
                {getString(t("home.featuredProjects.viewAllProjects"))}
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

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
              }}
              className="group relative overflow-hidden"
            >
              {/* Project Card */}
              <div className="bg-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border border-gray-300">
                {/* Image Container */}
                <motion.div 
                  className="relative overflow-hidden h-56"
                >
                  <Image
                    src={project.image || getFallbackImage(index)}
                    alt={project.displayTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Project Type Badge */}
                  <motion.div 
                    className="absolute top-4 left-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <span className="bg-linear-to-r from-primary to-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {project.displayProjectType}
                    </span>
                  </motion.div>
                  
                  {/* Views Counter */}
                  {project.views !== undefined && project.views > 0 && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      <Eye className="w-3 h-3" />
                      <span>{project.views}</span>
                    </div>
                  )}
                  
                  {/* View Button on Hover */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Link href={`/projects/${project.displaySlug}`}>
                      <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-6 py-3 rounded-full shadow-lg">
                        {displayLanguage === 'vi' ? 'Xem chi tiết' : 'View Details'}
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Category tag */}
                  <div className="mb-3">
                    <Badge 
                      variant="secondary" 
                      className="bg-gray-100 text-gray-700 border-gray-300"
                    >
                      {project.displayCategory}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 min-h-14 group-hover:text-primary transition-colors duration-300">
                    <Link href={`/projects/${project.displaySlug}`} className="hover:underline">
                      {project.displayTitle}
                    </Link>
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-10">
                    {project.displayExcerpt}
                  </p>
                  
                  {/* Project details */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {/* Location */}
                    {project.displayLocation && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600 truncate">{project.displayLocation}</span>
                      </div>
                    )}
                    
                    {/* Area */}
                    {project.formattedArea && (
                      <div className="flex items-center gap-1">
                        <Ruler className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600">{project.formattedArea}</span>
                      </div>
                    )}
                    
                    {/* Client */}
                    {project.client && (
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600 truncate">{project.client}</span>
                      </div>
                    )}
                    
                    {/* Date */}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{project.formattedDate}</span>
                    </div>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href={`/projects/${project.displaySlug}`}>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent group/btn"
                      >
                        <span className="flex items-center gap-2">
                          {displayLanguage === 'vi' ? 'Xem chi tiết' : 'View Details'}
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
              
              {/* Glow Effect */}
              <motion.div 
                className="absolute -z-10 top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {projects.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📷</div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-700">
              {displayLanguage === 'vi' ? 'Chưa có dự án nào' : 'No projects yet'}
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {displayLanguage === 'vi' 
                ? 'Hiện chưa có dự án nào được đăng tải. Vui lòng quay lại sau.'
                : 'No projects have been published yet. Please check back later.'}
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6 text-lg">
            {getString(t("home.featuredProjects.cta.projectInquiry"))}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link href={contactUrl}>
              <Button
                size="lg"
                className="bg-linear-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white font-bold py-6 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <span className="flex items-center gap-3">
                  {getString(t("home.featuredProjects.cta.submitProject"))}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                      repeatDelay: 3
                    }}
                    className="group-hover:rotate-90 transition-transform duration-300"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
