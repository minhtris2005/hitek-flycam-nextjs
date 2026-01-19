// app/components/projects/ProjectsCarousel/ProjectControls.tsx
import React from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface ProjectControlsProps {
  isAnimating: boolean;
  onPrev: () => void;
  onNext: () => void;
  onViewDetails: (id: string, e?: React.MouseEvent) => void;
  onViewAllProjects?: () => void;
  currentProjectId: string;
  prevBtnRef: React.RefObject<HTMLButtonElement>;
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  displayLanguage: 'vi' | 'en';
}

const ProjectControls: React.FC<ProjectControlsProps> = ({
  isAnimating,
  onPrev,
  onNext,
  onViewDetails,
  onViewAllProjects,
  currentProjectId,
  prevBtnRef,
  nextBtnRef,
  displayLanguage
}) => {
  const texts = {
    viewDetails: displayLanguage === 'vi' ? 'XEM CHI TIẾT' : 'VIEW DETAILS',
    viewAllProjects: displayLanguage === 'vi' ? 'TẤT CẢ DỰ ÁN' : 'ALL PROJECTS',
    switchProject: displayLanguage === 'vi' ? 'Chuyển dự án' : 'Switch projects',
    viewDetailsAria: displayLanguage === 'vi' ? 'Xem chi tiết dự án' : 'View project details',
    viewAllProjectsAria: displayLanguage === 'vi' ? 'Xem tất cả dự án' : 'View all projects',
    prevProject: displayLanguage === 'vi' ? 'Xem dự án trước' : 'View previous project',
    nextProject: displayLanguage === 'vi' ? 'Xem dự án tiếp theo' : 'View next project',
  };

  return (
    <div className="space-y-8">
      {/* Buttons wrapper */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* VIEW DETAILS Button */}
        <div className="flex-1">
          <button
            onClick={(e) => onViewDetails(currentProjectId, e)}
            className="w-full lg:w-auto bg-[#d62323] text-white font-medium tracking-wider py-3 px-8 hover:bg-red-600 transition-all duration-300 text-lg min-w-50 text-left rounded-3xl hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group cursor-pointer"
            aria-label={texts.viewDetailsAria}
          >
            <span className="flex items-center justify-between gap-2">
              {texts.viewDetails}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </div>

        {/* VIEW ALL PROJECTS Button */}
        {onViewAllProjects && (
          <div className="flex-1">
            <button
              onClick={onViewAllProjects}
              className="cursor-pointer w-full lg:w-auto bg-transparent border-2 border-white text-white font-medium tracking-wider py-3 px-8 hover:bg-white/10 transition-all duration-300 text-lg min-w-50 text-left rounded-3xl hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group"
              aria-label={texts.viewAllProjectsAria}
            >
              <span className="flex items-center justify-between gap-2">
                {texts.viewAllProjects}
                <span className="group-hover:translate-x-1 transition-transform">↓</span>
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center gap-4">
        <button
          ref={prevBtnRef}
          onClick={onPrev}
          className="cursor-pointer w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg hover:scale-110 active:scale-95 group"
          disabled={isAnimating}
          aria-label={texts.prevProject}
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">&lt;</span>
        </button>

        <span className="text-white text-sm">
          {texts.switchProject}
        </span>

        <button
          ref={nextBtnRef}
          onClick={onNext}
          className="cursor-pointer w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg hover:scale-110 active:scale-95 group"
          disabled={isAnimating}
          aria-label={texts.nextProject}
        >
          <span className="group-hover:translate-x-0.5 transition-transform">&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectControls;
