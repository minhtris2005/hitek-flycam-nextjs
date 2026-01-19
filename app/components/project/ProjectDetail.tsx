'use client';

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Loader2, ArrowLeft, Menu, MapPin, Calendar, Building, Ruler } from "lucide-react";
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

interface Project {
  id: string;
  title_vi: string;
  title_en?: string | null;
  excerpt_vi?: string | null;
  excerpt_en?: string | null;
  content_vi?: string | null;
  content_en?: string | null;
  slug_vi: string;
  slug_en?: string | null;
  image?: string | null;
  date?: string | null;
  author?: string | null;
  category?: string | null;
  created_at?: string;
  updated_at?: string | null;
  views?: number;
  status?: string;
  project_type?: string | null;
  location?: string | null;
  area?: number | null;
  client?: string | null;
  completion_date?: string | null;
}

interface LocalizedProject {
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
  project_type?: string;
  location?: string;
  area?: number;
  client?: string;
  completion_date?: string;
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

export default function ProjectDetail() {
  const { language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState<RelatedPost[]>([]);
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState("");

  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  const convertToRelatedPost = (lp: LocalizedProject): RelatedPost => ({
    id: lp.id,
    title: lp.title,
    excerpt: lp.excerpt,
    image: lp.image,
    date: lp.date,
    author: lp.author,
    category: lp.category,
    slug: lp.slug,
  });

  const localizeProject = (p: Project, lang: 'vi' | 'en'): LocalizedProject => ({
    id: p.id,
    title: lang === 'vi'
      ? (p.title_vi || p.title_en || '')
      : (p.title_en || p.title_vi || ''),
    excerpt: lang === 'vi'
      ? (p.excerpt_vi || p.excerpt_en || '')
      : (p.excerpt_en || p.excerpt_vi || ''),
    content: lang === 'vi'
      ? (p.content_vi || p.content_en || '')
      : (p.content_en || p.content_vi || ''),
    slug: lang === 'vi'
      ? (p.slug_vi || p.slug_en || p.id)
      : (p.slug_en || p.slug_vi || p.id),
    image: p.image || undefined,
    date: p.date || p.created_at || undefined,
    author: p.author || undefined,
    category: p.category || p.project_type || undefined,
    views: p.views || 0,
    project_type: p.project_type || undefined,
    location: p.location || undefined,
    area: p.area || undefined,
    client: p.client || undefined,
    completion_date: p.completion_date || undefined,
  });

  const convertToArticlePost = (lp: LocalizedProject): ArticlePost => ({
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
    created_at: lp.date || new Date().toISOString(),
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          console.error('Missing Supabase env variables');
          setLoading(false);
          return;
        }

        let foundProject: Project | null = null;

        // Try slug_vi first
        let response = await fetch(
          `${supabaseUrl}/rest/v1/projects?slug_vi=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
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
            foundProject = data[0];
          }
        }

        // Try slug_en if not found
        if (!foundProject) {
          response = await fetch(
            `${supabaseUrl}/rest/v1/projects?slug_en=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
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
              foundProject = data[0];
            }
          }
        }

        // Try id if still not found
        if (!foundProject) {
          response = await fetch(
            `${supabaseUrl}/rest/v1/projects?id=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
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
              foundProject = data[0];
            }
          }
        }

        if (foundProject) {
          setProject(foundProject);
          incrementViewCount(foundProject.id, supabaseUrl, supabaseKey);
          if (foundProject.category || foundProject.project_type) {
            fetchRelatedProjects(foundProject.id, foundProject.category || foundProject.project_type || '', supabaseUrl, supabaseKey);
          }
        } else {
          setProject(null);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const incrementViewCount = async (projectId: string, supabaseUrl: string, supabaseKey: string) => {
    try {
      const getResponse = await fetch(
        `${supabaseUrl}/rest/v1/projects?id=eq.${projectId}&select=views`,
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
          `${supabaseUrl}/rest/v1/projects?id=eq.${projectId}`,
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

  const fetchRelatedProjects = async (
    currentProjectId: string,
    category: string,
    supabaseUrl: string,
    supabaseKey: string
  ) => {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/projects?or=(category.eq.${encodeURIComponent(category)},project_type.eq.${encodeURIComponent(category)})&id=neq.${currentProjectId}&status=eq.published&limit=3&order=created_at.desc`,
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
        const localized = data.map((p: Project) => {
          const lp = localizeProject(p, displayLanguage);
          return convertToRelatedPost(lp);
        });
        setRelatedProjects(localized);
      }
    } catch (error) {
      console.error("Error fetching related projects:", error);
    }
  };

  const localizedProject = useMemo((): LocalizedProject | null => {
    if (!project) return null;
    return localizeProject(project, displayLanguage);
  }, [project, displayLanguage]);

  const articlePost = useMemo((): ArticlePost | null => {
    if (!localizedProject) return null;
    return convertToArticlePost(localizedProject);
  }, [localizedProject]);

  const headings = useMemo((): Heading[] => {
    if (!localizedProject?.content || typeof window === 'undefined') return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(localizedProject.content, "text/html");
    const headingElements = doc.querySelectorAll("h1, h2");

    return Array.from(headingElements).map((element, index) => {
      const text = element.textContent?.trim() || "";
      const tagName = element.tagName.toLowerCase();
      const level = parseInt(element.tagName.replace('H', ''));
      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      return { id, text, level, tagName };
    });
  }, [localizedProject?.content]);

  const readTime = useMemo(() => {
    if (!localizedProject?.content) return 5;
    const wordCount = localizedProject.content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  }, [localizedProject?.content]);

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

  const renderedContent = useMemo(() => {
    if (!localizedProject?.content) return "";

    let content = localizedProject.content;
    let headingIndex = 0;

    content = content.replace(/<(h[1-2])([^>]*)>/gi, (match, tag, attrs) => {
      const heading = headings[headingIndex];
      headingIndex++;
      if (heading) {
        return `<${tag}${attrs} id="${heading.id}">`;
      }
      return match;
    });

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const links = doc.querySelectorAll("a[href^='http']");
    links.forEach(link => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    return doc.body.innerHTML;
  }, [localizedProject?.content, headings]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(displayLanguage === 'vi' ? 'vi-VN' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 w-8 h-8 text-primary" />
          <p className="text-muted-foreground">
            {displayLanguage === 'vi' ? 'Đang tải dự án...' : 'Loading project...'}
          </p>
        </div>
      </div>
    );
  }

  if (!project || !localizedProject || !articlePost) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">
            {displayLanguage === 'vi' ? 'Không tìm thấy dự án' : 'Project not found'}
          </h1>
          <Button onClick={() => router.push("/projects")}>
            {displayLanguage === 'vi' ? 'Quay lại danh sách' : 'Back to list'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
        article, article *, .prose, .prose * {
          pointer-events: auto !important;
        }
      `}</style>

      <HeroSection
        image={project.image || undefined}
        title={localizedProject.title}
      />

      <div className="container mx-auto px-4 py-8 max-w-400">
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
          <div className="max-w-6xl w-full">
            {!project.image && (
              <div className="mb-8">
                <Button variant="ghost" onClick={() => router.push("/projects")} className="mb-6">
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
                title={localizedProject.title}
                excerpt={localizedProject.excerpt}
              />

              {/* Project Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                {localizedProject.location && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">
                        {displayLanguage === 'vi' ? 'Địa điểm' : 'Location'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{localizedProject.location}</p>
                  </div>
                )}
                {localizedProject.client && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Building className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">
                        {displayLanguage === 'vi' ? 'Khách hàng' : 'Client'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{localizedProject.client}</p>
                  </div>
                )}
                {localizedProject.area && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Ruler className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">
                        {displayLanguage === 'vi' ? 'Diện tích' : 'Area'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{localizedProject.area} m²</p>
                  </div>
                )}
                {localizedProject.completion_date && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">
                        {displayLanguage === 'vi' ? 'Hoàn thành' : 'Completed'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{formatDate(localizedProject.completion_date)}</p>
                  </div>
                )}
              </div>

              <ArticleActions
                post={articlePost}
              />

              <Separator className="mb-8" />

              <ArticleContent>
                <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
              </ArticleContent>

              <AuthorBio
                post={articlePost}
              />
            </article>

            {relatedProjects.length > 0 && (
              <RelatedPosts
                relatedPosts={relatedProjects}
                currentPostId={project.id}
              />
            )}
          </div>

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
