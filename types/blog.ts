// types/blog.ts
export interface AllBlogsPageProps {
  getFallbackImage: (index: number) => string;
  onBack: () => void;
}