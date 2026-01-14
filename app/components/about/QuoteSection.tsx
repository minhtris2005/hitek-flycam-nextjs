// app/components/about/QuoteSection.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Quote } from "lucide-react";

// Type definitions
type QuoteData = {
  content?: string[];
};

const QuoteSection = () => {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Helper function to safely get string
  const getString = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Helper function to parse quote data
  const parseQuoteData = (): QuoteData => {
    const data = t("about.quote");
    
    if (typeof data !== 'object' || data === null) {
      return {};
    }
    
    const obj = data as Record<string, unknown>;
    
    const parseContent = (): string[] => {
      const content = obj.content;
      if (!Array.isArray(content)) return [];
      return content.map(item => getString(item));
    };
    
    return {
      content: parseContent(),
    };
  };

  const quoteData = parseQuoteData();
  const content = quoteData.content || [];

  return (
    <section 
      ref={ref}
      className="py-20 relative overflow-hidden bg-background"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.blockquote
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2 }}
            className="relative"
            cite="https://hitekflycam.com"
          >
            <div className="absolute -left-2 -top-2 md:-left-4 md:-top-4 scale-x-[-1]">
              <Quote className="w-10 h-10 md:w-14 md:h-14 text-red-600 fill-red-600" />
            </div>

            <div className="absolute -right-2 -bottom-2 md:-right-4 md:-bottom-4">
              <Quote className="w-10 h-10 md:w-14 md:h-14 text-red-600 fill-red-600" />
            </div>

            <div className="relative z-10 px-8 py-4">
              <p className="text-base md:text-lg lg:text-xl font-bold text-black text-center leading-relaxed">
                {content[0]}{" "}
                <span className="text-black">
                  {content[1]}
                </span>{" "}
                {content[2]}{" "}
                <span className="text-black">
                  {content[3]}
                </span>{" "}
                {content[4]}
              </p>
            </div>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;