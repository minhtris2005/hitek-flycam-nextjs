// app/blog/page.tsx
import { Metadata } from "next";
import BlogClient from "@/app/components/blog/BlogClient";

export const metadata: Metadata = {
  title: "Blog Drone - Kiến thức & Tin tức Flycam | Hitek Flycam",
  description: "Cập nhật tin tức mới nhất, đánh giá chuyên sâu và hướng dẫn chi tiết về công nghệ drone, flycam tại Việt Nam.",
  keywords: ["drone", "flycam", "UAV", "công nghệ drone", "Việt Nam", "Hitek Flycam"],
  openGraph: {
    title: "Blog Drone - Kiến thức & Tin tức Flycam | Hitek Flycam",
    description: "Cập nhật tin tức mới nhất, đánh giá chuyên sâu và hướng dẫn chi tiết về công nghệ drone, flycam tại Việt Nam.",
    type: "website",
    locale: "vi_VN",
  },
};

// Server Component có thể fetch data
async function getBlogPosts() {
  // Fetch data từ API hoặc database ở đây
  // const posts = await fetch('...');
  return null; // hoặc return initialPosts
}

export default async function BlogPage() {
  // Fetch data trên server nếu cần
  const initialPosts = await getBlogPosts();

  return (
    <>
      {/* Structured data script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Blog Drone - Kiến thức & Tin tức Flycam",
            "description": "Tổng hợp bài viết về drone, flycam tại Việt Nam",
            "url": "https://flycam.hitek.com.vn/blog"
          })
        }}
      />
      
      <BlogClient initialPosts={initialPosts || undefined} />
    </>
  );
}