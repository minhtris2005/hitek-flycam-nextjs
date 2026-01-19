// app/components/projects/ProjectDetail/ProjectTitleAndExcerpt/index.tsx
import React from "react";

interface ProjectTitleAndExcerptProps {
  title: string;
  excerpt?: string;
  displayLanguage: 'vi' | 'en';
  className?: string;
}

export const ProjectTitleAndExcerpt = ({ 
  title, 
  excerpt, 
  displayLanguage,
  className = "" 
}: ProjectTitleAndExcerptProps) => {
  return (
    <div className={className}>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
        {title}
      </h1>

      {excerpt && (
        <div className="text-xl text-gray-600 mb-8 italic border-l-4 border-[#d62323] pl-4 py-3 bg-gradient-to-r from-[#d62323]/5 to-transparent rounded-r-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#d62323] animate-pulse" />
            <span className="text-sm font-semibold text-[#d62323] uppercase tracking-wider">
              {displayLanguage === 'vi' ? 'Tóm tắt dự án' : 'Project Summary'}
            </span>
          </div>
          <p className="leading-relaxed">
            {excerpt}
          </p>
        </div>
      )}
    </div>
  );
};
