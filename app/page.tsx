// app/page.tsx
import { Metadata } from "next";
import HeroSection from "@/app/components/home/HeroSection";
import IconServicesSection from "@/app/components/home/IconServicesSection";
import InteractiveCardsSection from "@/app/components/home/InteractiveCardsSection";
import FeaturedProjectsSection from "@/app/components/home/FeaturedProjectsSection";
import NewsSection from "@/app/components/home/NewsSection";
import TrustedClientsSection from "@/app/components/home/TrustedClientsSection";
import DetailedServicesSection from "@/app/components/home/DetailedServicesSection";
import IntroSection from "@/app/components/home/IntroSection";

export const metadata: Metadata = {
  title: "Hitek Flycam - Dịch vụ Flycam Chuyên nghiệp Hàng đầu Việt Nam",
  description: "Cung cấp giải pháp toàn diện về drone: Sửa chữa, khảo sát, quay phim, vận chuyển, đào tạo và dịch vụ giấy phép bay.",
  keywords: "flycam, drone, sửa chữa drone, khảo sát drone, quay phim drone, giấy phép bay, dịch vụ drone",
  authors: [{ name: "Hitek Flycam" }],
  creator: "Hitek Flycam",
  publisher: "Hitek Flycam",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://hitekflycam.com",
    title: "Hitek Flycam - Dịch vụ Flycam Chuyên nghiệp",
    description: "Giải pháp drone toàn diện từ sửa chữa, khảo sát đến quay phim chuyên nghiệp",
    siteName: "Hitek Flycam",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hitek Flycam - Dịch vụ Flycam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hitek Flycam - Dịch vụ Flycam Chuyên nghiệp",
    description: "Giải pháp drone toàn diện cho mọi nhu cầu",
    images: ["/twitter-image.jpg"],
    creator: "@hitekflycam",
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  alternates: {
    canonical: "https://hitekflycam.com",
    languages: {
      "vi-VN": "https://hitekflycam.com/vi",
      "en-US": "https://hitekflycam.com/en",
    },
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#d62323", // Đổi thành #d62323
  category: "technology",
};

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Hitek Flycam",
    "image": "https://hitekflycam.com/logo.png",
    "@id": "https://hitekflycam.com",
    "url": "https://hitekflycam.com",
    "telephone": "+84-28-9995-9588",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Số 123 Đường ABC",
      "addressLocality": "Hà Nội",
      "addressRegion": "VN",
      "postalCode": "100000",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.028511,
      "longitude": 105.804817
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://facebook.com/hitekflycam",
      "https://twitter.com/hitekflycam",
      "https://linkedin.com/company/hitekflycam"
    ],
    "priceRange": "$$",
    "serviceType": ["Drone Repair", "Aerial Photography", "Drone Surveying", "Drone Training"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Dịch vụ Flycam",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sửa chữa Drone"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Khảo sát Drone"
          }
        }
      ]
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section với hình ảnh chính - KHÔNG background */}
      <section itemScope itemType="https://schema.org/Service">
        <meta itemProp="name" content="Dịch vụ Flycam Hitek" />
        <meta itemProp="description" content="Dịch vụ flycam chuyên nghiệp hàng đầu Việt Nam" />
        <HeroSection />
      </section>

      {/* Icon Services Section - GREYWHITE */}
      <section aria-label="Các dịch vụ chính">
        <IconServicesSection />
      </section>

      {/* Intro Section - Giới thiệu công ty - GREYWHITE */}
      <section 
        itemScope 
        itemType="https://schema.org/Organization"
        aria-label="Giới thiệu về chúng tôi"
      >
        <meta itemProp="name" content="Hitek Flycam" />
        <meta itemProp="description" content="Công ty dịch vụ flycam chuyên nghiệp" />
        <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress" className="hidden">
          <meta itemProp="addressLocality" content="Hà Nội" />
          <meta itemProp="addressRegion" content="Việt Nam" />
        </div>
        <IntroSection />
      </section>

      {/* Interactive Cards Section - WHITE */}
      <section aria-label="Chi tiết dịch vụ">
        <InteractiveCardsSection showTitle={true} />
      </section>

      {/* Detailed Services Section - WHITE */}
      <section aria-label="Dịch vụ chi tiết">
        <DetailedServicesSection />
      </section>

      {/* Featured Projects Section - GREYWHITE */}
      <section aria-label="Dự án tiêu biểu">
        <FeaturedProjectsSection />
      </section>

      {/* Trusted Clients Section - Đối tác - GREYWHITE */}
      <section aria-label="Khách hàng tin cậy">
        <TrustedClientsSection />
      </section>

      {/* News Section - Tin tức và bài viết - WHITE */}
      <section aria-label="Tin tức và cập nhật">
        <NewsSection />
      </section>

      {/* Structured Data cho SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </main>
  );
}