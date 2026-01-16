// app/components/subService/FeaturesSection.tsx
"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";

interface Feature {
  icon: StaticImageData;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  title: string;
  highlightedText?: string;
  features: Feature[];
  backgroundColor?: string;
  cardBackground?: string;
  highlightColor?: string;
  titleSize?: string;
  descriptionSize?: string;
}

export default function FeaturesSection({
  title,
  highlightedText,
  features,
  backgroundColor = "bg-greywhite",
  cardBackground = "bg-card",
  highlightColor = "text-primary",
  titleSize = "text-[22px]",
  descriptionSize = "text-base",
}: FeaturesSectionProps) {
  const featureCount = features.length;
  
  // Xác định grid columns dựa trên số lượng features
  const getGridClasses = (count: number): string => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count === 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"; // 4 hoặc nhiều hơn
  };

  const gridClasses = getGridClasses(Math.min(featureCount, 4));

  return (
    <section className={`py-20 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {title}
            {highlightedText && <span className={highlightColor}> {highlightedText}</span>}
          </h2>
        </div>
        
        <div className={`grid ${gridClasses} gap-8`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${cardBackground} rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border flex flex-col`}
            >
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={80}
                  height={80}
                  className="object-contain"
                  quality={85}
                />
              </div>
              <h3 className={`${titleSize} font-bold mb-4 text-foreground min-h-24 flex items-center justify-center line-clamp-3`}>
                {feature.title}
              </h3>
              <p className={`${descriptionSize}! text-muted-foreground leading-relaxed line-clamp-4 flex-1 flex items-center justify-center`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}