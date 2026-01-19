// app/components/projects/ProjectDetail/RelatedProjects/index.tsx
'use client';

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import Image from "next/image";
import { MapPin, Building, Calendar } from "lucide-react";

// Định nghĩa interface cho dự án liên quan
interface RelatedProject {
  id: string | number;
  title: string;
  slug_vi?: string;
  slug_en?: string;
  currentSlug?: string;
  category?: string;
  project_type?: string;
  location?: string;
  client?: string;
  completion_date?: string;
  image?: string;
  excerpt?: string;
  date?: string;
  author?: string;
}

interface RelatedProjectsProps {
  relatedProjects: RelatedProject[];
  currentProjectId?: string | number;
  displayLanguage: 'vi' | 'en';
  maxDisplay?: number;
}

export const RelatedProjects = ({ 
  relatedProjects, 
  currentProjectId,
  displayLanguage,
  maxDisplay = 3
}: RelatedProjectsProps) => {
  // Lọc bỏ dự án hiện tại nếu có
  const filteredProjects = relatedProjects
    .filter(project => project.id !== currentProjectId)
    .slice(0, maxDisplay);

  // Get project slug
  const getProjectSlug = (project: RelatedProject) => {
    return displayLanguage === 'vi'
      ? (project.slug_vi || project.slug_en || project.currentSlug || project.id.toString())
      : (project.slug_en || project.slug_vi || project.currentSlug || project.id.toString());
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (filteredProjects.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {displayLanguage === 'vi' ? 'Dự án liên quan' : 'Related Projects'}
        </h2>
        <Link 
          href="/projects"
          className="text-sm text-[#d62323] hover:text-red-600 flex items-center gap-1 transition-colors no-underline font-medium"
        >
          {displayLanguage === 'vi' ? 'Xem tất cả' : 'View all'}
          <span className="ml-1">→</span>
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const slug = getProjectSlug(project);
          const href = `/projects/${slug}`;

          return (
            <Link href={href} key={project.id} className="no-underline group">
              <article className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 cursor-pointer h-full flex flex-col">
                {/* Image */}
                {project.image ? (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
                    
                    {/* Project type badge on image */}
                    {project.project_type && (
                      <div className="absolute top-3 left-3">
                        <div className="px-3 py-1 bg-[#d62323] text-white text-xs font-bold rounded-full">
                          {project.project_type}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-[#d62323]/10 to-gray-100 flex items-center justify-center relative">
                    {project.project_type && (
                      <div className="absolute top-3 left-3">
                        <div className="px-4 py-2 bg-[#d62323] text-white text-sm font-bold rounded-full">
                          {project.project_type}
                        </div>
                      </div>
                    )}
                    <div className="text-4xl text-[#d62323]/30">📷</div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2 group-hover:text-[#d62323] transition-colors">
                    {project.title}
                  </h3>

                  {/* Project Details */}
                  <div className="space-y-2 mb-4 flex-1">
                    {/* Location */}
                    {project.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>
                    )}
                    
                    {/* Client */}
                    {project.client && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{project.client}</span>
                      </div>
                    )}
                    
                    {/* Date */}
                    {project.completion_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>{formatDate(project.completion_date)}</span>
                      </div>
                    )}
                  </div>

                  {/* Read more link */}
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <span className="text-sm text-[#d62323] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      {displayLanguage === 'vi' ? 'Xem chi tiết' : 'View Details'}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
