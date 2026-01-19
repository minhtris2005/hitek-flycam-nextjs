// app/(routes)/news/[slug]/page.tsx
import ProjectDetail from "@/app/components/projects/ProjectDetail";

export default function ProjectDetailPage() {
  return <ProjectDetail />;
}

export const dynamic = 'force-dynamic';
