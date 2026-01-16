// types/index.ts
export interface BlogPost {
  id: string;
  title: string;
  title_vi?: string | null;
  title_en?: string | null;
  excerpt: string;
  excerpt_vi?: string | null;
  excerpt_en?: string | null;
  content: string;
  content_vi?: string | null;
  content_en?: string | null;
  image?: string | null;
  category?: string | null;
  author?: string | null;
  status: 'published' | 'draft';
  created_at: string;
  updated_at?: string | null;
  views?: number;
  likes?: number;
  comments?: number;
  tags?: string[];
  meta_title?: string | null;
  meta_description?: string | null;
  date?: string;
  slug_vi?: string | null;
  slug_en?: string | null;
}

export interface EnhancedBlogPost extends BlogPost {
  readTime: string;
  slug: string;
  hasEnglish?: boolean;
  hasVietnamese?: boolean;
}


export interface BlogCarouselProps {
  currentPost: EnhancedBlogPost;
  currentIndex: number;
  blogPostsLength: number;
  backgroundImageRef: React.RefObject<HTMLDivElement>;
  getFallbackImage: (index: number) => string;
  children?: React.ReactNode;
}

export interface ThumbnailCarouselProps {
  thumbnailPosts: Array<EnhancedBlogPost & { originalIndex: number }>;
  isAnimating: boolean;
  onThumbnailClick: (clickedIndex: number) => void;
  getFallbackImage: (index: number) => string;
  thumbnailContainerRef: React.RefObject<HTMLDivElement>;
}

export interface BlogControlsProps {
  isAnimating: boolean;
  onPrev: () => void;
  onNext: () => void;
  onViewDetails: (postId: string, e?: React.MouseEvent) => void;
  onViewAllPosts?: () => void;
  currentPostId: string;
  prevBtnRef: React.RefObject<HTMLButtonElement>;
  nextBtnRef: React.RefObject<HTMLButtonElement>;
}

export interface BlogContentProps {
  currentPost: EnhancedBlogPost;
  currentIndex: number;
  blogPostsLength: number;
}

export interface AllBlogsPageProps {
  getFallbackImage: (index: number) => string;
  onBack: () => void;
}