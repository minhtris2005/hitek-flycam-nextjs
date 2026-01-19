// app/(routes)/projects/page.tsx
import { Metadata } from "next";
import ProjectsClient from "@/app/components/projects/ProjectsClient";

export const metadata: Metadata = {
  title: "Dự Án Flycam - Portfolio & Công Trình Thực Tế | Hitek Flycam",
  description: "Xem các dự án flycam thực tế, công trình quay chụp chuyên nghiệp và portfolio dịch vụ flycam tại Việt Nam.",
  keywords: ["dự án flycam", "portfolio", "công trình thực tế", "quay chụp flycam", "dịch vụ flycam", "Hitek Flycam"],
  openGraph: {
    title: "Dự Án Flycam - Portfolio & Công Trình Thực Tế | Hitek Flycam",
    description: "Xem các dự án flycam thực tế, công trình quay chụp chuyên nghiệp và portfolio dịch vụ flycam tại Việt Nam.",
    type: "website",
    locale: "vi_VN",
  },
};

async function getProjects() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase env variables');
      return null;
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/projects?status=eq.published&order=created_at.desc&limit=12`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact',
        },
        next: { revalidate: 3600 } // Cache 1 hour
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return null;
  }
}

export default async function ProjectsPage() {
  const initialProjects = await getProjects();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Dự Án Flycam - Portfolio & Công Trình Thực Tế",
            "description": "Tổng hợp các dự án flycam thực tế đã thực hiện",
            "url": "https://flycam.hitek.com.vn/projects"
          })
        }}
      />
      
      <ProjectsClient initialProjects={initialProjects || undefined} />
    </>
  );
}
