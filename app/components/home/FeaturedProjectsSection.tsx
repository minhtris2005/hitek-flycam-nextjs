// app/components/home/FeaturedProjectsSection.tsx
"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Skeleton } from "@/app/components/ui/skeleton";

// Import fallback images
import photo1 from "@/public/assets/home/project/photo-1.webp";
import photo2 from "@/public/assets/home/project/photo-2.webp";
import photo3 from "@/public/assets/home/project/photo-3.webp";
import photo4 from "@/public/assets/home/project/photo-4.webp";

interface Project {
  id: string;
  title_vi: string;
  title_en?: string | null;
  excerpt_vi?: string | null;
  excerpt_en?: string | null;
  image?: string | null;
  category?: string | null;
  project_type?: string | null;
  slug_vi: string;
  slug_en?: string | null;
  location?: string | null;
}

interface DisplayProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  slug: string;
}

// Static fallback images
const fallbackImages = [photo1, photo2, photo3, photo4, photo1, photo2];

export default function FeaturedProjectsSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [projects, setProjects] = useState<DisplayProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to safely get string
  const getString = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Helper function to get language
  const getDisplayLanguage = (): 'vi' | 'en' => {
    const langValue = t("lang");
    return getString(langValue) === 'vi' ? 'vi' : 'en';
  };

  const displayLanguage = getDisplayLanguage();

  // Fetch projects from Supabase
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase env variables');
        setProjects([]);
        return;
      }

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

        if (data && data.length > 0) {
          const displayProjects: DisplayProject[] = data.map((project, index) => {
            const title = displayLanguage === 'vi'
              ? (project.title_vi || project.title_en || 'Dự án')
              : (project.title_en || project.title_vi || 'Project');

            const description = displayLanguage === 'vi'
              ? (project.excerpt_vi || project.excerpt_en || '')
              : (project.excerpt_en || project.excerpt_vi || '');

            const slug = displayLanguage === 'vi'
              ? (project.slug_vi || project.slug_en || project.id)
              : (project.slug_en || project.slug_vi || project.id);

            const category = project.category || project.project_type || (displayLanguage === 'vi' ? 'Dự án' : 'Project');

            return {
              id: project.id,
              title,
              category,
              description,
              image: project.image || fallbackImages[index % fallbackImages.length].src,
              slug,
            };
          });

          setProjects(displayProjects);
        } else {
          setProjects([]);
        }
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [displayLanguage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
      <section ref={ref} className="py-16 bg-greywhite">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
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
                  <Skeleton className="h-6 w-24 mb-4" />
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
  if (projects.length === 0) {
    return (
      <section ref={ref} className="py-16 bg-greywhite">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-5xl mb-6">🏗️</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">
              {displayLanguage === 'vi' ? 'Chưa có dự án nào' : 'No projects yet'}
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
              <Link href={`/projects/${project.slug}`}>
                {/* Project Card */}
                <div className="bg-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border border-gray-300">
                  {/* Image Container */}
                  <motion.div
                    className="relative overflow-hidden h-56"
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 3}
                    />

                    {/* linear Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <motion.div
                      className="absolute top-4 left-4"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <span className="bg-linear-to-r from-primary to-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {project.category}
                      </span>
                    </motion.div>

                    {/* View Button on Hover */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-6 py-3 rounded-full shadow-lg">
                        {displayLanguage === 'vi' ? 'Xem chi tiết' : 'View Details'}
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 min-h-14 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-10">
                      {project.description}
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
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
                    </motion.div>
                  </div>
                </div>
              </Link>

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
