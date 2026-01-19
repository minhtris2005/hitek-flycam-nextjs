// app/(routes)/news/page.tsx
import { Metadata } from "next";
import AllNewsPage from "@/app/components/news/AllNewsPage";

export const metadata: Metadata = {
  title: "Tin tức Drone - Cập nhật tin tức Flycam mới nhất | Hitek Flycam",
  description: "Cập nhật tin tức mới nhất về drone, flycam và công nghệ bay tại Việt Nam và thế giới.",
  keywords: ["drone", "flycam", "tin tức drone", "Việt Nam", "Hitek Flycam", "news"],
  openGraph: {
    title: "Tin tức Drone - Cập nhật tin tức Flycam mới nhất | Hitek Flycam",
    description: "Cập nhật tin tức mới nhất về drone, flycam và công nghệ bay tại Việt Nam và thế giới.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function NewsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Tin tức Drone - Cập nhật tin tức Flycam mới nhất",
            "description": "Tổng hợp tin tức về drone, flycam tại Việt Nam",
            "url": "https://flycam.hitek.com.vn/news"
          })
        }}
      />

      <AllNewsPage />
    </>
  );
}
