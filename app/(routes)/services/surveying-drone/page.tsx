"use client";

import { useEffect } from "react";
import HeroBanner from "@/app/components/services/sub-services/HeroBanner";
import FeaturesSection from "@/app/components/services/sub-services/FeaturesSection";
import ProcessTimeline from "@/app/components/services/sub-services/ProcessTimeline";
import BenefitsSection from "@/app/components/services/sub-services/BenefitsSection";
import FAQSection from "@/app/components/services/sub-services/FAQSection";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

import fix from "@/public/assets/services/surveying_drone/bg.png";
import icon1 from "@/public/assets/services/surveying_drone/icon1.png";
import icon2 from "@/public/assets/services/surveying_drone/icon2.png";
import icon3 from "@/public/assets/services/surveying_drone/icon3.png";
import dronesurveying from "@/public/assets/services/surveying_drone/dronesurveying.png";

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

export default function SurveyingDrone() {
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
  const seoData = t("services.surveyingDrone.seo") as {
    title?: string;
    description?: string;
    keywords?: string;
  } || {};
  
  const heroDataFromJson = t("services.surveyingDrone.hero") as {
    title?: string;
    subtitle?: string;
  } || {};
  
  // Ưu tiên SEO data, nếu không có thì dùng hero data
  const title = seoData.title || `${heroDataFromJson.title} | Hitek Flycam - Professional Surveying Drone Services`;
  const description = seoData.description || heroDataFromJson.subtitle || "Professional surveying and mapping drone services";
  const keywords = seoData.keywords || "surveying drone, drone mapping, aerial survey, drone inspection, topographic mapping, GIS drone, Hitek Flycam";

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
    updateOgTag('og:image', dronesurveying.src);
    updateOgTag('og:url', window.location.href);
    
    // Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:image', dronesurveying.src);
    
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
    title: getString("services.surveyingDrone.hero.title"),
    subtitle: getString("services.surveyingDrone.hero.subtitle"),
    backgroundImage: fix,
    height: "400px",
    titleSize: "text-6xl",
    subtitleSize: "text-[25px] leading-[32px]",
    overlayOpacity: 0.7,
    alt: "Surveying Drone Services - Professional Aerial Mapping and Inspection",
  };

  const featuresData = {
    title: getString("services.surveyingDrone.features.title"),
    highlightedText: getString("services.surveyingDrone.features.highlightedText"),
    features: getArray<FeatureItem>("services.surveyingDrone.features.items").map((item, index) => ({
      icon: [icon1, icon2, icon3][index],
      title: item.title || "",
      description: item.description || "",
      alt: `${item.title} - Surveying Drone Service`,
    })),
    descriptionSize: "text-[15px]"
  };

  const processItems = getArray<ProcessItem>("services.surveyingDrone.process.items");
  const processData = {
    title: getString("services.surveyingDrone.process.title"),
    processes: processItems.map((item, index) => ({
      step: item.step || String(index + 1),
      title: item.title || "",
      description: item.description || ""
    })),
    titleSize: "text-[22px]"
  };

  // Xử lý benefits data đặc biệt
  const benefitsItems = getArray<{parts: (string | BenefitPart)[]}>("services.surveyingDrone.benefits.items");
  const benefitsData = {
    imageUrl: dronesurveying,
    title: getString("services.surveyingDrone.benefits.title"),
    highlightedText: getString("services.surveyingDrone.benefits.highlightedText"),
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
    alt: "Benefits of Surveying Drone Services",
  };

  const faqData = {
    title: getString("services.surveyingDrone.faq.title"),
    faqs: getArray<FAQItem>("services.surveyingDrone.faq.items")
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
            "serviceType": "Surveying and Mapping Drone Services",
            "areaServed": {
              "@type": "Country",
              "name": "Worldwide"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Surveying Drone Services",
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