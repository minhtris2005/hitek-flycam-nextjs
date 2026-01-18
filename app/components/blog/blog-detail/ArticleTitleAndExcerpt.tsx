import React from "react";

interface ArticleTitleAndExcerptProps {
  title: string;
  excerpt?: string;
  className?: string; // Thêm prop className tùy chọn
}

export const ArticleTitleAndExcerpt = ({ 
  title, 
  excerpt, 
  className = "" 
}: ArticleTitleAndExcerptProps) => {
  return (
    <div className={className}>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
        {title}
      </h1>

      {excerpt && (
        <div className="text-xl text-muted-foreground mb-8 italic border-l-4 border-primary pl-4 py-2 bg-primary/10">
          {excerpt}
        </div>
      )}
    </div>
  );
};