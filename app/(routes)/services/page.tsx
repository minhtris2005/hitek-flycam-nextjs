// app/services/page.tsx
import type { Metadata } from 'next';
import HeroSection from '@/app/components/services/HeroSection';
import DescriptionSection from '@/app/components/services/DescriptionSection';
import InteractiveCardsSection from '@/app/components/home/InteractiveCardsSection';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dịch Vụ Flycam Chuyên Nghiệp | Hitek Flycam',
    description: 'Cung cấp dịch vụ flycam, drone chuyên nghiệp: quay phim, chụp ảnh, khảo sát, bất động sản, sự kiện và công nghiệp. Giải pháp drone toàn diện.',
    keywords: [
      'dịch vụ flycam',
      'dịch vụ drone',
      'quay phim flycam',
      'chụp ảnh drone',
      'khảo sát bằng drone',
      'flycam bất động sản',
      'drone công nghiệp',
      'Hitek Flycam',
      'dịch vụ UAV',
    ],
    openGraph: {
      title: 'Dịch Vụ Flycam Chuyên Nghiệp | Hitek Flycam',
      description: 'Dịch vụ flycam và drone chuyên nghiệp cho mọi lĩnh vực',
      type: 'website',
      locale: 'vi_VN',
      siteName: 'Hitek Flycam',
      images: [
        {
          url: '/assets/services/banner.jpg',
          width: 1200,
          height: 630,
          alt: 'Dịch vụ Flycam Hitek',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Dịch Vụ Flycam Chuyên Nghiệp | Hitek Flycam',
      description: 'Giải pháp drone toàn diện cho doanh nghiệp và cá nhân',
      images: ['/assets/services/banner.jpg'],
    },
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
    alternates: {
      canonical: 'https://hitekflycam.com/services',
      languages: {
        'vi': 'https://hitekflycam.com/vi/services',
        'en': 'https://hitekflycam.com/en/services',
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
  };
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Structured Data for Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Dịch vụ Flycam & Drone chuyên nghiệp",
            "provider": {
              "@type": "Organization",
              "name": "Hitek Flycam",
              "url": "https://hitekflycam.com",
              "logo": "https://hitekflycam.com/assets/logo/logo.png",
              "sameAs": [
                "https://facebook.com/hitekflycam",
                "https://youtube.com/hitekflycam"
              ]
            },
            "description": "Cung cấp dịch vụ flycam và drone chuyên nghiệp cho quay phim, chụp ảnh, khảo sát, bất động sản, sự kiện và công nghiệp",
            "serviceType": [
              "Aerial Photography",
              "Aerial Videography",
              "Drone Surveying",
              "Industrial Inspection",
              "Real Estate Photography",
              "Event Coverage"
            ],
            "areaServed": {
              "@type": "Country",
              "name": "Vietnam"
            },
            "offers": {
              "@type": "Offer",
              "description": "Dịch vụ flycam chất lượng cao với giá cạnh tranh"
            }
          })
        }}
      />

      {/* Breadcrumb Schema */}
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
                "name": "Dịch vụ",
                "item": "https://hitekflycam.com/services"
              }
            ]
          })
        }}
      />

      <HeroSection />
      <DescriptionSection />
      <InteractiveCardsSection showTitle={false} />
    </div>
  );
}