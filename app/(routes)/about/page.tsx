// app/about/page.tsx
import { Metadata } from "next";
import HeroSection from "@/app/components/about/HeroSection";  // Thay đổi đường dẫn
import AboutSection from "@/app/components/about/AboutSection";
import QuoteSection from "@/app/components/about/QuoteSection";
import ConnectionSection from "@/app/components/about/ConnectionSection";
import WhyTrustSection from "@/app/components/about/WhyTrustSection";
import TeamSection from "@/app/components/about/TeamSection";

// SEO: CHỈ CẦN Ở ĐÂY
export const metadata: Metadata = {
  title: "Về Chúng Tôi - Hitek Flycam | Dịch Vụ Flycam Chuyên Nghiệp",
  description: "Khám phá hành trình và sứ mệnh của Hitek Flycam - Đơn vị cung cấp dịch vụ flycam, máy bay không người lái chuyên nghiệp hàng đầu tại Việt Nam.",
  keywords: [
    "Hitek Flycam",
    "dịch vụ flycam",
    "máy bay không người lái",
    "drone services",
    "giới thiệu công ty",
    "về chúng tôi",
    "UAV Vietnam",
    "drone trắc địa",
    "sửa chữa drone",
    "quay flycam"
  ],
  
  // Open Graph
  openGraph: {
    title: "Về Chúng Tôi - Hitek Flycam | Dịch Vụ Drone Chuyên Nghiệp",
    description: "Khám phá đội ngũ, sứ mệnh và dịch vụ drone hàng đầu của Hitek Flycam tại Việt Nam",
    type: "website",
    url: "https://hitekflycam.com/about",
    siteName: "Hitek Flycam",
    images: [
      {
        url: "https://hitekflycam.com/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "Hitek Flycam - Giới thiệu công ty",
      },
    ],
    locale: "vi_VN",
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Về Chúng Tôi - Hitek Flycam",
    description: "Giới thiệu về Hitek Flycam và đội ngũ chuyên gia drone",
    images: ["https://hitekflycam.com/og-about.jpg"],
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Canonical
  alternates: {
    canonical: "https://hitekflycam.com/about",
  },
};

// Structured Data cho trang About
const AboutPageSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "Về Chúng Tôi - Hitek Flycam",
        "description": "Giới thiệu về công ty Hitek Flycam, chuyên cung cấp dịch vụ drone tại Việt Nam",
        "url": "https://hitekflycam.com/about",
        "publisher": {
          "@type": "Organization",
          "name": "Hitek Flycam",
          "description": "Cung cấp giải pháp toàn diện về Drone tại Việt Nam",
          "url": "https://hitekflycam.com",
          "logo": "https://hitekflycam.com/logo.png",
          "foundingDate": "2020",
          "founders": [
            {
              "@type": "Person",
              "name": "Lâm Thứ Tiên"
            },
            {
              "@type": "Person",
              "name": "Trần Anh Khôi"
            },
            {
              "@type": "Person",
              "name": "Oh Sean Beom"
            }
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Thành phố Hồ Chí Minh",
            "addressCountry": "VN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+842899959588",
            "contactType": "customer service",
            "areaServed": "VN",
            "availableLanguage": ["Vietnamese", "English"]
          }
        },
        "mainEntity": {
          "@type": "Organization",
          "name": "Hitek Flycam",
          "description": "Hitek Flycam là thương hiệu chuyên về giải pháp Drone ứng dụng đa ngành, được phát triển từ nền tảng công nghệ, nhân lực và kinh nghiệm của Hitek Group JSC.",
          "foundingDate": "2020",
          "founder": [
            {
              "@type": "Person",
              "name": "Lâm Thứ Tiên"
            },
            {
              "@type": "Person",
              "name": "Trần Anh Khôi"
            }
          ],
          "employee": [
            {
              "@type": "Person",
              "name": "Lâm Thứ Tiên",
              "jobTitle": "Chủ tịch"
            },
            {
              "@type": "Person",
              "name": "Trần Anh Khôi",
              "jobTitle": "Tổng giám đốc"
            },
            {
              "@type": "Person",
              "name": "Oh Sean Beom",
              "jobTitle": "Giám đốc Kinh doanh"
            }
          ],
          "serviceArea": {
            "@type": "Place",
            "name": "Việt Nam"
          }
        }
      })
    }}
  />
);

// Breadcrumb Schema
const BreadcrumbSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Trang chủ",
            "item": "https://hitekflycam.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Về chúng tôi",
            "item": "https://hitekflycam.com/about"
          }
        ]
      })
    }}
  />
);

export default function AboutPage() {
  return (
    <>
      {/* Thêm structured data */}
      <AboutPageSchema />
      <BreadcrumbSchema />
      
      <main>
        <HeroSection />
        <AboutSection />
        <WhyTrustSection />
        <ConnectionSection />
        <QuoteSection />
        <TeamSection />
      </main>
    </>
  );
}