// app/contact/page.tsx
import ContactForm from '@/app/components/contact/ContactForm';
import ContactHero from '@/app/components/contact/ContactHero';
import type { Metadata } from 'next';

// 🔍 ĐƠN GIẢN NHẤT - SEO CƠ BẢN
export const metadata: Metadata = {
  title: 'Liên hệ - Hitek Flycam | Dịch vụ Drone Chuyên Nghiệp',
  description: 'Liên hệ ngay với Hitek Flycam để được tư vấn dịch vụ drone, flycam chuyên nghiệp. Hỗ trợ 24/7, báo giá nhanh.',
  keywords: 'liên hệ flycam, liên hệ drone, dịch vụ drone, cho thuê flycam',
  openGraph: {
    title: 'Liên hệ - Hitek Flycam',
    description: 'Liên hệ ngay với Hitek Flycam để được tư vấn dịch vụ drone',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  // 📌 Structured Data đơn giản cho SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Trang liên hệ Hitek Flycam",
    "description": "Trang liên hệ chính thức của Hitek Flycam",
    "url": "https://hitechflycam.com/contact",
  };

  return (
    <>
      {/* 🔍 Structured Data cho Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Nội dung chính */}
      <div className="min-h-screen bg-background">
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <ContactHero />
            <ContactForm />
          </div>
        </section>
      </div>
    </>
  );
}