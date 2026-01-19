// app/components/projects/AllProjectsPage/index.tsx
'use client';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardFooter } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Filter, MapPin, Ruler, Building, Calendar, Eye } from 'lucide-react';

// Helper functions
const getFallbackImage = (index: number): string => {
  const images = [
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522031150111-0fdb8ce8d2e7?w=800&auto=format&fit=crop',
  ];
  return images[index % images.length];
};

interface Project {
  id: string;
  title_vi: string;
  title_en?: string | null;
  excerpt_vi?: string | null;
  excerpt_en?: string | null;
  slug_vi: string;
  slug_en?: string | null;
  image?: string | null;
  category?: string | null;
  author?: string | null;
  project_type?: string | null;
  location?: string | null;
  area?: number | null;
  client?: string | null;
  completion_date?: string | null;
  status: string;
  created_at: string;
  views?: number | null;
}

interface EnhancedProject extends Project {
  displayTitle: string;
  displayExcerpt: string;
  displaySlug: string;
  displayCategory: string;
  displayProjectType: string;
  displayLocation: string;
  displayClient: string;
  formattedArea: string;
  formattedDate: string;
}

export default function AllProjectsPage() {
  const { language } = useLanguage();
  const [allProjects, setAllProjects] = useState<EnhancedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    project_type: '',
    location: '',
  });
  const postsPerPage = 6;
  const router = useRouter();

  // Xác định ngôn ngữ hiển thị
  const displayLanguage = language === 'vi' ? 'vi' : 'en';

  // Fetch projects từ Supabase REST API
  const fetchAllProjects = useCallback(async () => {
    try {
      setLoading(true);
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        setAllProjects([]);
        return;
      }
      
      let query = `${supabaseUrl}/rest/v1/projects?status=eq.published`;
      
      // Add filters
      if (filters.category) {
        query += `&category=eq.${encodeURIComponent(filters.category)}`;
      }
      if (filters.project_type) {
        query += `&project_type=eq.${encodeURIComponent(filters.project_type)}`;
      }
      if (filters.location) {
        query += `&location=ilike.%25${encodeURIComponent(filters.location)}%25`;
      }
      
      query += `&order=created_at.desc`;

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
        const data: Project[] = await response.json();
        
        if (data && data.length > 0) {
          const enhancedProjects: EnhancedProject[] = data.map((project) => {
            // Lấy dữ liệu theo ngôn ngữ
            const title = displayLanguage === 'vi' 
              ? project.title_vi
              : (project.title_en || project.title_vi || 'Untitled project');
            
            const excerpt = displayLanguage === 'vi'
              ? (project.excerpt_vi || '')
              : (project.excerpt_en || project.excerpt_vi || '');
            
            const slug = displayLanguage === 'vi'
              ? project.slug_vi
              : (project.slug_en || project.slug_vi);
            
            const category = project.category || (displayLanguage === 'vi' ? 'Dự án' : 'Project');
            
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
                  month: 'short',
                  year: 'numeric'
                });
              } catch {
                return dateString;
              }
            };
            
            // Translate project type
            const translateProjectType = (type?: string) => {
              if (!type) return displayLanguage === 'vi' ? 'Dự án' : 'Project';
              
              const translations: Record<string, { vi: string, en: string }> = {
                'Quay chụp': { vi: 'Quay chụp', en: 'Filming' },
                'Khảo sát': { vi: 'Khảo sát', en: 'Survey' },
                'Xây dựng': { vi: 'Xây dựng', en: 'Construction' },
                'Nông nghiệp': { vi: 'Nông nghiệp', en: 'Agriculture' },
                'Bất động sản': { vi: 'Bất động sản', en: 'Real Estate' },
                'Sự kiện': { vi: 'Sự kiện', en: 'Events' },
                'Công nghiệp': { vi: 'Công nghiệp', en: 'Industrial' },
                'Môi trường': { vi: 'Môi trường', en: 'Environmental' },
              };
              
              return translations[type] 
                ? (displayLanguage === 'vi' ? translations[type].vi : translations[type].en)
                : type;
            };

            return {
              ...project,
              displayTitle: title,
              displayExcerpt: excerpt,
              displaySlug: slug,
              displayCategory: category,
              displayProjectType: translateProjectType(project.project_type),
              displayLocation: project.location || '',
              displayClient: project.client || '',
              formattedArea: formatArea(project.area),
              formattedDate: formatDate(project.completion_date || project.created_at),
            };
          });
          
          setAllProjects(enhancedProjects);
          setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
        } else {
          setAllProjects([]);
        }
      } else {
        setAllProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setAllProjects([]);
    } finally {
      setLoading(false);
    }
  }, [displayLanguage, filters.category, filters.location, filters.project_type]);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  // Xử lý view details
  const handleViewDetails = (project: EnhancedProject) => {
    router.push(`/projects/${project.displaySlug}`);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ category: '', project_type: '', location: '' });
  };

  // Tính toán pagination
  const totalPages = Math.ceil(allProjects.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentProjects = allProjects.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract filter options
  const categories = [...new Set(allProjects.map(p => p.category).filter(Boolean))];
  const projectTypes = [...new Set(allProjects.map(p => p.project_type).filter(Boolean))];
  const locations = [...new Set(allProjects.map(p => p.location).filter(Boolean))];

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
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
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-20 bg-primary" />
                    <Skeleton className="h-6 w-16 bg-blue-500" />
                  </div>
                  <Skeleton className="h-7 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
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
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {displayLanguage === 'vi' ? 'Tất cả dự án' : 'All Projects'}
          </h1>
          <div className="w-24 h-1 bg-[#d62323] rounded-full"></div>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              <Filter className="w-5 h-5 inline mr-2" />
              {displayLanguage === 'vi' ? 'Lọc dự án' : 'Filter Projects'}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              disabled={!filters.category && !filters.project_type && !filters.location}
            >
              {displayLanguage === 'vi' ? 'Xóa bộ lọc' : 'Clear Filters'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {displayLanguage === 'vi' ? 'Loại dự án' : 'Project Type'}
              </label>
              <select
                value={filters.project_type}
                onChange={(e) => setFilters({...filters, project_type: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#d62323] focus:border-transparent"
              >
                <option value="">{displayLanguage === 'vi' ? 'Tất cả loại' : 'All Types'}</option>
                {projectTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {displayLanguage === 'vi' ? 'Danh mục' : 'Category'}
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#d62323] focus:border-transparent"
              >
                <option value="">{displayLanguage === 'vi' ? 'Tất cả danh mục' : 'All Categories'}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {displayLanguage === 'vi' ? 'Địa điểm' : 'Location'}
              </label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#d62323] focus:border-transparent"
              >
                <option value="">{displayLanguage === 'vi' ? 'Tất cả địa điểm' : 'All Locations'}</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.category || filters.project_type || filters.location) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                {displayLanguage === 'vi' ? 'Bộ lọc đang áp dụng' : 'Active Filters'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {filters.project_type && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {filters.project_type}
                    <button 
                      onClick={() => setFilters({...filters, project_type: ''})}
                      className="ml-2 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center px-3 py-1 bg-[#d62323]/10 text-[#d62323] text-sm font-medium rounded-full">
                    {filters.category}
                    <button 
                      onClick={() => setFilters({...filters, category: ''})}
                      className="ml-2 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {filters.location}
                    <button 
                      onClick={() => setFilters({...filters, location: ''})}
                      className="ml-2 hover:text-green-600"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Empty state */}
        {allProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📷</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">
              {displayLanguage === 'vi' ? 'Không tìm thấy dự án' : 'No projects found'}
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {displayLanguage === 'vi' 
                ? 'Hãy thử thay đổi bộ lọc hoặc quay lại sau khi có thêm dự án mới'
                : 'Try changing your filters or check back later for new projects'}
            </p>
            <Button 
              onClick={fetchAllProjects}
              className="bg-[#d62323] hover:bg-red-600"
            >
              {displayLanguage === 'vi' ? 'Tải lại' : 'Refresh'}
            </Button>
          </div>
        ) : (
          <>
            {/* Projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProjects.map((project, index) => (
                <Card 
                  key={project.id} 
                  className="h-full flex flex-col border border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group"
                  onClick={() => handleViewDetails(project)}
                >
                  {/* Image */}
                  <div className="h-48 overflow-hidden relative">
                    <Image
                      src={project.image || getFallbackImage(startIndex + index)}
                      alt={project.displayTitle}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    
                    {/* Project type badge on image */}
                    {project.displayProjectType && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 bg-[#d62323] text-white text-xs font-bold rounded-full shadow-lg">
                          {project.displayProjectType}
                        </span>
                      </div>
                    )}
                    
                    {/* Views counter */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      <Eye className="w-3 h-3" />
                      <span>{project.views || 0}</span>
                    </div>
                  </div>

                  <CardContent className="p-6 grow flex flex-col">
                    {/* Category tag */}
                    {project.displayCategory && (
                      <div className="mb-4">
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300">
                          {project.displayCategory}
                        </span>
                      </div>
                    )}

                    {/* Title - LUÔN HIỆN 2 DÒNG */}
                    <h3 className="text-xl font-bold mb-3 min-h-14 line-clamp-2 text-gray-800 group-hover:text-[#d62323] transition-colors">
                      {project.displayTitle}
                    </h3>

                    {/* Excerpt - LUÔN HIỆN 3 DÒNG */}
                    {project.displayExcerpt && (
                      <p className="text-gray-600 text-sm grow min-h-16 line-clamp-3 mb-6">
                        {project.displayExcerpt}
                      </p>
                    )}

                    {/* Project details grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {/* Location */}
                      {project.displayLocation && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-gray-500">{displayLanguage === 'vi' ? 'Địa điểm' : 'Location'}</div>
                            <div className="text-sm font-medium text-gray-700 truncate">
                              {project.displayLocation}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Area */}
                      {project.formattedArea && (
                        <div className="flex items-start gap-2">
                          <Ruler className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-gray-500">{displayLanguage === 'vi' ? 'Diện tích' : 'Area'}</div>
                            <div className="text-sm font-medium text-gray-700">{project.formattedArea}</div>
                          </div>
                        </div>
                      )}

                      {/* Client */}
                      {project.displayClient && (
                        <div className="flex items-start gap-2">
                          <Building className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-gray-500">{displayLanguage === 'vi' ? 'Khách hàng' : 'Client'}</div>
                            <div className="text-sm font-medium text-gray-700 truncate">{project.displayClient}</div>
                          </div>
                        </div>
                      )}

                      {/* Completion Date */}
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs text-gray-500">{displayLanguage === 'vi' ? 'Ngày' : 'Date'}</div>
                          <div className="text-sm font-medium text-gray-700">{project.formattedDate}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button 
                      className="w-full bg-[#d62323] hover:bg-red-600 text-white transition-all group"
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(project);
                      }}
                    >
                      {displayLanguage === 'vi' ? 'Xem chi tiết' : 'View Details'}
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination đơn giản - LUÔN HIỆN KHI CÓ DỰ ÁN */}
            {allProjects.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-16 pt-8 border-t border-gray-200">
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

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">
                    {displayLanguage === 'vi' ? 'Trang' : 'Page'} {currentPage} / {totalPages}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({allProjects.length} {displayLanguage === 'vi' ? 'dự án' : 'projects'})
                  </span>
                </div>

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
