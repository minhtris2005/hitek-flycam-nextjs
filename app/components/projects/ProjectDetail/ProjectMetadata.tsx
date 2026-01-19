'use client';

import React from "react";
import { Badge } from "@/app/components/ui/badge";
import { User, Tag, MapPin, Ruler, Building } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Định nghĩa interface cho dự án
interface ArticleProject {
  id: string | number;
  title: string;
  category?: string;
  author?: string;
  date?: string;
  created_at?: string;
  project_type?: string;
  location?: string;
  area?: number;
  client?: string;
  views?: number;
}

interface ProjectMetadataProps {
  project: ArticleProject;
  viewCount?: number;
  displayLanguage: 'vi' | 'en';
}

export const ProjectMetadata = ({ 
  project,
  viewCount,
  displayLanguage
}: ProjectMetadataProps) => {
  // Format diện tích
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

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      {/* Project Type */}
      {project.project_type && (
        <Badge className="flex items-center gap-1 bg-[#d62323] text-white border-none">
          <Tag className="w-3 h-3" />
          {project.project_type}
        </Badge>
      )}

      {/* Category */}
      {project.category && (
        <Badge variant="outline" className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          {project.category}
        </Badge>
      )}

      {/* Location */}
      {project.location && (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="w-3 h-3" />
          <span className="font-medium">{project.location}</span>
        </div>
      )}

      {/* Area */}
      {project.area && (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Ruler className="w-3 h-3" />
          <span className="font-medium">{formatArea(project.area)}</span>
        </div>
      )}

      {/* Client */}
      {project.client && (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Building className="w-3 h-3" />
          <span className="font-medium truncate max-w-[200px]">
            {project.client}
          </span>
        </div>
      )}

      {/* Author */}
      {project.author && (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <User className="w-3 h-3" />
          <span className="font-medium">{project.author}</span>
        </div>
      )}

      {/* Views */}
      {viewCount !== undefined && (
        <div className="flex items-center gap-1 text-sm text-gray-500 ml-auto">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>{viewCount.toLocaleString()} {displayLanguage === 'vi' ? 'lượt xem' : 'views'}</span>
        </div>
      )}
    </div>
  );
};
