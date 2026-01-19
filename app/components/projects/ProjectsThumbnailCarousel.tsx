// app/components/projects/ProjectsThumbnailCarousel/index.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface ThumbnailProject {
  id: string;
  title: string;
  title_vi?: string;
  title_en?: string;
  image?: string;
  project_type?: string;
  location?: string;
  originalIndex: number;
  slug_vi?: string;
  slug_en?: string;
  slug?: string;
  category?: string;
}

interface ProjectsThumbnailCarouselProps {
  thumbnailProjects: ThumbnailProject[];
  isAnimating: boolean;
  onThumbnailClick: (index: number) => void;
  getFallbackImage: (index?: number) => string;
  thumbnailContainerRef: React.RefObject<HTMLDivElement>;
}

const ProjectsThumbnailCarousel: React.FC<ProjectsThumbnailCarouselProps> = ({
  thumbnailProjects,
  isAnimating,
  onThumbnailClick,
  getFallbackImage,
  thumbnailContainerRef
}) => {
  const { language } = useLanguage();

  // Determine display language
  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  // Function to get title by language
  const getTitle = (project: ThumbnailProject) => {
    if (displayLanguage === 'vi') {
      return project.title_vi || project.title_en || project.title || 'Không có tiêu đề';
    } else {
      return project.title_en || project.title_vi || project.title || 'No title';
    }
  };

  // Function to get project type translation
  const getProjectType = (type?: string) => {
    if (!type) return displayLanguage === 'vi' ? 'Dự án' : 'Project';

    const typeTranslations: Record<string, { vi: string, en: string }> = {
      'Quay chụp': { vi: 'Quay chụp', en: 'Filming' },
      'Khảo sát': { vi: 'Khảo sát', en: 'Survey' },
      'Xây dựng': { vi: 'Xây dựng', en: 'Construction' },
      'Nông nghiệp': { vi: 'Nông nghiệp', en: 'Agriculture' },
      'Bất động sản': { vi: 'Bất động sản', en: 'Real Estate' },
      'Sự kiện': { vi: 'Sự kiện', en: 'Events' },
      'Công nghiệp': { vi: 'Công nghiệp', en: 'Industrial' },
      'Môi trường': { vi: 'Môi trường', en: 'Environmental' },
      'Thương mại': { vi: 'Thương mại', en: 'Commercial' },
      'Dân dụng': { vi: 'Dân dụng', en: 'Civil' },
    };

    const translation = typeTranslations[type];
    if (translation) {
      return displayLanguage === 'vi' ? translation.vi : translation.en;
    }
    
    return type;
  };

  // Function to handle thumbnail click
  const handleThumbnailClick = (project: ThumbnailProject, originalIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAnimating) return;

    onThumbnailClick(originalIndex);
  };

  // Function to get safe image source
  const getImageSrc = (project: ThumbnailProject): string => {
    return project.image || getFallbackImage(project.originalIndex);
  };

  // Function to get slug
  const getSlug = (project: ThumbnailProject) => {
    return displayLanguage === 'vi'
      ? (project.slug_vi || project.slug_en || project.slug || project.id.toString())
      : (project.slug_en || project.slug_vi || project.slug || project.id.toString());
  };

  return (
    <div className="thumbnail-section absolute bottom-30 right-8 z-20">
      {/* Title with dynamic language */}
      <div className="text-white mb-4">
        <h3 className="text-xl font-bold">
          {displayLanguage === 'vi' ? 'DỰ ÁN NỔI BẬT' : 'FEATURED PROJECTS'}
        </h3>
        <div className="w-16 h-1 bg-[#d62323] mt-2"></div>
      </div>
      
      <div 
        ref={thumbnailContainerRef}
        className="thumbnail flex gap-3 overflow-x-auto px-2 py-2"
        aria-label={displayLanguage === 'vi' ? "Các dự án khác" : "Other projects"}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#d62323 transparent',
          maxWidth: '50vw',
        }}
      >
        {thumbnailProjects.map((project) => {
          const title = getTitle(project);
          const projectType = getProjectType(project.project_type);
          const location = project.location || '';
          const imageSrc = getImageSrc(project);
          const slug = getSlug(project);
          
          return (
            <article
              key={project.id}
              data-project-id={project.id}
              className="item w-36 h-48 shrink-0 rounded-xl overflow-hidden cursor-pointer relative group"
              onClick={(e) => handleThumbnailClick(project, project.originalIndex, e)}
              aria-label={`Dự án: ${title}`}
            >
              <div className="w-full h-full relative">
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  sizes="144px"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxMzEzMTMiLz48L3N2Zz4="
                />
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/70 to-transparent p-3">
                {/* Project Type Badge */}
                {projectType && (
                  <div className="mb-1">
                    <span className="inline-block px-2 py-1 bg-[#d62323] text-white text-xs font-bold rounded">
                      {projectType}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h2 className="title text-white font-bold text-sm line-clamp-2">
                  {title.length > 30 ? title.substring(0, 30) + '...' : title}
                </h2>
                
                {/* Location */}
                {location && (
                  <div className="flex items-center gap-1 mt-1">
                    <svg 
                      className="w-3 h-3 text-white/80 flex-shrink-0" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                    </svg>
                    <span className="text-white/80 text-xs truncate">
                      {location.length > 15 ? location.substring(0, 15) + '...' : location}
                    </span>
                  </div>
                )}
              </div>

              {/* Hover overlay với Link */}
              <Link 
                href={`/projects/${slug}`}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center no-underline"
              >
                <span className="text-white text-sm font-medium bg-[#d62323] px-3 py-2 rounded-lg">
                  {displayLanguage === 'vi' ? 'Xem dự án' : 'View project'} →
                </span>
              </Link>

              {/* Category indicator */}
              {project.category && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded">
                    {project.category}
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>
      
      {/* CSS for scrollbar and thumbnail-section */}
      <style jsx>{`
        .thumbnail::-webkit-scrollbar {
          height: 6px;
        }
        .thumbnail::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .dark .thumbnail::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .thumbnail::-webkit-scrollbar-thumb {
          background: #d62323;
          border-radius: 3px;
        }
        .thumbnail::-webkit-scrollbar-thumb:hover {
          background: #b91c1c;
        }

        .thumbnail-section {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .dark .thumbnail-section {
          background: rgba(30, 30, 30, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        }

        .thumbnail-section h3 {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .dark .thumbnail-section h3 {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
        }

        .item {
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(214, 35, 35, 0.4);
          border-color: rgba(214, 35, 35, 0.3);
        }

        .dark .item:hover {
          box-shadow: 0 8px 25px rgba(214, 35, 35, 0.5);
        }
        
        /* Drone icon animation */
        @keyframes droneFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }
        
        .item:hover .title::before {
          content: "✈️";
          margin-right: 4px;
          animation: droneFloat 1s ease-in-out infinite;
          display: inline-block;
        }
        
        @media (max-width: 768px) {
          .thumbnail-section {
            right: 4px;
            bottom: 4px;
            max-width: 90vw;
            padding: 12px;
          }
          
          .thumbnail {
            max-width: 80vw !important;
          }
          
          .item {
            width: 120px !important;
            height: 160px !important;
          }
          
          .thumbnail-section h3 {
            font-size: 1.1rem;
          }
        }
        
        @media (max-width: 480px) {
          .thumbnail-section {
            left: 4px;
            right: 4px;
            max-width: 100%;
            bottom: 8px;
          }
          
          .thumbnail {
            max-width: 100% !important;
          }
          
          .item {
            width: 100px !important;
            height: 140px !important;
          }
          
          .item .title {
            font-size: 0.85rem;
          }
        }
        
        /* Smooth loading animation */
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .item.loading {
          background: linear-gradient(
            90deg,
            #2a2a2a 25%,
            #333 50%,
            #2a2a2a 75%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default ProjectsThumbnailCarousel;
