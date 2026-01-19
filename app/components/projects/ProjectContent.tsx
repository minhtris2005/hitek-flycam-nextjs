// app/components/projects/ProjectsCarousel/ProjectContent.tsx
import React from "react";
import { MapPin, Ruler, Building, Calendar, Eye } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface Project {
  id: string;
  title: string;
  excerpt: string;
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

interface ProjectContentProps {
  currentProject: Project;
  currentIndex: number;
  projectsLength: number;
  displayLanguage: 'vi' | 'en';
}

const ProjectContent: React.FC<ProjectContentProps> = ({ 
  currentProject, 
  currentIndex,
  projectsLength,
  displayLanguage
}) => {
  // Format date
  const formatDate = () => {
    if (!currentProject.completion_date && !currentProject.created_at) return '';
    const dateString = currentProject.completion_date || currentProject.created_at;
    const date = new Date(dateString);
    
    if (displayLanguage === 'vi') {
      return date.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getTitle = () => {
    if (displayLanguage === 'vi') {
      return currentProject.title_vi || currentProject.title_en || currentProject.title || 'Không có tiêu đề';
    } else {
      return currentProject.title_en || currentProject.title_vi || currentProject.title || 'No title';
    }
  };
  
  // Format area
  const formatArea = () => {
    if (!currentProject.area) return '';
    const area = currentProject.area;
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
  
  // Get author
  const getAuthor = () => {
    const author = currentProject.author || (displayLanguage === 'vi' ? 'Hitek Team' : 'Hitek Team');
    return author;
  };

  // Get project type translation
  const getProjectType = () => {
    const type = currentProject.project_type || '';
    if (!type) return '';
    
    const typeTranslations: Record<string, string> = {
      'Quay chụp': displayLanguage === 'vi' ? 'Quay chụp' : 'Filming',
      'Khảo sát': displayLanguage === 'vi' ? 'Khảo sát' : 'Survey',
      'Xây dựng': displayLanguage === 'vi' ? 'Xây dựng' : 'Construction',
      'Nông nghiệp': displayLanguage === 'vi' ? 'Nông nghiệp' : 'Agriculture',
      'Bất động sản': displayLanguage === 'vi' ? 'Bất động sản' : 'Real Estate',
      'Sự kiện': displayLanguage === 'vi' ? 'Sự kiện' : 'Events',
      'Công nghiệp': displayLanguage === 'vi' ? 'Công nghiệp' : 'Industrial',
      'Môi trường': displayLanguage === 'vi' ? 'Môi trường' : 'Environmental',
    };
    
    return typeTranslations[type] || type;
  };

  return (
    <>
      {/* Header with Author, Date and Index Indicator - LEFT ALIGNED */}
      <div className="flex items-center justify-between gap-4 mb-10 opacity-0 animate-showContent">
        <div className="flex items-center gap-4">
          {/* Author */}
          <div className="author text-white font-bold tracking-[0.3em] text-xs md:text-sm">
            {getAuthor()}
          </div>

          {/* Separator */}
          <div className="w-1 h-4 bg-[#d62323]"></div>

          {/* Date */}
          <div className="text-white text-xs md:text-sm hidden md:block">
            {formatDate()}
          </div>
        </div>

        {/* Current Index Indicator and Views */}
        <div className="text-white text-sm flex items-center gap-2">
          {/* Views */}
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{currentProject.views || 0}</span>
          </div>

          <div className="w-1 h-4 bg-[#d62323]"></div>

          <span className="text-[#d62323] font-bold">{currentIndex + 1}</span>
          <span className="text-white/70">/</span>
          <span>{projectsLength}</span>
        </div>
      </div>

      {/* Mobile Date - show below on mobile */}
      <div className="text-white/80 text-xs mb-4 opacity-0 animate-showContent md:hidden">
        {formatDate()}
      </div>

      {/* Title - LIMITED TO 3 LINES, LEFT ALIGNED */}
      <h1 className="title text-white font-bold text-3xl md:text-5xl lg:text-5xl mb-6 py-1 opacity-0 animate-showContent animation-delay-200 line-clamp-3 leading-[1.3] md:leading-tight">
        {getTitle()}
      </h1>

      {/* Project Type and Category - LEFT ALIGNED */}
      <div className="flex flex-wrap gap-2 mb-8 opacity-0 animate-showContent animation-delay-400">
        {currentProject.project_type && (
          <span className="inline-flex items-center px-4 py-2 bg-[#d62323] text-white text-sm font-bold rounded-full">
            {getProjectType()}
          </span>
        )}
        {currentProject.category && (
          <span className="inline-flex items-center px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
            {currentProject.category}
          </span>
        )}
      </div>

      {/* Excerpt - Show if available */}
      {currentProject.excerpt && (
        <div className="text-white/90 text-base md:text-lg mb-8 opacity-0 animate-showContent animation-delay-600 line-clamp-2">
          {currentProject.excerpt}
        </div>
      )}

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 opacity-0 animate-showContent animation-delay-800">
        {/* Location */}
        {currentProject.location && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#d62323] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white/70 text-xs mb-1">
                {displayLanguage === 'vi' ? 'Địa điểm' : 'Location'}
              </div>
              <div className="text-white font-medium">
                {currentProject.location}
              </div>
            </div>
          </div>
        )}

        {/* Area */}
        {currentProject.area && (
          <div className="flex items-start gap-3">
            <Ruler className="w-5 h-5 text-[#d62323] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white/70 text-xs mb-1">
                {displayLanguage === 'vi' ? 'Diện tích' : 'Area'}
              </div>
              <div className="text-white font-medium">
                {formatArea()}
              </div>
            </div>
          </div>
        )}

        {/* Client */}
        {currentProject.client && (
          <div className="flex items-start gap-3">
            <Building className="w-5 h-5 text-[#d62323] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white/70 text-xs mb-1">
                {displayLanguage === 'vi' ? 'Khách hàng' : 'Client'}
              </div>
              <div className="text-white font-medium">
                {currentProject.client}
              </div>
            </div>
          </div>
        )}

        {/* Completion Date */}
        {currentProject.completion_date && (
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[#d62323] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white/70 text-xs mb-1">
                {displayLanguage === 'vi' ? 'Hoàn thành' : 'Completed'}
              </div>
              <div className="text-white font-medium">
                {new Date(currentProject.completion_date).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        )}
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
        .animation-delay-800 { animation-delay: 0.8s; }
        
        @media (max-width: 768px) {
          .title { 
            font-size: 2.2rem !important; 
            margin-bottom: 1rem !important;
          }
          
          .topic { 
            font-size: 1.75rem !important; 
            margin-bottom: 2rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default ProjectContent;
