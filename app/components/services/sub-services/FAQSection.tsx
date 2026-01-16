// app/components/subService/FAQSection.tsx
"use client";

import { useState } from "react";
import { Plus, Minus, ChevronRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useLanguage } from "@/app/contexts/LanguageContext";
import Link from "next/link";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  faqs: FAQ[];
}

// Helper function để lấy translation an toàn
const getSafeTranslation = (t: (key: string) => unknown, key: string): string => {
  const value = t(key);
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (value === null || value === undefined) return '';
  return String(value);
};

export default function FAQSection({
  title,
  faqs,
}: FAQSectionProps) {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              {title}
            </h2>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3 mb-12">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-card rounded-xl  shadow-sm overflow-hidden transition-all duration-200 ${
                  openFaq === index ? "ring-1 ring-primary/20" : ""
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-secondary/5 transition-colors"
                  aria-expanded={openFaq === index}
                >
                  <div className="flex items-center w-full">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-4">
                      <span className="text-sm font-medium text-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <div className="grow text-left">
                      <span className="text-base md:text-lg font-semibold text-foreground">
                        {faq.question}
                      </span>
                    </div>
                    {openFaq === index ? (
                      <Minus className="w-5 h-5 text-primary shrink-0 ml-2" />
                    ) : (
                      <Plus className="w-5 h-5 text-primary shrink-0 ml-2" />
                    )}
                  </div>
                </button>
                
                {openFaq === index && (
                  <div className="px-5 pb-5 pt-2 border-t border-border/30">
                    <div className="pl-12">
                      <div className="bg-secondary/5 rounded-lg p-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center pt-4 border-t border-border/50">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
              {getSafeTranslation(t, "faqSection.ctaTitle")}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {getSafeTranslation(t, "faqSection.ctaDescription.part1")}{" "}
              <span className="font-bold">{getSafeTranslation(t, "faqSection.ctaDescription.highlight")}</span>{" "}
              {getSafeTranslation(t, "faqSection.ctaDescription.part2")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  className="bg-primary hover:bg-primary/90 text-white shadow-md text-lg px-8 py-6 rounded-xl"
                >
                  {getSafeTranslation(t, "faqSection.buttons.contact")}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}