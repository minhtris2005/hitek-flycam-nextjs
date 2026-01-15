"use client";

import { useEffect } from "react";
import HeroBanner from "@/app/components/services/sub-services/HeroBanner";
import FeaturesSection from "@/app/components/services/sub-services/FeaturesSection";
import ProcessTimeline from "@/app/components/services/sub-services/ProcessTimeline";
import BenefitsSection from "@/app/components/services/sub-services/BenefitsSection";
import FAQSection from "@/app/components/services/sub-services/FAQSection";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

import fix from "@/public/assets/services/delivery_drone/fix.png";
import icon1 from "@/public/assets/services/delivery_drone/icon1.png";
import icon2 from "@/public/assets/services/delivery_drone/icon2.png";
import icon3 from "@/public/assets/services/delivery_drone/icon3.png";
import droneimport from "@/public/assets/services/delivery_drone/dronedelivery.avif";

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

export default function DroneImport() {
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
  const seoData = t("services.droneImport.seo") as {
    title?: string;
    description?: string;
    keywords?: string;
  } || {};
  
  const heroDataFromJson = t("services.droneImport.hero") as {
    title?: string;
    subtitle?: string;
  } || {};
  
  // Ưu tiên SEO data, nếu không có thì dùng hero data
  const title = seoData.title || `${heroDataFromJson.title} | Hitek Flycam - Professional Drone Import`;
  const description = seoData.description || heroDataFromJson.subtitle || "Professional drone import and sourcing services";
  const keywords = seoData.keywords || "drone import, import drone, drone sourcing, buy drone, drone supplier, drone distribution, Hitek Flycam";

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
    updateOgTag('og:image', droneimport.src);
    updateOgTag('og:url', window.location.href);
    
    // Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:image', droneimport.src);
    
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
    title: getString("services.droneImport.hero.title"),
    subtitle: getString("services.droneImport.hero.subtitle"),
    backgroundImage: fix,
    height: "400px",
    titleSize: "text-6xl",
    subtitleSize: "text-2xl",
    overlayOpacity: 0.7,
    alt: "Drone Import Services - Professional Drone Sourcing and Distribution",
  };

  const featuresData = {
    title: getString("services.droneImport.features.title"),
    highlightedText: getString("services.droneImport.features.highlightedText"),
    features: getArray<FeatureItem>("services.droneImport.features.items").map((item, index) => ({
      icon: [icon1, icon2, icon3][index],
      title: item.title || "",
      description: item.description || "",
      alt: `${item.title} - Drone Import Service`,
    })),
    descriptionSize: "text-[15px]"
  };

  const processItems = getArray<ProcessItem>("services.droneImport.process.items");
  const processData = {
    title: getString("services.droneImport.process.title"),
    processes: processItems.map((item, index) => ({
      step: item.step || String(index + 1),
      title: item.title || "",
      description: item.description || ""
    })),
    titleSize: "text-[18px]"
  };

  // Xử lý benefits data đặc biệt
  const benefitsItems = getArray<{parts: (string | BenefitPart)[]}>("services.droneImport.benefits.items");
  const benefitsData = {
    imageUrl: droneimport,
    title: getString("services.droneImport.benefits.title"),
    highlightedText: getString("services.droneImport.benefits.highlightedText"),
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
    imageHeight: "h-[300px] md:h-[350px]",
    alt: "Benefits of Drone Import Services",
  };

  const faqData = {
    title: getString("services.droneImport.faq.title"),
    faqs: getArray<FAQItem>("services.droneImport.faq.items")
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
            "serviceType": "Drone Import and Distribution",
            "areaServed": {
              "@type": "Country",
              "name": "Worldwide"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Drone Import Services",
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