// app/(routes)/projects/[slug]/page.tsx
import ProjectDetail from "@/app/components/project/ProjectDetail";

export default function ProjectDetailPage() {
  return <ProjectDetail />;
}

export const dynamic = 'force-dynamic';
