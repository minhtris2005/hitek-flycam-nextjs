'use client';

import React, { useEffect, useRef } from "react";

interface ArticleContentProps {
  children: React.ReactNode;
}

export const ArticleContent = ({ children }: ArticleContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const links = contentRef.current.querySelectorAll("a[href]");
      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("http")) {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
        }
      });
    }
  }, [children]);

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none
        prose-headings:text-foreground prose-headings:font-bold prose-headings:leading-tight
        prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mt-8 prose-h1:mb-4
        prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-8 prose-h2:mb-4
        prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-6 prose-h3:mb-3
        prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4
        prose-strong:text-foreground prose-strong:font-semibold
        prose-em:text-foreground prose-em:italic
        prose-blockquote:text-foreground prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
        prose-ul:text-foreground/90 prose-ul:my-4
        prose-ol:text-foreground/90 prose-ol:my-4
        prose-li:my-1
        prose-a:text-blue-600 prose-a:underline prose-a:font-medium prose-a:transition-colors hover:prose-a:text-blue-800 hover:prose-a:no-underline
        prose-img:rounded-xl prose-img:shadow-md prose-img:my-6
        prose-pre:bg-secondary/50 prose-pre:rounded-xl prose-pre:p-4 prose-pre:overflow-x-auto
        prose-code:text-foreground prose-code:bg-secondary/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-table:w-full prose-table:border-collapse
        prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted
        prose-td:border prose-td:border-border prose-td:p-2"
    >
      {children}
    </div>
  );
};
