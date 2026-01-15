// app/services/delivery-drone/page.tsx
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
import dronedelivery from "@/public/assets/services/delivery_drone/dronedelivery.avif";

// Define types cho JSON data
interface FeatureItem {
  title: string;
  description?: string; // description là optional
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

export default function DeliveryDrone() {
  const { t } = useLanguage();

  useEffect(() => {
    // Lấy SEO data từ JSON (nếu có), nếu không thì dùng hero data
    const seoData = t("services.deliveryDrone.seo") as {
      title?: string;
      description?: string;
      keywords?: string;
    } || {};
    
    const heroData = t("services.deliveryDrone.hero") as {
      title?: string;
      subtitle?: string;
    } || {};
    
    // Ưu tiên SEO data, nếu không có thì dùng hero data
    const title = seoData.title || `${heroData.title} | Hitek Flycam - Professional Drone Delivery`;
    const description = seoData.description || heroData.subtitle || "Professional drone delivery solutions";
    const keywords = seoData.keywords || "drone delivery, aerial delivery, drone logistics, drone transportation";
    
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
    updateOgTag('og:image', dronedelivery.src);
    updateOgTag('og:url', window.location.href);
    
    // Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:image', dronedelivery.src);
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href.split('?')[0]);
  }, [t]);

  // Helper functions
  const getString = (key: string): string => {
    const value = t(key);
    return typeof value === 'string' ? value : "";
  };

  const getArray = <T,>(key: string): T[] => {
    const value = t(key);
    return Array.isArray(value) ? (value as T[]) : [];
  };

  const heroData = {
    title: getString("services.deliveryDrone.hero.title"),
    subtitle: getString("services.deliveryDrone.hero.subtitle"),
    backgroundImage: fix,
    height: "400px",
    titleSize: "text-6xl",
    subtitleSize: "text-[28px] leading-[32px]",
    overlayOpacity: 0.7,
    alt: "Drone Delivery Services - Fast Aerial Transportation",
  };

  const featuresData = {
    title: getString("services.deliveryDrone.features.title"),
    highlightedText: getString("services.deliveryDrone.features.highlightedText"),
    features: getArray<FeatureItem>("services.deliveryDrone.features.items").map((item, index) => ({
      icon: [icon1, icon2, icon3][index],
      title: item.title || "",
      description: item.description || "",
      alt: `${item.title} - Drone Delivery Service`,
    })),
    descriptionSize: "text-[15px]"
  };

  const processItems = getArray<ProcessItem>("services.deliveryDrone.process.items");
  const processData = {
    title: getString("services.deliveryDrone.process.title"),
    processes: processItems.map((item, index) => ({
      step: item.step || String(index + 1),
      title: item.title || "",
      description: item.description || ""
    })),
    titleSize: "text-[24px]"
  };

  // Xử lý benefits data đặc biệt
  const benefitsItems = getArray<{parts: (string | BenefitPart)[]}>("services.deliveryDrone.benefits.items");
const benefitsData = {
  imageUrl: dronedelivery,
  title: getString("services.deliveryDrone.benefits.title"),
  highlightedText: getString("services.deliveryDrone.benefits.highlightedText"),
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
  alt: "Benefits of Drone Delivery Services",
};

  const faqData = {
    title: getString("services.deliveryDrone.faq.title"),
    faqs: getArray<FAQItem>("services.deliveryDrone.faq.items")
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
            "serviceType": "Drone Delivery and Logistics",
            "areaServed": {
              "@type": "Country",
              "name": "Worldwide"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Drone Delivery Services",
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