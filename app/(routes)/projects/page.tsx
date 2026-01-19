// app/(routes)/projects/page.tsx
import { Metadata } from "next";
import AllProjectsPage from "@/app/components/project/AllProjectsPage";

export const metadata: Metadata = {
  title: "Dự án Drone - Các dự án Flycam tiêu biểu | Hitek Flycam",
  description: "Khám phá các dự án drone, flycam tiêu biểu đã được Hitek Flycam thực hiện tại Việt Nam.",
  keywords: ["drone", "flycam", "dự án drone", "Việt Nam", "Hitek Flycam", "projects"],
  openGraph: {
    title: "Dự án Drone - Các dự án Flycam tiêu biểu | Hitek Flycam",
    description: "Khám phá các dự án drone, flycam tiêu biểu đã được Hitek Flycam thực hiện tại Việt Nam.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Dự án Drone - Các dự án Flycam tiêu biểu",
            "description": "Tổng hợp các dự án drone, flycam tại Việt Nam",
            "url": "https://flycam.hitek.com.vn/projects"
          })
        }}
      />

      <AllProjectsPage />
    </>
  );
}
