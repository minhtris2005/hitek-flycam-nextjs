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

// Fetch news data từ Supabase
async function getLatestNews() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return null;
    }

    // Lấy 3 bài viết mới nhất
    const response = await fetch(
      `${supabaseUrl}/rest/v1/news?status=eq.published&order=created_at.desc&limit=3`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        next: { revalidate: 300 } // ISR: Revalidate every 5 minutes
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data || [];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching latest news:", error);
    return [];
  }
}

// Fetch projects data từ Supabase
async function getFeaturedProjects() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return null;
    }

    // Lấy 6 projects mới nhất
    const response = await fetch(
      `${supabaseUrl}/rest/v1/projects?status=eq.published&order=created_at.desc&limit=6`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        next: { revalidate: 300 } // ISR: Revalidate every 5 minutes
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data || [];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

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
  category: "technology",
};

export const viewport = {
  themeColor: "#d62323",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function HomePage() {
  // Fetch dữ liệu song song để tối ưu performance
  const [latestNews, featuredProjects] = await Promise.all([
    getLatestNews(),
    getFeaturedProjects()
  ]);

  // Cấu trúc schema data với dữ liệu thực
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
    },
    // Thêm recent news và projects vào structured data
    "hasPart": [
      {
        "@type": "CollectionPage",
        "name": "Tin tức mới nhất",
        "description": "Tin tức và cập nhật mới nhất về công nghệ drone",
        "numberOfItems": latestNews?.length || 0,
        "mainEntity": latestNews?.slice(0, 3).map((news: any, index: number) => ({
          "@type": "NewsArticle",
          "headline": news.title_vi || "Tin tức về drone",
          "description": news.excerpt_vi || "",
          "url": `https://hitekflycam.com/news/${news.slug_vi}`,
          "datePublished": news.created_at,
          "image": news.image
        })) || []
      },
      {
        "@type": "CollectionPage",
        "name": "Dự án nổi bật",
        "description": "Các dự án flycam tiêu biểu đã thực hiện",
        "numberOfItems": featuredProjects?.length || 0,
        "mainEntity": featuredProjects?.slice(0, 6).map((project: any, index: number) => ({
          "@type": "CreativeWork",
          "name": project.title_vi || "Dự án drone",
          "description": project.excerpt_vi || "",
          "url": `https://hitekflycam.com/projects/${project.slug_vi}`,
          "dateCreated": project.created_at,
          "image": project.image
        })) || []
      }
    ]
  };

  // Tạo structured data cho carousel news
  const newsStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": latestNews?.slice(0, 6).map((news: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "NewsArticle",
        "headline": news.title_vi,
        "description": news.excerpt_vi,
        "url": `https://hitekflycam.com/news/${news.slug_vi}`,
        "datePublished": news.created_at,
        "author": {
          "@type": "Person",
          "name": news.author || "Hitek Flycam"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Hitek Flycam"
        }
      }
    })) || []
  };

  // Tạo structured data cho featured projects
  const projectsStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": featuredProjects?.slice(0, 3).map((project: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": project.title_vi,
        "description": project.excerpt_vi,
        "url": `https://hitekflycam.com/projects/${project.slug_vi}`,
        "dateCreated": project.created_at,
        "creator": {
          "@type": "Organization",
          "name": "Hitek Flycam"
        }
      }
    })) || []
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

      {/* Featured Projects Section - GREYWHITE với dữ liệu từ Supabase */}
      <section aria-label="Dự án tiêu biểu">
        <FeaturedProjectsSection initialProjects={featuredProjects} />
      </section>

      {/* Trusted Clients Section - Đối tác - GREYWHITE */}
      <section aria-label="Khách hàng tin cậy">
        <TrustedClientsSection />
      </section>

      {/* News Section - Tin tức và bài viết - WHITE với dữ liệu từ Supabase */}
      <section aria-label="Tin tức và cập nhật">
        <NewsSection initialNews={latestNews} />
      </section>

      {/* Structured Data cho SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* Structured Data cho news carousel */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(newsStructuredData)
        }}
      />
      
      {/* Structured Data cho featured projects */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectsStructuredData)
        }}
      />
    </main>
  );
}
