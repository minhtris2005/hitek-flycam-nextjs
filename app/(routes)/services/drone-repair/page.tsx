"use client";

import { useEffect } from "react";
import HeroBanner from "@/app/components/services/sub-services/HeroBanner";
import FeaturesSection from "@/app/components/services/sub-services/FeaturesSection";
import ProcessTimeline from "@/app/components/services/sub-services/ProcessTimeline";
import BenefitsSection from "@/app/components/services/sub-services/BenefitsSection";
import FAQSection from "@/app/components/services/sub-services/FAQSection";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

import fix from "@/public/assets/services/repairing_drone/fix.png";
import icon1 from "@/public/assets/services/repairing_drone/icon1.png";
import icon2 from "@/public/assets/services/repairing_drone/icon2.png";
import icon3 from "@/public/assets/services/repairing_drone/icon3.png";
import dronerepair from "@/public/assets/services/repairing_drone/dronerepair.jpg";

// Define types cho JSON data
interface FeatureItem {
  title: string;
  description?: string;
}

interface ProcessItem {
  step?: string;
  title: string;
  description?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// Type cho benefit parts trong JSON của bạn
interface BenefitPart {
  text?: string;
  bold?: boolean;
}

export default function DroneRepair() {
  const { t } = useLanguage();

  // Helper functions
  const getString = (key: string): string => {
    const value = t(key);
    return typeof value === 'string' ? value : "";
  };

  const getArray = <T,>(key: string): T[] => {
    const value = t(key);
    return Array.isArray(value) ? (value as T[]) : [];
  };

  // Lấy SEO data từ JSON
  const seoData = t("services.droneRepair.seo") as {
    title?: string;
    description?: string;
    keywords?: string;
  } || {};
  
  const heroDataFromJson = t("services.droneRepair.hero") as {
    title?: string;
    subtitle?: string;
  } || {};
  
  // Ưu tiên SEO data, nếu không có thì dùng hero data
  const title = seoData.title || `${heroDataFromJson.title} | Hitek Flycam - Professional Drone Repair`;
  const description = seoData.description || heroDataFromJson.subtitle || "Professional drone repair and maintenance services";
  const keywords = seoData.keywords || "drone repair, drone maintenance, fix drone, drone troubleshooting, drone parts replacement, Hitek Flycam";

  // Set SEO metadata
  useEffect(() => {
    // Document title
    document.title = title;
    
    // Meta tags
    const updateMetaTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph tags
    const updateOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    
    updateOgTag('og:title', title);
    updateOgTag('og:description', description);
    updateOgTag('og:type', 'website');
    updateOgTag('og:image', dronerepair.src);
    updateOgTag('og:url', window.location.href);
    
    // Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:image', dronerepair.src);
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href.split('?')[0]);
  }, [t, title, description, keywords]);

  const heroData = {
    title: getString("services.droneRepair.hero.title"),
    subtitle: getString("services.droneRepair.hero.subtitle"),
    backgroundImage: fix,
    height: "400px",
    titleSize: "text-6xl",
    subtitleSize: "text-[28px] leading-[32px]",
    overlayOpacity: 0.5,
    alt: "Drone Repair Services - Professional Drone Maintenance and Fix",
  };

  const featuresData = {
    title: getString("services.droneRepair.features.title"),
    highlightedText: getString("services.droneRepair.features.highlightedText"),
    features: getArray<FeatureItem>("services.droneRepair.features.items").map((item, index) => ({
      icon: [icon1, icon2, icon3][index],
      title: item.title || "",
      description: item.description || "",
      alt: `${item.title} - Drone Repair Service`,
    })),
    descriptionSize: "text-[15px]"
  };

  const processItems = getArray<ProcessItem>("services.droneRepair.process.items");
  const processData = {
    title: getString("services.droneRepair.process.title"),
    processes: processItems.map((item, index) => ({
      step: item.step || String(index + 1),
      title: item.title || "",
      description: item.description || ""
    })),
    titleSize: "text-[22px]"
  };

  // Xử lý benefits data đặc biệt
  const benefitsItems = getArray<{parts: (string | BenefitPart)[]}>("services.droneRepair.benefits.items");
  const benefitsData = {
    imageUrl: dronerepair,
    title: getString("services.droneRepair.benefits.title"),
    highlightedText: getString("services.droneRepair.benefits.highlightedText"),
    benefits: benefitsItems.map(item => {
      // Chuyển parts thành mảng string (filter undefined và empty strings)
      const partsArray = item.parts?.map(part => {
        if (typeof part === 'string') return part;
        if (typeof part === 'object' && 'text' in part) return part.text || '';
        return '';
      }).filter((part): part is string => typeof part === 'string' && part.trim() !== '') || [];
      
      return {
        icon: CheckCircle,
        parts: partsArray
      };
    }),
    imageHeight: "h-[380px] md:h-[450px]",
    alt: "Benefits of Drone Repair Services",
  };

  const faqData = {
    title: getString("services.droneRepair.faq.title"),
    faqs: getArray<FAQItem>("services.droneRepair.faq.items")
  };

  return (
    <>
      {/* Structured Data for better SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": heroData.title,
            "description": heroData.subtitle,
            "provider": {
              "@type": "Organization",
              "name": "Hitek Flycam"
            },
            "serviceType": "Drone Repair and Maintenance",
            "areaServed": {
              "@type": "Country",
              "name": "Worldwide"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Drone Repair Services",
              "itemListElement": featuresData.features.map((feature) => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": feature.title,
                  "description": feature.description
                }
              }))
            }
          })
        }}
      />

      <div className="min-h-screen bg-background">
        <HeroBanner {...heroData} />
        <FeaturesSection {...featuresData} />
        <ProcessTimeline {...processData} />
        <BenefitsSection {...benefitsData} />
        <FAQSection {...faqData} />
      </div>
    </>
  );
}