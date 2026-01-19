// app/components/projects/ProjectDetail/index.tsx
'use client';

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Loader2, ArrowLeft, Menu, MapPin, Ruler, Calendar, Users } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";

import { HeroSection } from "@/app/components/projects/ProjectDetail/HeroSection";
import { RelatedProjects } from "@/app/components/projects/ProjectDetail/RelatedProjects";
// Sử dụng các component từ blog
import { ArticleMetadata } from "@/app/components/blog/blog-detail/ArticleMetadata";
import { ArticleTitleAndExcerpt } from "@/app/components/blog/blog-detail/ArticleTitleAndExcerpt";
import { ArticleActions } from "@/app/components/blog/blog-detail/ArticleActions";
import { ArticleContent } from "@/app/components/blog/blog-detail/ArticleContent";
import { AuthorBio } from "@/app/components/blog/blog-detail/AuthorBio";
import { TableOfContents } from "@/app/components/blog/blog-detail/TableOfContents";

interface ArticleProject {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  slug: string;
  image?: string;
  date?: string;
  author?: string;
  category?: string;
  project_type?: string;
  location?: string;
  area?: number;
  client?: string;
  completion_date?: string;
  views?: number;
  tags?: string[];
  read_time?: number;
  created_at?: string;
  updated_at?: string;
}

interface ProjectPost {
  id: string;
  title_vi: string;
  title_en?: string | null;
  excerpt_vi?: string | null;
  excerpt_en?: string | null;
  content_vi?: string | null;
  content_en?: string | null;
  slug_vi: string;
  slug_en?: string | null;
  meta_title_vi?: string | null;
  meta_title_en?: string | null;
  meta_description_vi?: string | null;
  meta_description_en?: string | null;
  image?: string | null;
  date?: string | null;
  author?: string | null;
  category?: string | null;
  project_type?: string | null;
  location?: string | null;
  area?: number | null;
  client?: string | null;
  completion_date?: string | null;
  status?: string | null;
  created_at?: string;
  updated_at?: string | null;
  user_id?: string | null;
  views?: number | null;
  tags?: string[] | null;
}

interface LocalizedProject {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  image?: string;
  date?: string;
  author?: string;
  category?: string;
  project_type?: string;
  location?: string;
  area?: number;
  client?: string;
  completion_date?: string;
  views?: number;
  tags?: string[];
}

interface Heading {
  id: string;
  text: string;
  level: number;
  tagName: string;
}

interface RelatedProject {
  id: string;
  title: string;
  excerpt?: string;
  image?: string;
  date?: string;
  author?: string;
  category?: string;
  project_type?: string;
  location?: string;
  slug: string;
}

export default function ProjectDetail() {
  const { language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [project, setProject] = useState<ProjectPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState<RelatedProject[]>([]);
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState("");

  const displayLanguage = language === 'vi' ? 'vi' : 'en';
  
  const convertToRelatedProject = (lp: LocalizedProject): RelatedProject => ({
    id: lp.id,
    title: lp.title,
    excerpt: lp.excerpt,
    image: lp.image,
    date: lp.date,
    author: lp.author,
    category: lp.category,
    project_type: lp.project_type,
    location: lp.location,
    slug: lp.slug,
  });

  // Localize project helper
  const localizeProject = (p: ProjectPost, lang: 'vi' | 'en'): LocalizedProject => ({
    id: p.id,
    title: lang === 'vi'
      ? p.title_vi
      : (p.title_en || p.title_vi),
    excerpt: lang === 'vi'
      ? (p.excerpt_vi || '')
      : (p.excerpt_en || p.excerpt_vi || ''),
    content: lang === 'vi'
      ? (p.content_vi || '')
      : (p.content_en || p.content_vi || ''),
    slug: lang === 'vi'
      ? p.slug_vi
      : (p.slug_en || p.slug_vi),
    meta_title: lang === 'vi'
      ? (p.meta_title_vi || '')
      : (p.meta_title_en || p.meta_title_vi || ''),
    meta_description: lang === 'vi'
      ? (p.meta_description_vi || '')
      : (p.meta_description_en || p.meta_description_vi || ''),
    image: p.image || undefined,
    date: p.date || p.created_at || undefined,
    author: p.author || undefined,
    category: p.category || undefined,
    project_type: p.project_type || undefined,
    location: p.location || undefined,
    area: p.area || undefined,
    client: p.client || undefined,
    completion_date: p.completion_date || undefined,
    views: p.views || 0,
    tags: p.tags || [],
  });

  // Convert LocalizedProject to ArticleProject for component compatibility
  const convertToArticleProject = (lp: LocalizedProject): ArticleProject => ({
    id: lp.id,
    title: lp.title,
    excerpt: lp.excerpt,
    content: lp.content,
    slug: lp.slug,
    image: lp.image,
    date: lp.date,
    author: lp.author,
    category: lp.category,
    project_type: lp.project_type,
    location: lp.location,
    area: lp.area,
    client: lp.client,
    completion_date: lp.completion_date,
    views: lp.views,
    tags: lp.tags,
    created_at: lp.date || new Date().toISOString(),
  });

  // Fetch project from Supabase
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

        // Try multiple queries: slug_vi, slug_en, then id
        let foundProject: ProjectPost | null = null;

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
          // Increment view count
          incrementViewCount(foundProject.id, supabaseUrl, supabaseKey);
          // Load related projects
          if (foundProject.category || foundProject.project_type) {
            fetchRelatedProjects(
              foundProject.id, 
              foundProject.category, 
              foundProject.project_type, 
              supabaseUrl, 
              supabaseKey
            );
          }
        } else {
          console.log('Project not found for slug:', slug);
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
    category: string | null | undefined,
    projectType: string | null | undefined,
    supabaseUrl: string,
    supabaseKey: string
  ) => {
    try {
      let query = `${supabaseUrl}/rest/v1/projects?id=neq.${currentProjectId}&status=eq.published&limit=3&order=created_at.desc`;
      
      // Build query based on available filters
      if (category && projectType) {
        query += `&or=(category.eq.${encodeURIComponent(category)},project_type.eq.${encodeURIComponent(projectType)})`;
      } else if (category) {
        query += `&category=eq.${encodeURIComponent(category)}`;
      } else if (projectType) {
        query += `&project_type=eq.${encodeURIComponent(projectType)}`;
      }

      const response = await fetch(
        query,
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
        const localized = data.map((p: ProjectPost) => {
          const lp = localizeProject(p, displayLanguage);
          return convertToRelatedProject(lp);
        });
        setRelatedProjects(localized);
      }
    } catch (error) {
      console.error("Error fetching related projects:", error);
    }
  };

  // Localized project data
  const localizedProject = useMemo((): LocalizedProject | null => {
    if (!project) return null;
    return localizeProject(project, displayLanguage);
  }, [project, displayLanguage]);

  // Article project for components
  const articleProject = useMemo((): ArticleProject | null => {
    if (!localizedProject) return null;
    return convertToArticleProject(localizedProject);
  }, [localizedProject]);

  // Extract headings from content
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

  // Calculate read time
  const readTime = useMemo(() => {
    if (!localizedProject?.content) return 5;
    const wordCount = localizedProject.content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  }, [localizedProject?.content]);

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
    if (!localizedProject?.content) return "";

    let content = localizedProject.content;
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
  }, [localizedProject?.content, headings]);

  // Format area
  const formatArea = (area?: number) => {
    if (!area) return '';
    if (displayLanguage === 'vi') {
      return area >= 10000 
        ? `${(area / 10000).toFixed(1)} ha` 
        : `${area.toLocaleString('vi-VN')} m²`;
    } else {
      return area >= 10000 
        ? `${(area / 10000).toFixed(1)} ha` 
        : `${area.toLocaleString('en-US')} m²`;
    }
  };

  // Format date
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
      return dateString;
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

  if (!project || !localizedProject || !articleProject) {
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
        image={project.image || undefined}
        title={localizedProject.title}
        subtitle={localizedProject.excerpt}
        category={localizedProject.category}
        project_type={localizedProject.project_type}
        location={localizedProject.location}
        client={localizedProject.client}
        completion_date={localizedProject.completion_date}
        area={localizedProject.area}
        author={localizedProject.author}
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
            {!project.image && (
              <div className="mb-8">
                <Button variant="ghost" onClick={() => router.push("/projects")} className="mb-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {displayLanguage === 'vi' ? 'Quay lại dự án' : 'Back to projects'}
                </Button>
              </div>
            )}

            <article className="bg-white text-card-foreground rounded-2xl shadow-lg p-6 md:p-10 -mt-20 relative z-10 border border-border">
              {/* Project Summary Card - Tương tự như blog nhưng thêm thông tin dự án */}
              <div className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-gray-50 rounded-xl border border-primary/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Project Type */}
                  {localizedProject.project_type && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {displayLanguage === 'vi' ? 'Loại dự án' : 'Project Type'}
                        </div>
                        <div className="font-semibold text-foreground">{localizedProject.project_type}</div>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {localizedProject.location && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {displayLanguage === 'vi' ? 'Địa điểm' : 'Location'}
                        </div>
                        <div className="font-semibold text-foreground">{localizedProject.location}</div>
                      </div>
                    </div>
                  )}

                  {/* Area */}
                  {localizedProject.area && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Ruler className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {displayLanguage === 'vi' ? 'Diện tích' : 'Area'}
                        </div>
                        <div className="font-semibold text-foreground">{formatArea(localizedProject.area)}</div>
                      </div>
                    </div>
                  )}

                  {/* Completion Date */}
                  {localizedProject.completion_date && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {displayLanguage === 'vi' ? 'Hoàn thành' : 'Completed'}
                        </div>
                        <div className="font-semibold text-foreground">{formatDate(localizedProject.completion_date)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <ArticleMetadata
                post={articleProject}
                readTime={readTime}
                viewCount={articleProject.views || 0}
              />
              
              <ArticleTitleAndExcerpt
                title={localizedProject.title}
                excerpt={localizedProject.excerpt}
              />
              
              <ArticleActions
                post={articleProject}
              />
              
              <Separator className="mb-8" />
              
              <ArticleContent>
                <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
              </ArticleContent>
              
              {/* Project Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
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
                post={articleProject}
              />
            </article>

            {/* Related Projects - Sử dụng component từ projects */}
            {relatedProjects.length > 0 && (
              <RelatedProjects
                relatedProjects={relatedProjects}
                currentProjectId={project.id}
                displayLanguage={displayLanguage}
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
