// app/components/subService/BenefitsSection.tsx
"use client";

import { LucideIcon, CheckCircle } from "lucide-react";
import Image from "next/image";
import type { StaticImageData } from "next/image";

interface BenefitPart {
  text: string;
  bold?: boolean;
}

// Thêm type cho icon
type IconName = "CheckCircle" | "Check" | "CircleCheck" | "CheckSquare" | "CheckCircle2";

interface Benefit {
  iconName?: IconName; // Nhận icon name thay vì component
  parts: (string | BenefitPart)[];
}

interface BenefitsSectionProps {
  title: string;
  highlightedText?: string;
  benefits: Benefit[];
  imageUrl: StaticImageData;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  backgroundColor?: string;
  highlightColor?: string;
  iconColor?: string;
  subtitle?: string;
  imageHeight?: string;
  imageClassName?: string;
}

// Map icon names to components
const iconMap: Record<IconName, LucideIcon> = {
  CheckCircle: CheckCircle,
  Check: CheckCircle, // Fallback
  CircleCheck: CheckCircle, // Fallback
  CheckSquare: CheckCircle, // Fallback
  CheckCircle2: CheckCircle, // Fallback
};

export default function BenefitsSection({
  title,
  highlightedText,
  benefits,
  imageUrl,
  imageAlt = "Benefits illustration",
  imagePosition = 'left',
  backgroundColor = "bg-secondary",
  highlightColor = "text-primary",
  iconColor = "bg-primary",
  subtitle,
  imageHeight = "h-[380px] md:h-[450px]",
  imageClassName,
}: BenefitsSectionProps) {
  const isImageLeft = imagePosition === 'left';

  // Convert icon names to components
  const benefitsWithIcons = benefits.map(benefit => {
    const iconName = benefit.iconName || "CheckCircle";
    const IconComponent = iconMap[iconName] || CheckCircle;
    
    return {
      ...benefit,
      icon: IconComponent
    };
  });

  return (
    <section className={`py-16 md:py-20 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
            {highlightedText && <span className={highlightColor}> {highlightedText}</span>}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Main Content - Two Columns */}
        <div className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${isImageLeft ? '' : 'lg:flex-row-reverse'}`}>
          {/* Left Column - Image */}
          <div className="lg:w-1/2">
            <div className={`relative rounded-2xl overflow-hidden shadow-2xl border border-border ${imageClassName || ''}`}>
              <div className={`relative ${imageHeight}`}>
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover rounded-2xl"
                  quality={85}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-24 h-24">
                <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-primary/20 to-transparent rounded-bl-full" />
              </div>
            </div>
          </div>

          {/* Right Column - Benefits List */}
          <div className="lg:w-1/2">
            <div className="space-y-3 md:space-y-4">
              {benefitsWithIcons.map((benefit, index) => {
                const Icon = benefit.icon;
                
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 md:gap-4 group"
                  >
                    {/* Icon Container */}
                    <div className="shrink-0">
                      <div className={`relative w-10 h-10 md:w-12 md:h-12 ${iconColor} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />

                        {/* Step Number */}
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-background rounded-full border-2 border-primary flex items-center justify-center">
                          <span className="text-[10px] font-bold text-primary">{index + 1}</span>
                        </div>
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <div className="bg-card/50 rounded-xl p-3 md:p-4 border border-border shadow-sm">
                        <p className="text-foreground leading-relaxed text-sm md:text-base">
                          {benefit.parts.map((part, i) => {
                            if (typeof part === 'string') {
                              return part;
                            }
                            return (
                              <span key={i} className="font-bold text-primary">
                                {part.text}
                              </span>
                            );
                          })}
                        </p>
                      </div>

                      {/* Connecting Line (except last item) */}
                      {index < benefits.length - 1 && (
                        <div className="ml-5 md:ml-6 mt-1.5 md:mt-2">
                          <div className="w-0.5 h-3 md:h-4 bg-linear-to-b from-primary/30 to-transparent"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}