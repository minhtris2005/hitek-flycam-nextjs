'use client';

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Share2, Bookmark, Download, Printer, MapPin, Ruler } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Định nghĩa interface cho dự án
interface ArticleProject {
  id: string | number;
  title: string;
  date?: string;
  created_at?: string;
  location?: string;
  area?: number;
  client?: string;
  // Thêm các thuộc tính khác của dự án nếu cần
}

interface ProjectActionsProps {
  project: ArticleProject;
  displayLanguage: 'vi' | 'en';
}

export const ProjectActions = ({ project, displayLanguage }: ProjectActionsProps) => {
  // Format ngày theo ngôn ngữ
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
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
    } catch {
      return dateString;
    }
  };

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

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle download (mock function)
  const handleDownload = () => {
    // In thực tế, bạn có thể tạo PDF hoặc download file
    alert(displayLanguage === 'vi' 
      ? 'Chức năng download đang được phát triển' 
      : 'Download feature is under development');
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: displayLanguage === 'vi' 
          ? 'Xem dự án này' 
          : 'Check out this project',
        url: window.location.href,
      });
    } else {
      // Fallback cho trình duyệt không hỗ trợ Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert(displayLanguage === 'vi' 
        ? 'Đã sao chép link vào clipboard' 
        : 'Link copied to clipboard');
    }
  };

  return (
    <div className="mb-8 py-6 border-y border-gray-200">
      {/* Top Row: Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Location */}
        {project.location && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">
                {displayLanguage === 'vi' ? 'Địa điểm' : 'Location'}
              </div>
              <div className="font-semibold text-gray-800">{project.location}</div>
            </div>
          </div>
        )}

        {/* Area */}
        {project.area && (
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Ruler className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">
                {displayLanguage === 'vi' ? 'Diện tích' : 'Area'}
              </div>
              <div className="font-semibold text-gray-800">{formatArea(project.area)}</div>
            </div>
          </div>
        )}

        {/* Client */}
        {project.client && (
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <div className="w-5 h-5 text-purple-600 font-bold">C</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">
                {displayLanguage === 'vi' ? 'Khách hàng' : 'Client'}
              </div>
              <div className="font-semibold text-gray-800 truncate">{project.client}</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row: Actions & Date */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
            className="border-[#d62323]/30 text-[#d62323] hover:bg-[#d62323]/10 hover:border-[#d62323]/50"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {displayLanguage === 'vi' ? 'Chia sẻ' : 'Share'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownload}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
          >
            <Download className="w-4 h-4 mr-2" />
            {displayLanguage === 'vi' ? 'Tải xuống' : 'Download'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePrint}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
          >
            <Printer className="w-4 h-4 mr-2" />
            {displayLanguage === 'vi' ? 'In ấn' : 'Print'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Mock save functionality
              alert(displayLanguage === 'vi' 
                ? 'Đã lưu dự án vào danh sách yêu thích' 
                : 'Project saved to favorites');
            }}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            {displayLanguage === 'vi' ? 'Lưu lại' : 'Save'}
          </Button>
        </div>

        {/* Date Info */}
        <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <span className="font-medium">
            {displayLanguage === 'vi' ? 'Ngày đăng: ' : 'Published: '}
          </span>
          {formatDate(project.date || project.created_at)}
        </div>
      </div>

      {/* Print styles */}
      <style jsx>{`
        @media print {
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
