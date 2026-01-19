// app/components/projects/ProjectsClient/index.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import ProjectsCarousel from "./ProjectsCarousel";
import ProjectsThumbnailCarousel from "./ProjectsThumbnailCarousel";
import AllProjectsPage from "./AllProjectsPage";
import { Filter, MapPin, Calendar, User, Ruler, Building } from "lucide-react";

// Helper functions
const getFallbackImage = (): string => {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop', // Drone landscape
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop', // Aerial view
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop', // Construction drone
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', // Industrial drone
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&auto=format&fit=crop', // Real estate drone
    'https://images.unsplash.com/photo-1522031150111-0fdb8ce8d2e7?w=800&auto=format&fit=crop', // Survey drone
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

// Interface cho Supabase response
interface SupabaseProject {
  id: string;
  title_vi: string;
  title_en?: string;
  excerpt_vi?: string;
  excerpt_en?: string;
  content_vi?: string;
  content_en?: string;
  slug_vi: string;
  slug_en?: string;
  image?: string;
  category?: string;
  author?: string;
  project_type?: string;
  location?: string;
  area?: number;
  client?: string;
  completion_date?: string;
  status: string;
  created_at: string;
  views?: number;
  meta_title_vi?: string;
  meta_description_vi?: string;
  meta_title_en?: string;
  meta_description_en?: string;
}

interface EnhancedProject {
  id: string;
  title: string;
  title_vi: string;
  title_en?: string;
  excerpt: string;
  excerpt_vi?: string;
  excerpt_en?: string;
  content: string;
  content_vi?: string;
  content_en?: string;
  slug: string;
  slug_vi: string;
  slug_en?: string;
  image?: string;
  category?: string;
  author?: string;
  project_type?: string;
  location?: string;
  area?: number;
  client?: string;
  completion_date?: string;
  status: 'published' | 'draft';
  created_at: string;
  views: number;
  meta_title?: string;
  meta_description?: string;
  hasEnglish: boolean;
  hasVietnamese: boolean;
  date: string;
}

interface ProjectsClientProps {
  initialProjects?: EnhancedProject[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<EnhancedProject[]>(initialProjects || []);
  const [loading, setLoading] = useState(!initialProjects);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    project_type: '',
    location: '',
  });
  
  const router = useRouter();
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const backgroundImageRef = useRef<HTMLDivElement>(null);
  const allProjectsRef = useRef<HTMLDivElement>(null);

  // Determine display language (only vi or en)
  const displayLanguage = language === 'vi' ? 'vi' : 'en';

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

      let query = `${supabaseUrl}/rest/v1/projects?status=eq.published&order=created_at.desc&limit=6`;
      
      // Add filters
      if (filters.category) {
        query += `&category=eq.${encodeURIComponent(filters.category)}`;
      }
      if (filters.project_type) {
        query += `&project_type=eq.${encodeURIComponent(filters.project_type)}`;
      }
      if (filters.location) {
        query += `&location=ilike.%25${encodeURIComponent(filters.location)}%25`;
      }

      const response = await fetch(
        query,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json() as SupabaseProject[];
        
        if (data && data.length > 0) {
          const enhancedProjects: EnhancedProject[] = data.map((project) => ({
            id: project.id,
            title: displayLanguage === 'vi' ? project.title_vi : (project.title_en || project.title_vi),
            title_vi: project.title_vi,
            title_en: project.title_en,
            excerpt: displayLanguage === 'vi' ? (project.excerpt_vi || '') : (project.excerpt_en || project.excerpt_vi || ''),
            excerpt_vi: project.excerpt_vi,
            excerpt_en: project.excerpt_en,
            content: displayLanguage === 'vi' ? (project.content_vi || '') : (project.content_en || project.content_vi || ''),
            content_vi: project.content_vi,
            content_en: project.content_en,
            slug: displayLanguage === 'vi' ? project.slug_vi : (project.slug_en || project.slug_vi),
            slug_vi: project.slug_vi,
            slug_en: project.slug_en,
            image: project.image,
            category: project.category,
            author: project.author,
            project_type: project.project_type,
            location: project.location,
            area: project.area,
            client: project.client,
            completion_date: project.completion_date,
            status: project.status as 'published' | 'draft',
            created_at: project.created_at,
            views: project.views || 0,
            meta_title: displayLanguage === 'vi' ? project.meta_title_vi : (project.meta_title_en || project.meta_title_vi),
            meta_description: displayLanguage === 'vi' ? project.meta_description_vi : (project.meta_description_en || project.meta_description_vi),
            hasEnglish: !!project.title_en || !!project.content_en,
            hasVietnamese: !!project.title_vi || !!project.content_vi,
            date: project.created_at || new Date().toISOString(),
          }));
          
          setProjects(enhancedProjects);
          setCurrentIndex(0); // Reset to first project when filters change
        } else {
          setProjects([]);
        }
      } else {
        console.error('Failed to fetch from Supabase');
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [displayLanguage, filters.category, filters.location, filters.project_type]);

  useEffect(() => {
    if (!initialProjects || (filters.category || filters.project_type || filters.location)) {
      fetchProjects();
    }
  }, [fetchProjects, initialProjects]);

  // Add scroll listener to show "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      if (allProjectsRef.current) {
        const rect = allProjectsRef.current.getBoundingClientRect();
        setShowBackToTop(rect.top < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll down to AllProjectsPage
  const scrollToAllProjects = () => {
    if (allProjectsRef.current) {
      allProjectsRef.current.scrollIntoView({
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
    if (isAnimating || projects.length <= 1) return;

    setIsAnimating(true);

    // Disable buttons during animation
    if (nextBtnRef.current) nextBtnRef.current.disabled = true;
    if (prevBtnRef.current) prevBtnRef.current.disabled = true;

    // Determine new index
    const newIndex = type === 'next'
      ? (currentIndex + 1) % projects.length
      : currentIndex === 0 ? projects.length - 1 : currentIndex - 1;

    // Get elements to fade - ONLY IMAGE AND PROJECT CONTENT, NOT CONTROLS
    const projectContentWrapper = carouselRef.current?.querySelector('.project-content-wrapper');

    // Start fading out content
    if (projectContentWrapper) {
      (projectContentWrapper as HTMLElement).style.opacity = '0';
      (projectContentWrapper as HTMLElement).style.transform = 'scale(0.98)';
      (projectContentWrapper as HTMLElement).style.transition = 'all 0.3s ease-in-out';
    }

    // After fade out completes, change content
    setTimeout(() => {
      // Change currentIndex
      setCurrentIndex(newIndex);

      // Wait a bit for new content to render, then fade in
      requestAnimationFrame(() => {
        // Restore project content
        if (projectContentWrapper) {
          (projectContentWrapper as HTMLElement).style.opacity = '1';
          (projectContentWrapper as HTMLElement).style.transform = 'scale(1)';
        }
      });

      // End animation and reset styles
      setTimeout(() => {
        // Reset styles
        if (projectContentWrapper) {
          (projectContentWrapper as HTMLElement).style.transition = '';
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
  const handleViewDetails = (projectId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const project = projects.find(p => p.id === projectId);
    if (project) {
      // Use slug by current language
      const slug = displayLanguage === 'vi'
        ? project.slug_vi
        : (project.slug_en || project.slug_vi);
      router.push(`/projects/${slug}`);
    } else {
      router.push(`/projects/${projectId}`);
    }
  };

  // Get posts for thumbnail
  const getThumbnailProjects = () => {
    if (projects.length <= 1) return [];
    const thumbnailProjects = [];
    
    for (let i = 1; i < projects.length; i++) {
      const index = (currentIndex + i) % projects.length;
      thumbnailProjects.push({
        ...projects[index],
        originalIndex: index
      });
    }
    
    return thumbnailProjects;
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ category: '', project_type: '', location: '' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <Skeleton className="w-32 h-8 bg-gray-800" />
        <div className="text-white text-xl ml-4">
          {getSafeTranslation(t('loading_projects'), 'Loading projects...')}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">
          {getSafeTranslation(t('no_projects'), 'No projects available')}
        </div>
      </div>
    );
  }

  const currentProject = projects[currentIndex];
  const thumbnailProjects = getThumbnailProjects();

  // Prepare props with correct types
  const projectCarouselProps = {
    currentProject,
    currentIndex,
    projectsLength: projects.length,
    backgroundImageRef: backgroundImageRef as React.RefObject<HTMLDivElement>,
    getFallbackImage,
    displayLanguage,
  };

  const projectControlsProps = {
    isAnimating,
    onPrev: () => showSlider('prev'),
    onNext: () => showSlider('next'),
    onViewDetails: handleViewDetails,
    onViewAllProjects: scrollToAllProjects,
    currentProjectId: currentProject.id,
    prevBtnRef: prevBtnRef as React.RefObject<HTMLButtonElement>,
    nextBtnRef: nextBtnRef as React.RefObject<HTMLButtonElement>,
  };

  const thumbnailCarouselProps = {
    thumbnailProjects,
    isAnimating,
    onThumbnailClick: handleThumbnailClick,
    getFallbackImage,
    thumbnailContainerRef: thumbnailContainerRef as React.RefObject<HTMLDivElement>,
  };

  return (
    <div className="relative">
      {/* Filters for mobile */}
      <div className="lg:hidden fixed top-4 right-4 z-40">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3">
          <details className="dropdown">
            <summary className="btn btn-sm bg-[#d62323] border-none text-white">
              <Filter className="w-4 h-4" />
              <span className="ml-2">{displayLanguage === 'vi' ? 'Lọc' : 'Filter'}</span>
            </summary>
            <div className="dropdown-content bg-base-100 rounded-box p-4 shadow-lg w-64 mt-2">
              <div className="space-y-3">
                <div>
                  <label className="label label-text">
                    {displayLanguage === 'vi' ? 'Loại dự án' : 'Project Type'}
                  </label>
                  <select
                    value={filters.project_type}
                    onChange={(e) => setFilters({...filters, project_type: e.target.value})}
                    className="select select-bordered select-sm w-full"
                  >
                    <option value="">{displayLanguage === 'vi' ? 'Tất cả' : 'All'}</option>
                    {[...new Set(projects.map(p => p.project_type).filter(Boolean))].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label label-text">
                    {displayLanguage === 'vi' ? 'Địa điểm' : 'Location'}
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="select select-bordered select-sm w-full"
                  >
                    <option value="">{displayLanguage === 'vi' ? 'Tất cả' : 'All'}</option>
                    {[...new Set(projects.map(p => p.location).filter(Boolean))].map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={resetFilters}
                    className="btn btn-sm btn-outline flex-1"
                  >
                    {displayLanguage === 'vi' ? 'Xóa' : 'Clear'}
                  </button>
                  <button 
                    onClick={() => setProjects([])} // Trigger refetch
                    className="btn btn-sm btn-primary flex-1 bg-[#d62323] border-none"
                  >
                    {displayLanguage === 'vi' ? 'Áp dụng' : 'Apply'}
                  </button>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Main Project Carousel section */}
      <div 
        ref={carouselRef}
        className="w-full h-screen overflow-hidden relative bg-black"
      >
        <ProjectsCarousel 
          {...projectCarouselProps}
          {...projectControlsProps}
          filters={filters}
          setFilters={setFilters}
        />

        {thumbnailProjects.length > 0 && (
          <ProjectsThumbnailCarousel {...thumbnailCarouselProps} />
        )}
      </div>

      {/* AllProjectsPage section - ALWAYS VISIBLE */}
      <div ref={allProjectsRef} className="relative">
        <AllProjectsPage />
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
