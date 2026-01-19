// app/(routes)/news/[slug]/page.tsx
import NewsDetail from "@/app/components/news/NewsDetail";

export default function NewsDetailPage() {
  return <NewsDetail />;
}

export const dynamic = 'force-dynamic';
