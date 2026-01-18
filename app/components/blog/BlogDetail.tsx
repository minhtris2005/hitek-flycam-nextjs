'use client';

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Loader2, ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";

import { HeroSection } from "@/app/components/blog/blog-detail/HeroSection";
import { ArticleMetadata } from "@/app/components/blog/blog-detail/ArticleMetadata";
import { ArticleTitleAndExcerpt } from "@/app/components/blog/blog-detail/ArticleTitleAndExcerpt";
import { ArticleActions } from "@/app/components/blog/blog-detail/ArticleActions";
import { ArticleContent } from "@/app/components/blog/blog-detail/ArticleContent";
import { AuthorBio } from "@/app/components/blog/blog-detail/AuthorBio";
import { RelatedPosts } from "@/app/components/blog/blog-detail/RelatedPosts";
import { TableOfContents } from "@/app/components/blog/blog-detail/TableOfContents";


interface ArticlePost {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  slug: string;
  image?: string;
  date?: string;
  author?: string;
  category?: string;
  views?: number;
  tags?: string[];
  read_time?: number;
  created_at?: string;
  updated_at?: string;
}

interface BlogPost {
  id: string;
  title: string;
  title_vi?: string | null;
  title_en?: string | null;
  excerpt?: string | null;
  excerpt_vi?: string | null;
  excerpt_en?: string | null;
  content?: string | null;
  content_vi?: string | null;
  content_en?: string | null;
  slug?: string | null;
  slug_vi?: string | null;
  slug_en?: string | null;
  image?: string | null;
  date?: string | null;
  author?: string | null;
  category?: string | null;
  created_at?: string;
  updated_at?: string | null;
  views?: number;
  tags?: string[];
  status?: string;
}

interface LocalizedPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  image?: string;
  date?: string;
  author?: string;
  category?: string;
  views?: number;
  tags?: string[];
}

interface Heading {
  id: string;
  text: string;
  level: number;
  tagName: string;
}

interface RelatedPost {
  id: string;
  title: string;
  excerpt?: string;
  image?: string;
  date?: string;
  author?: string;
  category?: string;
  slug: string;
}

export default function BlogDetail() {
  const { language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState("");

  const displayLanguage = language === 'vi' ? 'vi' : 'en';
    const convertToRelatedPost = (lp: LocalizedPost): RelatedPost => ({
    id: lp.id,
    title: lp.title,
    excerpt: lp.excerpt,
    image: lp.image,
    date: lp.date,
    author: lp.author,
    category: lp.category,
    slug: lp.slug,
    });
  // Localize post helper
  const localizePost = (p: BlogPost, lang: 'vi' | 'en'): LocalizedPost => ({
    id: p.id,
    title: lang === 'vi'
      ? (p.title_vi || p.title_en || p.title || '')
      : (p.title_en || p.title_vi || p.title || ''),
    excerpt: lang === 'vi'
      ? (p.excerpt_vi || p.excerpt_en || p.excerpt || '')
      : (p.excerpt_en || p.excerpt_vi || p.excerpt || ''),
    content: lang === 'vi'
      ? (p.content_vi || p.content_en || p.content || '')
      : (p.content_en || p.content_vi || p.content || ''),
    slug: lang === 'vi'
      ? (p.slug_vi || p.slug_en || p.slug || p.id)
      : (p.slug_en || p.slug_vi || p.slug || p.id),
    image: p.image || undefined,
    date: p.date || p.created_at || undefined,
    author: p.author || undefined,
    category: p.category || undefined,
    views: p.views || 0,
    tags: p.tags || [],
  });

  // Convert LocalizedPost to ArticlePost for component compatibility
  const convertToArticlePost = (lp: LocalizedPost): ArticlePost => ({
    id: lp.id,
    title: lp.title,
    excerpt: lp.excerpt,
    content: lp.content,
    slug: lp.slug,
    image: lp.image,
    date: lp.date,
    author: lp.author,
    category: lp.category,
    views: lp.views,
    tags: lp.tags,
    created_at: lp.date || new Date().toISOString(),
  });

  // Fetch post from Supabase
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          console.error('Missing Supabase env variables');
          setLoading(false);
          return;
        }

        // Try multiple queries: slug_vi, slug_en, then id
        let foundPost: BlogPost | null = null;

        // Try slug_vi first
        let response = await fetch(
          `${supabaseUrl}/rest/v1/blog_posts?slug_vi=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            foundPost = data[0];
          }
        }

        // Try slug_en if not found
        if (!foundPost) {
          response = await fetch(
            `${supabaseUrl}/rest/v1/blog_posts?slug_en=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
            {
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              foundPost = data[0];
            }
          }
        }

        // Try id if still not found
        if (!foundPost) {
          response = await fetch(
            `${supabaseUrl}/rest/v1/blog_posts?id=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
            {
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              foundPost = data[0];
            }
          }
        }

        if (foundPost) {
          setPost(foundPost);
          // Increment view count
          incrementViewCount(foundPost.id, supabaseUrl, supabaseKey);
          // Load related posts
          if (foundPost.category) {
            fetchRelatedPosts(foundPost.id, foundPost.category, supabaseUrl, supabaseKey);
          }
        } else {
          console.log('Post not found for slug:', slug);
          setPost(null);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const incrementViewCount = async (postId: string, supabaseUrl: string, supabaseKey: string) => {
    try {
      const getResponse = await fetch(
        `${supabaseUrl}/rest/v1/blog_posts?id=eq.${postId}&select=views`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }
      );

      if (getResponse.ok) {
        const data = await getResponse.json();
        const currentViews = data[0]?.views || 0;

        await fetch(
          `${supabaseUrl}/rest/v1/blog_posts?id=eq.${postId}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({ views: currentViews + 1 }),
          }
        );
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const fetchRelatedPosts = async (
  currentPostId: string,
  category: string,
  supabaseUrl: string,
  supabaseKey: string
) => {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?category=eq.${encodeURIComponent(category)}&id=neq.${currentPostId}&status=eq.published&limit=3&order=created_at.desc`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const localized = data.map((p: BlogPost) => {
        const lp = localizePost(p, displayLanguage);
        return convertToRelatedPost(lp); // Dùng hàm mới
      });
      setRelatedPosts(localized);
    }
  } catch (error) {
    console.error("Error fetching related posts:", error);
  }
};

  // Localized post data
  const localizedPost = useMemo((): LocalizedPost | null => {
    if (!post) return null;
    return localizePost(post, displayLanguage);
  }, [post, displayLanguage]);

  // Article post for components
  const articlePost = useMemo((): ArticlePost | null => {
    if (!localizedPost) return null;
    return convertToArticlePost(localizedPost);
  }, [localizedPost]);

  // Extract headings from content
  const headings = useMemo((): Heading[] => {
    if (!localizedPost?.content || typeof window === 'undefined') return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(localizedPost.content, "text/html");
    const headingElements = doc.querySelectorAll("h1, h2");

    return Array.from(headingElements).map((element, index) => {
      const text = element.textContent?.trim() || "";
      const tagName = element.tagName.toLowerCase();
      const level = parseInt(element.tagName.replace('H', ''));
      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      return { id, text, level, tagName };
    });
  }, [localizedPost?.content]);

  // Calculate read time
  const readTime = useMemo(() => {
    if (!localizedPost?.content) return 5;
    const wordCount = localizedPost.content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  }, [localizedPost?.content]);

  // Intersection Observer for active headings
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -70% 0%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleHeadingClick = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setShowMobileToc(false);
    }
  };

  // Render content with heading IDs
  const renderedContent = useMemo(() => {
    if (!localizedPost?.content) return "";

    let content = localizedPost.content;
    let headingIndex = 0;

    // Add IDs to headings
    content = content.replace(/<(h[1-2])([^>]*)>/gi, (match, tag, attrs) => {
      const heading = headings[headingIndex];
      headingIndex++;
      if (heading) {
        return `<${tag}${attrs} id="${heading.id}">`;
      }
      return match;
    });

    // Fix links to open in new tab
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const links = doc.querySelectorAll("a[href^='http']");
    links.forEach(link => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    return doc.body.innerHTML;
  }, [localizedPost?.content, headings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 w-8 h-8 text-primary" />
          <p className="text-muted-foreground">
            {displayLanguage === 'vi' ? 'Đang tải bài viết...' : 'Loading article...'}
        </p>
        </div>
      </div>
    );
  }

  if (!post || !localizedPost || !articlePost) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">
            {displayLanguage === 'vi' ? 'Không tìm thấy bài viết' : 'Article not found'}
          </h1>
          <Button onClick={() => router.push("/blog")}>
            {displayLanguage === 'vi' ? 'Quay lại danh sách' : 'Back to list'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global styles for article links */}
      <style>{`
        article a[href],
        article a,
        .prose a[href],
        .prose a,
        div[class*="text-"] a[href],
        div[class*="text-"] a {
          color: #2563eb !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          pointer-events: auto !important;
          transition: all 0.2s ease !important;
          position: relative !important;
          z-index: 999 !important;
          display: inline !important;
        }
        article a[href]:hover,
        article a:hover,
        .prose a[href]:hover,
        .prose a:hover {
          color: #1e40af !important;
          text-decoration: none !important;
        }

        /* Force all parent containers to allow pointer events */
        article, article *, .prose, .prose * {
          pointer-events: auto !important;
        }
      `}</style>

      <HeroSection
        image={post.image || undefined}
        title={localizedPost.title}
      />

      <div className="container mx-auto px-4 py-8 max-w-400">
        {/* Mobile TOC */}
        {headings.length > 0 && (
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowMobileToc(!showMobileToc)}
              className="w-full flex items-center justify-center"
            >
              <Menu className="w-4 h-4 mr-2" />
              {showMobileToc 
                ? (displayLanguage === 'vi' ? 'Ẩn mục lục' : 'Hide table of contents') 
                : (displayLanguage === 'vi' ? 'Hiện mục lục' : 'Show table of contents')
              }
            </Button>

            {showMobileToc && (
              <div className="mt-4 bg-card rounded-xl shadow-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Menu className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">
                    {displayLanguage === 'vi' ? 'Mục lục' : 'Table of contents'}
                  </h3>
                </div>

                <nav className="space-y-1 max-h-60 overflow-y-auto">
                  {headings.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => handleHeadingClick(heading.id)}
                      className={`block w-full text-left py-2 px-3 rounded-lg transition-all text-sm font-semibold ${
                        activeHeadingId === heading.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {heading.tagName === 'h1' && '📌'}
                        {heading.tagName === 'h2' && '•'}
                        <span className="truncate">{heading.text}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center relative">
          {/* Main Content */}
          <div className="max-w-6xl w-full">
            {/* Back button when no hero image */}
            {!post.image && (
              <div className="mb-8">
                <Button variant="ghost" onClick={() => router.push("/blog")} className="mb-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {displayLanguage === 'vi' ? 'Quay lại' : 'Go back'}
                </Button>
              </div>
            )}

            <article className="bg-white text-card-foreground rounded-2xl shadow-lg p-6 md:p-10 -mt-20 relative z-10 border border-border">
              <ArticleMetadata
                post={articlePost}
                readTime={readTime}
                viewCount={articlePost.views || 0}
              />
              
              <ArticleTitleAndExcerpt
                title={localizedPost.title}
                excerpt={localizedPost.excerpt}
              />
              
              <ArticleActions
                post={articlePost}
              />
              
              <Separator className="mb-8" />
              
              <ArticleContent>
                <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
              </ArticleContent>
              
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <AuthorBio
                post={articlePost}
              />
            </article>

            {relatedPosts.length > 0 && (
                <RelatedPosts
                    relatedPosts={relatedPosts} // Bây giờ đúng type
                    currentPostId={post.id}
                />
                )}
          </div>

          {/* Table of Contents - Desktop */}
          {headings.length > 0 && (
            <div className="hidden lg:block ml-8">
              <TableOfContents
                headings={headings}
                activeId={activeHeadingId}
                onHeadingClick={handleHeadingClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}