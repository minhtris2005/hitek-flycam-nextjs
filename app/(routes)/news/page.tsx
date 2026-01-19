// app/news/page.tsx
import { Metadata } from "next";
import NewsClient from "@/app/components/news/NewsClient";

export const metadata: Metadata = {
  title: "Tin tức Công nghệ Drone & Flycam | Cập nhật mới nhất | Hitek Flycam",
  description: "Cập nhật tin tức mới nhất về công nghệ drone, flycam, UAV tại Việt Nam và thế giới. Tin tức chuyên ngành, thị trường và công nghệ mới.",
  keywords: [
    "tin tức drone", 
    "tin tức flycam", 
    "công nghệ UAV", 
    "tin tức công nghệ", 
    "thị trường drone", 
    "Hitek Flycam", 
    "Việt Nam",
    "tin nóng"
  ],
  openGraph: {
    title: "Tin tức Công nghệ Drone & Flycam | Cập nhật mới nhất | Hitek Flycam",
    description: "Cập nhật tin tức mới nhất về công nghệ drone, flycam, UAV tại Việt Nam và thế giới.",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "https://flycam.hitek.com.vn/og-news.jpg",
        width: 1200,
        height: 630,
        alt: "Tin tức Công nghệ Drone & Flycam",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tin tức Công nghệ Drone & Flycam | Hitek Flycam",
    description: "Cập nhật tin tức mới nhất về công nghệ drone, flycam tại Việt Nam",
    images: ["https://flycam.hitek.com.vn/og-news.jpg"],
  },
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
};

// Server Component có thể fetch data
async function getNewsPosts() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return null;
    }

    // Fetch featured news for carousel
    const response = await fetch(
      `${supabaseUrl}/rest/v1/news?status=eq.published&is_featured=eq.true&order=created_at.desc&limit=6`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        next: { revalidate: 60 } // ISR: Revalidate every 60 seconds
      }
    );

    if (response.ok) {
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Transform data for client
        const enhancedNews = data.map((post: any) => ({
          id: post.id,
          title_vi: post.title_vi,
          title_en: post.title_en,
          excerpt_vi: post.excerpt_vi,
          excerpt_en: post.excerpt_en,
          content_vi: post.content_vi,
          content_en: post.content_en,
          slug_vi: post.slug_vi,
          slug_en: post.slug_en,
          image: post.image,
          category: post.category,
          author: post.author,
          status: post.status,
          is_featured: post.is_featured,
          source: post.source,
          tags: post.tags,
          date: post.date,
          created_at: post.created_at,
          views: post.views,
        }));
        
        return enhancedNews;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

export default async function NewsPage() {
  // Fetch data trên server để SEO tốt hơn
  const initialNews = await getNewsPosts();

  return (
    <>
      {/* Structured data script for News Article Collection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://flycam.hitek.com.vn/news#webpage",
            "name": "Tin tức Công nghệ Drone & Flycam",
            "description": "Tổng hợp tin tức mới nhất về công nghệ drone, flycam, UAV tại Việt Nam và thế giới",
            "url": "https://flycam.hitek.com.vn/news",
            "inLanguage": "vi-VN",
            "isPartOf": {
              "@type": "WebSite",
              "@id": "https://flycam.hitek.com.vn#website",
              "name": "Hitek Flycam",
              "url": "https://flycam.hitek.com.vn"
            },
            "publisher": {
              "@type": "Organization",
              "@id": "https://flycam.hitek.com.vn#organization",
              "name": "Hitek Flycam",
              "url": "https://flycam.hitek.com.vn",
              "logo": {
                "@type": "ImageObject",
                "url": "https://flycam.hitek.com.vn/logo.png",
                "width": 300,
                "height": 60
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Trang chủ",
                  "item": "https://flycam.hitek.com.vn"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Tin tức",
                  "item": "https://flycam.hitek.com.vn/news"
                }
              ]
            },
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": initialNews?.length || 0,
              "itemListElement": initialNews?.slice(0, 10).map((news: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "NewsArticle",
                  "@id": `https://flycam.hitek.com.vn/news/${news.slug_vi}#article`,
                  "headline": news.title_vi,
                  "description": news.excerpt_vi,
                  "image": news.image,
                  "datePublished": news.date || news.created_at,
                  "dateModified": news.updated_at || news.created_at,
                  "author": {
                    "@type": "Person",
                    "name": news.author || "Hitek Flycam"
                  },
                  "publisher": {
                    "@type": "Organization",
                    "@id": "https://flycam.hitek.com.vn#organization"
                  }
                }
              })) || []
            }
          })
        }}
      />

      {/* Additional schema for News site */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            "name": "Hitek Flycam News",
            "url": "https://flycam.hitek.com.vn/news",
            "logo": "https://flycam.hitek.com.vn/logo.png",
            "sameAs": [
              "https://facebook.com/hitekflycam",
              "https://twitter.com/hitekflycam",
              "https://youtube.com/hitekflycam"
            ],
            "description": "Kênh tin tức chuyên sâu về công nghệ drone, flycam tại Việt Nam"
          })
        }}
      />

      {/* Viewport meta for better mobile experience */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://flycam.hitek.com.vn/news" />
      
      {/* Language alternates */}
      <link rel="alternate" href="https://flycam.hitek.com.vn/news" hrefLang="vi" />
      <link rel="alternate" href="https://flycam.hitek.com.vn/en/news" hrefLang="en" />
      <link rel="alternate" href="https://flycam.hitek.com.vn/news" hrefLang="x-default" />

      {/* Open Graph additional tags */}
      <meta property="og:site_name" content="Hitek Flycam News" />
      <meta property="og:url" content="https://flycam.hitek.com.vn/news" />
      <meta property="article:publisher" content="https://facebook.com/hitekflycam" />
      <meta property="article:author" content="https://facebook.com/hitekflycam" />
      <meta property="article:section" content="Công nghệ" />
      <meta property="article:tag" content="drone, flycam, công nghệ" />

      {/* Twitter Card additional tags */}
      <meta name="twitter:site" content="@hitekflycam" />
      <meta name="twitter:creator" content="@hitekflycam" />

      <NewsClient initialNews={initialNews || undefined} />
    </>
  );
}
