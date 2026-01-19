import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProjectContent from "./ProjectContent";
import ProjectControls from "./ProjectControls";
import { Button } from "@/app/components/ui/button";
import { Filter } from "lucide-react";

// Interface cho project
interface Project {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  image?: string;
  category?: string;
  author?: string;
  project_type?: string;
  location?: string;
  area?: number;
  client?: string;
  completion_date?: string;
  views: number;
  created_at: string;
}

interface ProjectsCarouselProps {
  currentProject: Project;
  currentIndex: number;
  projectsLength: number;
  backgroundImageRef: React.RefObject<HTMLDivElement>;
  getFallbackImage: (index?: number) => string;
  displayLanguage: 'vi' | 'en';
  filters: {
    category: string;
    project_type: string;
    location: string;
  };
  setFilters: (filters: any) => void;
}

interface ExtendedProjectsCarouselProps extends ProjectsCarouselProps {
  isAnimating: boolean;
  onPrev: () => void;
  onNext: () => void;
  onViewDetails: (id: string, e?: React.MouseEvent) => void;
  onViewAllProjects?: () => void;
  currentProjectId: string;
  prevBtnRef: React.RefObject<HTMLButtonElement>;
  nextBtnRef: React.RefObject<HTMLButtonElement>;
}

const ProjectsCarousel: React.FC<ExtendedProjectsCarouselProps> = ({
  currentProject,
  currentIndex,
  projectsLength,
  backgroundImageRef,
  getFallbackImage,
  displayLanguage,
  filters,
  setFilters,
  isAnimating,
  onPrev,
  onNext,
  onViewDetails,
  onViewAllProjects,
  currentProjectId,
  prevBtnRef,
  nextBtnRef,
  children
}) => {
  const [projectImage, setProjectImage] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch image data từ Supabase nếu cần
  useEffect(() => {
    const fetchImageData = async () => {
      if (!currentProject.image) {
        setProjectImage(getFallbackImage(currentIndex));
        return;
      }

      // Nếu image là URL Supabase storage
      if (currentProject.image.includes('supabase.co')) {
        try {
          // Kiểm tra xem ảnh có tồn tại không
          const response = await fetch(currentProject.image, { method: 'HEAD' });
          if (response.ok) {
            setProjectImage(currentProject.image);
          } else {
            setProjectImage(getFallbackImage(currentIndex));
          }
        } catch (error) {
          console.error('Error checking image:', error);
          setProjectImage(getFallbackImage(currentIndex));
        }
      } else {
        setProjectImage(currentProject.image);
      }
      setImageLoading(false);
    };

    fetchImageData();
  }, [currentProject.image, currentIndex, getFallbackImage]);

  const imageSrc = imageLoading ? getFallbackImage(currentIndex) : projectImage;

  // Extract filter options (lấy từ context hoặc props thực tế)
  const categories = [...new Set([currentProject.category].filter(Boolean))];
  const projectTypes = [...new Set([currentProject.project_type].filter(Boolean))];
  const locations = [...new Set([currentProject.location].filter(Boolean))];

  return (
    <div className="relative w-full h-full bg-background">
      <div key={currentProject.id} className="absolute inset-0">
        {/* Background Image */}
        <div ref={backgroundImageRef} className="w-full h-full relative">
          <Image
            src={imageSrc}
            alt={currentProject.title}
            fill
            className="object-cover transition-opacity duration-300"
            loading="eager"
            priority
            sizes="100vw"
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxMzEzMTMiLz48L3N2Zz4="
            onError={(e) => {
              const target = e.currentTarget;
              const fallbackSrc = getFallbackImage(currentIndex);
              if (target.src !== fallbackSrc) {
                target.src = fallbackSrc;
              }
            }}
          />
        </div>

        {/* Gradient overlay - Màu từ blog */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />

        {/* Filters Panel - Desktop */}
        <div className="hidden lg:block absolute top-8 right-8 z-30">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 w-64">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">
                <Filter className="w-4 h-4 inline mr-2" />
                {displayLanguage === 'vi' ? 'Lọc dự án' : 'Filter Projects'}
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-white/70 hover:text-white"
              >
                {showFilters ? '↑' : '↓'}
              </button>
            </div>

            {showFilters && (
              <div className="space-y-3">
                {/* Project Type Filter */}
                {projectTypes.length > 0 && (
                  <div>
                    <label className="block text-sm text-white/80 mb-1">
                      {displayLanguage === 'vi' ? 'Loại dự án' : 'Project Type'}
                    </label>
                    <select
                      value={filters.project_type}
                      onChange={(e) => setFilters({...filters, project_type: e.target.value})}
                      className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white text-sm"
                    >
                      <option value="">{displayLanguage === 'vi' ? 'Tất cả' : 'All'}</option>
                      {projectTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Category Filter */}
                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm text-white/80 mb-1">
                      {displayLanguage === 'vi' ? 'Danh mục' : 'Category'}
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white text-sm"
                    >
                      <option value="">{displayLanguage === 'vi' ? 'Tất cả' : 'All'}</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Location Filter */}
                {locations.length > 0 && (
                  <div>
                    <label className="block text-sm text-white/80 mb-1">
                      {displayLanguage === 'vi' ? 'Địa điểm' : 'Location'}
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white text-sm"
                    >
                      <option value="">{displayLanguage === 'vi' ? 'Tất cả' : 'All'}</option>
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Filter Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ category: '', project_type: '', location: '' })}
                    className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10"
                  >
                    {displayLanguage === 'vi' ? 'Xóa' : 'Clear'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="absolute top-1/4 left-8 md:left-16 lg:left-24 transform -translate-y-1/4 w-full max-w-2xl px-4">
          <div className="max-w-xl">
            {/* ProjectContent ở trên */}
            <div className="project-content-wrapper mb-8">
              <ProjectContent
                currentProject={currentProject}
                currentIndex={currentIndex}
                projectsLength={projectsLength}
                displayLanguage={displayLanguage}
              />
            </div>
            
            {/* ProjectControls ở dưới */}
            <ProjectControls
              isAnimating={isAnimating}
              onPrev={onPrev}
              onNext={onNext}
              onViewDetails={onViewDetails}
              onViewAllProjects={onViewAllProjects}
              currentProjectId={currentProjectId}
              prevBtnRef={prevBtnRef}
              nextBtnRef={nextBtnRef}
              displayLanguage={displayLanguage}
            />
            
            {/* Vẫn giữ children nếu cần */}
            {children}
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes showContent {
          0% { opacity: 0; transform: translateY(30px); filter: blur(5px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-showContent { 
          animation: showContent 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
        }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }

        /* Custom scrollbar for filters */
        select {
          scrollbar-width: thin;
          scrollbar-color: #d62323 #1a1a1a;
        }
        select::-webkit-scrollbar {
          width: 6px;
        }
        select::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        select::-webkit-scrollbar-thumb {
          background-color: #d62323;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default ProjectsCarousel;
