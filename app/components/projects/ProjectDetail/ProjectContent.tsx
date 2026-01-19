'use client';

import React, { useEffect, useRef } from "react";

interface ProjectContentProps {
  children: React.ReactNode;
}

export const ProjectContent = ({ children }: ProjectContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Set target="_blank" for external links
      const links = contentRef.current.querySelectorAll("a[href]");
      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("http")) {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
        }
      });

      // Add custom styling for project-specific elements
      const projectElements = contentRef.current.querySelectorAll(".project-note, .project-highlight, .project-spec");
      projectElements.forEach((element) => {
        if (element.classList.contains("project-note")) {
          element.classList.add("bg-yellow-50", "border-l-4", "border-yellow-400", "pl-4", "py-2", "my-4", "rounded-r");
        }
        if (element.classList.contains("project-highlight")) {
          element.classList.add("bg-[#d62323]/10", "border", "border-[#d62323]/20", "px-4", "py-3", "my-4", "rounded-lg");
        }
        if (element.classList.contains("project-spec")) {
          element.classList.add("bg-gray-50", "border", "border-gray-200", "p-4", "my-4", "rounded-lg");
        }
      });
    }
  }, [children]);

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none
        /* Headings */
        prose-headings:text-gray-900 prose-headings:font-bold prose-headings:leading-tight
        prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mt-8 prose-h1:mb-4 prose-h1:text-[#d62323]
        prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-gray-800
        prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-700
        prose-h4:text-lg prose-h4:md:text-xl prose-h4:mt-4 prose-h4:mb-2 prose-h4:text-gray-700
        
        /* Paragraphs */
        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
        
        /* Strong & Emphasis */
        prose-strong:text-gray-900 prose-strong:font-semibold
        prose-em:text-gray-700 prose-em:italic
        
        /* Blockquotes */
        prose-blockquote:text-gray-600 prose-blockquote:border-l-4 prose-blockquote:border-[#d62323] 
        prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-gray-50 prose-blockquote:p-4 
        prose-blockquote:rounded-r-lg prose-blockquote:my-6
        
        /* Lists */
        prose-ul:text-gray-600 prose-ul:my-4
        prose-ol:text-gray-600 prose-ol:my-4
        prose-li:my-2
        prose-li:marker:text-[#d62323]
        
        /* Links */
        prose-a:text-[#d62323] prose-a:font-medium prose-a:transition-colors 
        hover:prose-a:text-red-700 hover:prose-a:underline
        
        /* Images */
        prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:border prose-img:border-gray-200
        prose-img:hover:shadow-xl prose-img:hover:scale-[1.01] prose-img:transition-all prose-img:duration-300
        
        /* Code & Pre */
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-4 
        prose-pre:overflow-x-auto prose-pre:shadow-lg prose-pre:my-6
        prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 
        prose-code:rounded prose-code:font-mono prose-code:text-sm
        
        /* Tables */
        prose-table:w-full prose-table:border-collapse prose-table:my-6
        prose-th:border prose-th:border-gray-300 prose-th:p-3 prose-th:bg-gray-50 
        prose-th:text-gray-700 prose-th:font-semibold prose-th:text-left
        prose-td:border prose-td:border-gray-200 prose-td:p-3 prose-td:text-gray-600
        prose-tr:hover:bg-gray-50
        
        /* Horizontal Rules */
        prose-hr:border-gray-300 prose-hr:my-8
        
        /* Project-specific enhancements */
        .project-features {
          @apply bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 my-6 shadow-sm;
        }
        
        .project-challenge {
          @apply bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-500 pl-4 py-3 my-4 rounded-r;
        }
        
        .project-solution {
          @apply bg-gradient-to-r from-green-50 to-white border-l-4 border-green-500 pl-4 py-3 my-4 rounded-r;
        }
        
        .project-result {
          @apply bg-gradient-to-r from-[#d62323]/10 to-white border-l-4 border-[#d62323] pl-4 py-3 my-4 rounded-r font-semibold;
        }
        
        /* Drone-specific elements */
        .drone-specs {
          @apply grid grid-cols-1 md:grid-cols-2 gap-4 my-6;
        }
        
        .drone-spec-item {
          @apply flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg border border-gray-200;
        }
        
        .spec-label {
          @apply text-gray-600 text-sm font-medium;
        }
        
        .spec-value {
          @apply text-gray-800 font-semibold;
        }
        
        /* Project timeline */
        .project-timeline {
          @apply relative pl-8 my-6;
        }
        
        .timeline-item {
          @apply relative mb-6;
        }
        
        .timeline-dot {
          @apply absolute left-[-29px] top-0 w-4 h-4 rounded-full bg-[#d62323] border-4 border-white;
        }
        
        .timeline-content {
          @apply bg-white p-4 rounded-lg border border-gray-200 shadow-sm;
        }
        
        /* Responsive improvements */
        @media (max-width: 768px) {
          .prose {
            font-size: 1rem !important;
          }
          
          .prose-h1 {
            font-size: 1.75rem !important;
          }
          
          .prose-h2 {
            font-size: 1.5rem !important;
          }
          
          .prose-h3 {
            font-size: 1.25rem !important;
          }
          
          .prose-img {
            margin: 1.5rem 0 !important;
          }
        }
        
        /* Dark mode support */
        .dark .prose {
          @apply text-gray-300;
        }
        
        .dark .prose-headings {
          @apply text-gray-100;
        }
        
        .dark .prose-p {
          @apply text-gray-400;
        }
        
        .dark .prose-code {
          @apply bg-gray-800 text-gray-200;
        }
        
        .dark .prose-pre {
          @apply bg-gray-900;
        }
        
        .dark .prose-a {
          @apply text-blue-400;
        }
        
        .dark .prose-blockquote {
          @apply bg-gray-800 border-blue-500;
        }
        
        .dark .project-features {
          @apply bg-gray-800 border-gray-700;
        }
        
        .dark .drone-spec-item {
          @apply bg-gray-800 border-gray-700;
        }
        
        .dark .spec-label {
          @apply text-gray-400;
        }
        
        .dark .spec-value {
          @apply text-gray-200;
        }
      "
    >
      {children}
    </div>
  );
};
