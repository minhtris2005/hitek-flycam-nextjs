// app/components/projects/ProjectDetail/TableOfContents/index.tsx
'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Menu, ExternalLink, ChevronDown, ChevronRight, MapPin, Ruler, Building, Calendar } from "lucide-react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { cn } from "@/lib/utils";

// Định nghĩa interfaces
interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ProjectLink {
  href: string;
  text: string;
  isExternal?: boolean;
  icon?: string;
}

interface ProjectSpec {
  label: string;
  value: string;
  icon?: string;
}

interface TableOfContentsProps {
  headings: Heading[];
  links?: ProjectLink[];
  specs?: ProjectSpec[];
  activeId?: string;
  onHeadingClick?: (id: string) => void;
  showBackToTop?: boolean;
  className?: string;
  displayLanguage: 'vi' | 'en';
}

export const TableOfContents = ({ 
  headings, 
  links = [], 
  specs = [],
  activeId = "", 
  onHeadingClick,
  showBackToTop = true,
  className = "",
  displayLanguage
}: TableOfContentsProps) => {
  const [showLinks, setShowLinks] = useState(false);
  const [showSpecs, setShowSpecs] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeLink, setActiveLink] = useState<string>("");
  const [activeSpec, setActiveSpec] = useState<string>("");

  // Auto-hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle heading click
  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      if (onHeadingClick) {
        onHeadingClick(id);
      }
    }
  };

  // Handle link click
  const handleLinkClick = (href: string) => {
    setActiveLink(href);
  };

  // Handle spec click
  const handleSpecClick = (label: string) => {
    setActiveSpec(label);
    // Scroll to spec section if exists
    const specElement = document.querySelector(`[data-spec="${label}"]`);
    if (specElement) {
      specElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter headings if needed
  const filteredHeadings = headings.filter(heading => heading.level <= 3);

  if (filteredHeadings.length === 0 && links.length === 0 && specs.length === 0) return null;

  // Tính indentation cho heading levels
  const getHeadingPadding = (level: number) => {
    switch(level) {
      case 1: return "pl-4";
      case 2: return "pl-6";
      case 3: return "pl-8";
      default: return "pl-4";
    }
  };

  // Get icon component
  const getIcon = (iconName?: string) => {
    switch(iconName) {
      case 'map-pin': return <MapPin className="w-3 h-3" />;
      case 'ruler': return <Ruler className="w-3 h-3" />;
      case 'building': return <Building className="w-3 h-3" />;
      case 'calendar': return <Calendar className="w-3 h-3" />;
      case 'external-link': return <ExternalLink className="w-3 h-3" />;
      default: return <div className="w-3 h-3 rounded-full bg-current opacity-50" />;
    }
  };

  return (
    <div className={cn("sticky top-24 hidden lg:block w-72 ml-8", className)}>
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Menu className="w-5 h-5 text-[#d62323]" />
          <h3 className="font-bold text-lg text-gray-900">
            {displayLanguage === 'vi' ? 'Mục lục dự án' : 'Project Contents'}
          </h3>
        </div>

        <ScrollArea className="h-[calc(100vh-350px)] pr-4">
          <nav className="space-y-2">
            {/* Project Specifications */}
            {specs.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setShowSpecs(!showSpecs)}
                  className={cn(
                    "block w-full text-left py-3 px-4 rounded-lg transition-all text-sm font-medium cursor-pointer",
                    "flex items-center justify-between",
                    "bg-gradient-to-r from-[#d62323]/10 to-transparent border border-[#d62323]/20",
                    "hover:from-[#d62323]/20 hover:to-transparent hover:border-[#d62323]/30"
                  )}
                  aria-expanded={showSpecs}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#d62323] flex items-center justify-center">
                      <Ruler className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {displayLanguage === 'vi' ? 'Thông số dự án' : 'Project Specs'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {specs.length} {displayLanguage === 'vi' ? 'thông số' : 'specs'}
                      </div>
                    </div>
                  </div>
                  {showSpecs ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {showSpecs && (
                  <div className="mt-3 space-y-2 pl-4">
                    {specs.map((spec, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSpecClick(spec.label)}
                        className={cn(
                          "block w-full text-left py-2 px-3 rounded-lg transition-all text-sm cursor-pointer",
                          "flex items-center justify-between",
                          activeSpec === spec.label
                            ? "bg-[#d62323]/20 text-[#d62323] border border-[#d62323]/30"
                            : "bg-gray-50/50 hover:bg-gray-100 text-gray-700 border border-transparent hover:border-gray-200"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {getIcon(spec.icon)}
                          <span className="truncate">{spec.label}</span>
                        </div>
                        <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {spec.value}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Headings */}
            {filteredHeadings.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-700 mb-3 px-2">
                  {displayLanguage === 'vi' ? 'Nội dung chính' : 'Main Content'}
                </div>
                <div className="space-y-1">
                  {filteredHeadings.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => handleHeadingClick(heading.id)}
                      className={cn(
                        "block w-full text-left py-2 px-3 rounded-lg transition-all text-sm font-medium cursor-pointer",
                        getHeadingPadding(heading.level),
                        activeId === heading.id
                          ? "bg-[#d62323]/20 text-[#d62323] font-semibold border-l-4 border-[#d62323]"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                      aria-current={activeId === heading.id ? "location" : undefined}
                    >
                      <div className="flex items-center gap-2">
                        {/* Level indicator */}
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          activeId === heading.id 
                            ? "bg-[#d62323]" 
                            : "bg-gray-300"
                        )} />
                        <span className="truncate">{heading.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Project Links Section */}
            {links.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowLinks(!showLinks)}
                  className={cn(
                    "block w-full text-left py-3 px-4 rounded-lg transition-all text-sm font-medium cursor-pointer",
                    "flex items-center justify-between",
                    "bg-gradient-to-r from-gray-50 to-transparent border border-gray-200",
                    "hover:from-gray-100 hover:to-transparent hover:border-gray-300"
                  )}
                  aria-expanded={showLinks}
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-900">
                      {displayLanguage === 'vi' ? 'Tài liệu liên quan' : 'Related Documents'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">({links.length})</span>
                    {showLinks ? (
                      <ChevronDown className="w-3 h-3 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-gray-500" />
                    )}
                  </div>
                </button>

                {showLinks && (
                  <div className="mt-3 pl-4 space-y-2">
                    {links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.href}
                        target={link.isExternal ? "_blank" : undefined}
                        rel={link.isExternal ? "noopener noreferrer" : undefined}
                        onClick={() => handleLinkClick(link.href)}
                        className={cn(
                          "block text-sm transition-colors truncate py-2 px-3 rounded-lg cursor-pointer",
                          "flex items-center gap-3",
                          activeLink === link.href
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200 border border-transparent"
                        )}
                      >
                        {getIcon(link.icon)}
                        <span className="truncate flex-1">{link.text || link.href}</span>
                        {link.isExternal && (
                          <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </ScrollArea>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center gap-4">
              {filteredHeadings.length > 0 && (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#d62323]" />
                  {filteredHeadings.length} {displayLanguage === 'vi' ? 'mục' : 'items'}
                </span>
              )}
              {specs.length > 0 && (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  {specs.length} {displayLanguage === 'vi' ? 'thông số' : 'specs'}
                </span>
              )}
            </div>
            {links.length > 0 && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                {links.length} {displayLanguage === 'vi' ? 'tài liệu' : 'docs'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && isVisible && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full bg-white/95 backdrop-blur-sm border-gray-300 hover:border-[#d62323] hover:bg-[#d62323]/10 cursor-pointer"
          onClick={scrollToTop}
          aria-label={displayLanguage === 'vi' ? 'Lên đầu trang' : 'Scroll to top'}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#d62323] animate-pulse" />
            ↑ {displayLanguage === 'vi' ? 'Đầu trang' : 'Top'}
          </div>
        </Button>
      )}

      {/* Quick Navigation Stats */}
      <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">
          {displayLanguage === 'vi' ? 'Điều hướng nhanh' : 'Quick Navigation'}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              const images = document.querySelectorAll('img');
              if (images.length > 0) images[0].scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs text-gray-600 hover:text-[#d62323] hover:bg-gray-100 py-1 px-2 rounded transition-colors text-left cursor-pointer"
          >
            📷 {displayLanguage === 'vi' ? 'Hình ảnh' : 'Images'}
          </button>
          <button
            onClick={() => {
              const tables = document.querySelectorAll('table');
              if (tables.length > 0) tables[0].scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs text-gray-600 hover:text-[#d62323] hover:bg-gray-100 py-1 px-2 rounded transition-colors text-left cursor-pointer"
          >
            📊 {displayLanguage === 'vi' ? 'Bảng số liệu' : 'Data Tables'}
          </button>
          <button
            onClick={() => {
              const specs = document.querySelectorAll('[data-spec]');
              if (specs.length > 0) specs[0].scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs text-gray-600 hover:text-[#d62323] hover:bg-gray-100 py-1 px-2 rounded transition-colors text-left cursor-pointer"
          >
            ⚙️ {displayLanguage === 'vi' ? 'Thông số' : 'Specifications'}
          </button>
          <button
            onClick={() => {
              const results = document.querySelectorAll('.project-result');
              if (results.length > 0) results[0].scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs text-gray-600 hover:text-[#d62323] hover:bg-gray-100 py-1 px-2 rounded transition-colors text-left cursor-pointer"
          >
            🎯 {displayLanguage === 'vi' ? 'Kết quả' : 'Results'}
          </button>
        </div>
      </div>
    </div>
  );
};
