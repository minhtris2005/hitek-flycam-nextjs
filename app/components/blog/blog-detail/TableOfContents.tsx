'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Menu, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { cn } from "@/lib/utils";

// Định nghĩa interfaces
interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ArticleLink {
  href: string;
  text: string;
  isExternal?: boolean;
}

interface TableOfContentsProps {
  headings: Heading[];
  links?: ArticleLink[];
  activeId?: string;
  onHeadingClick?: (id: string) => void;
  showBackToTop?: boolean;
  className?: string;
}

export const TableOfContents = ({ 
  headings, 
  links = [], 
  activeId = "", 
  onHeadingClick,
  showBackToTop = true,
  className = ""
}: TableOfContentsProps) => {
  const [showLinks, setShowLinks] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeLink, setActiveLink] = useState<string>("");
  const { language } = useLanguage();

  // Xác định ngôn ngữ hiển thị
  const displayLanguage = language === 'vi' ? 'vi' : 'en';

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

  // Filter headings if needed
  const filteredHeadings = headings.filter(heading => heading.level <= 3);

  if (filteredHeadings.length === 0 && links.length === 0) return null;

  // Tính indentation cho heading levels
  const getHeadingPadding = (level: number) => {
    switch(level) {
      case 1: return "pl-4";
      case 2: return "pl-6";
      case 3: return "pl-8";
      default: return "pl-4";
    }
  };

  return (
    <div className={cn("sticky top-24 hidden lg:block w-64 ml-8", className)}>
      <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Menu className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg text-foreground">
            {displayLanguage === 'vi' ? 'Mục lục' : 'Table of Contents'}
          </h3>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          <nav className="space-y-1">
            {/* Headings */}
            {filteredHeadings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => handleHeadingClick(heading.id)}
                className={cn(
                  "block w-full text-left py-2 px-3 rounded-lg transition-all text-sm font-medium cursor-pointer", // Thêm cursor-pointer
                  getHeadingPadding(heading.level),
                  activeId === heading.id
                    ? "bg-primary/20 text-primary font-semibold" // Đổi màu nền khi active
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                aria-current={activeId === heading.id ? "location" : undefined}
              >
                <div className="flex items-center gap-2">
                  {/* Level indicator dots */}
                  <div className="flex gap-1">
                    {Array.from({ length: heading.level }).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-current opacity-50" />
                    ))}
                  </div>
                  <span className="truncate">{heading.text}</span>
                </div>
              </button>
            ))}

            {/* Article Links Section */}
            {links.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowLinks(!showLinks)}
                  className={cn(
                    "block w-full text-left py-2 px-3 rounded-lg transition-all text-sm font-medium pl-4 cursor-pointer", // Thêm cursor-pointer
                    "text-muted-foreground hover:bg-accent hover:text-foreground",
                    "flex items-center justify-between"
                  )}
                  aria-expanded={showLinks}
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>{displayLanguage === 'vi' ? 'Liên kết trong bài' : 'Article Links'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs opacity-70">({links.length})</span>
                    {showLinks ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </div>
                </button>

                {showLinks && (
                  <div className="mt-2 pl-6 space-y-2">
                    {links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.href}
                        target={link.isExternal ? "_blank" : undefined}
                        rel={link.isExternal ? "noopener noreferrer" : undefined}
                        onClick={() => handleLinkClick(link.href)}
                        className={cn(
                          "block text-sm transition-colors truncate py-1 px-2 rounded cursor-pointer", // Thêm cursor-pointer và padding
                          "flex items-center gap-2",
                          activeLink === link.href
                            ? "bg-primary/20 text-primary" // Màu nền khi active
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{link.text || link.href}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </ScrollArea>

        {/* Summary - Xóa border-top */}
        <div className="mt-6 pt-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>
              {filteredHeadings.length} {displayLanguage === 'vi' ? 'mục' : 'items'}
            </span>
            <span>
              {links.length > 0 && `${links.length} ${displayLanguage === 'vi' ? 'liên kết' : 'links'}`}
            </span>
          </div>
        </div>
      </div>

      {/* Back to Top Button với cursor-pointer */}
      {showBackToTop && isVisible && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full bg-card/95 backdrop-blur-sm cursor-pointer"
          onClick={scrollToTop}
          aria-label={displayLanguage === 'vi' ? 'Lên đầu trang' : 'Scroll to top'}
        >
          ↑ {displayLanguage === 'vi' ? 'Đầu trang' : 'Top'}
        </Button>
      )}

      {/* Xóa thanh progress indicator gạch ngang đỏ */}
    </div>
  );
};