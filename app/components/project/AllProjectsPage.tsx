// app/components/project/AllProjectsPage.tsx
'use client';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardFooter } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';

const generateSlug = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

const getFallbackImage = (index: number): string => {
  const images = [
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
  ];
  return images[index % images.length];
};

interface Project {
  id: string;
  title_vi: string;
  title_en?: string | null;
  excerpt_vi?: string | null;
  excerpt_en?: string | null;
  content_vi?: string | null;
  content_en?: string | null;
  image?: string | null;
  category?: string | null;
  author?: string | null;
  status?: string | null;
  date?: string | null;
  created_at?: string;
  slug_vi: string;
  slug_en?: string | null;
  project_type?: string | null;
  location?: string | null;
  area?: number | null;
  client?: string | null;
  completion_date?: string | null;
}

interface EnhancedProject extends Project {
  displayTitle: string;
  displayExcerpt: string;
  displaySlug: string;
  displayCategory: string;
}

export default function AllProjectsPage() {
  const { t } = useLanguage();
  const [allProjects, setAllProjects] = useState<EnhancedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const router = useRouter();

  const displayLanguage = (t('lang')?.toString() === 'vi') ? 'vi' : 'en';

  const fetchAllProjects = useCallback(async () => {
    try {
      setLoading(true);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase env variables');
        setAllProjects([]);
        return;
      }

      const response = await fetch(
        `${supabaseUrl}/rest/v1/projects?status=eq.published&order=created_at.desc`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data: Project[] = await response.json();

        if (data && data.length > 0) {
          const enhancedProjects: EnhancedProject[] = data.map((project) => {
            const title = displayLanguage === 'vi'
              ? (project.title_vi || project.title_en || 'Dự án không có tiêu đề')
              : (project.title_en || project.title_vi || 'Untitled project');

            const excerpt = displayLanguage === 'vi'
              ? (project.excerpt_vi || project.excerpt_en || '')
              : (project.excerpt_en || project.excerpt_vi || '');

            const slug = displayLanguage === 'vi'
              ? (project.slug_vi || project.slug_en || generateSlug(title))
              : (project.slug_en || project.slug_vi || generateSlug(title));

            const category = project.category || project.project_type || (displayLanguage === 'vi' ? 'Dự án' : 'Project');

            return {
              ...project,
              displayTitle: title,
              displayExcerpt: excerpt,
              displaySlug: slug,
              displayCategory: category,
            };
          });

          setAllProjects(enhancedProjects);
        } else {
          setAllProjects([]);
        }
      } else {
        setAllProjects([]);
      }
    } catch {
      console.error('Error fetching projects');
      setAllProjects([]);
    } finally {
      setLoading(false);
    }
  }, [displayLanguage]);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(displayLanguage === 'vi' ? 'vi-VN' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  const handleViewDetails = (project: EnhancedProject) => {
    router.push(`/projects/${project.displaySlug}`);
  };

  const totalPages = Math.ceil(allProjects.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentProjects = allProjects.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="w-32 h-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="h-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4 bg-primary" />
                  <Skeleton className="h-7 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {displayLanguage === 'vi' ? 'Tất cả dự án' : 'All Projects'}
          </h1>
          <div className="w-24 h-1 bg-red-600 rounded-full"></div>
        </div>

        {allProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-6">🏗️</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">
              {displayLanguage === 'vi' ? 'Chưa có dự án nào' : 'No projects yet'}
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {displayLanguage === 'vi'
                ? 'Hiện chưa có dự án nào được đăng tải. Vui lòng quay lại sau.'
                : 'No projects have been published yet. Please check back later.'}
            </p>
            <Button
              onClick={fetchAllProjects}
              className="bg-primary hover:bg-primary/90"
            >
              {displayLanguage === 'vi' ? 'Tải lại' : 'Refresh'}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="h-full flex flex-col border border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
                  onClick={() => handleViewDetails(project)}
                >
                  <div className="h-48 overflow-hidden relative">
                    <Image
                      src={project.image || getFallbackImage(startIndex + index)}
                      alt={project.displayTitle}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <CardContent className="p-6 grow flex flex-col">
                    <div className="mb-4">
                      <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {project.displayCategory}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 min-h-14 line-clamp-2 text-gray-800 group-hover:text-primary transition-colors">
                      {project.displayTitle}
                    </h3>

                    <p className="text-gray-600 text-sm grow min-h-16 line-clamp-3 mb-6">
                      {project.displayExcerpt || project.content_vi?.substring(0, 120) + '...'}
                    </p>

                    {project.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{project.location}</span>
                      </div>
                    )}

                    <div className="mt-auto pt-5 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">{project.author || 'Hitek Team'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <div>{formatDate(project.date || project.created_at || '')}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button
                      className="w-full bg-primary hover:bg-primary/80 text-white transition-all"
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(project);
                      }}
                    >
                      {displayLanguage === 'vi' ? 'Xem chi tiết' : 'View details'}
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {allProjects.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-gray-200">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="lg"
                  className="border-gray-300 hover:border-gray-400 disabled:opacity-40"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {displayLanguage === 'vi' ? 'Trước' : 'Prev'}
                </Button>

                <div className="text-sm text-gray-600 font-medium">
                  {displayLanguage === 'vi' ? 'Trang' : 'Page'} {currentPage} / {totalPages || 1}
                </div>

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  variant="outline"
                  size="lg"
                  className="border-gray-300 hover:border-gray-400 disabled:opacity-40"
                >
                  {displayLanguage === 'vi' ? 'Sau' : 'Next'}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
