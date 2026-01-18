// app/(routes)/blog/[slug]/page.tsx - ĐƠN GIẢN HÓA
import BlogDetail from "@/app/components/blog/BlogDetail";

export default function BlogDetailPage() {
  return <BlogDetail />;
}

export const dynamic = 'force-dynamic';