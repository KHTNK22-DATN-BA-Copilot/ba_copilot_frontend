'use client';
import { useRouter } from 'next/navigation';
import { FolderOpen } from 'lucide-react';

type ProjectsSectionProps = {
  isOpenFilter: boolean;
  setIsOpenFilter: (value: boolean) => void;
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
  isLoading?: boolean;
};

// Skeleton component for project cards
const ProjectCardSkeleton = () => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
    <div className="p-6">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
      <div className="space-y-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export default function ProjectsSection({ isOpenFilter, setIsOpenFilter, selectedFilter, setSelectedFilter, isLoading = false }: ProjectsSectionProps) {
  const router = useRouter();

  const handleFilterSelect = (filterName: string) => {
    setSelectedFilter(filterName);
    setIsOpenFilter(false);
    console.log(`${filterName} selected`);
  };

  const handleProjectClick = (projectId: number) => {
    // Navigate to project page
    router.push(`/dashboard/project/${projectId}`);
  };

  return (
    <div className="col-span-12">
      {/* Filter */}
      <div className="flex justify-between items-center mb-6 relative">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Recent projects:
      </h2>

      <div className="relative">
        <button
          onClick={() => setIsOpenFilter(!isOpenFilter)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md flex items-center gap-2"
        >
          {selectedFilter}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpenFilter ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpenFilter && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleFilterSelect("Most Recent")}
                >
                  Most Recent
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleFilterSelect("Title")}
                >
                  Title
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>

      {/* Project Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: 10 }).map((_, index) => (
            <ProjectCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : (
          <>
            {/* Create New Project Button */}
            <div
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-blue-500/20 transition-all duration-200 cursor-pointer rounded-3xl group"
              onClick={() => router.push('/new')}
            >
              <div className="p-6 rounded-3xl h-full flex flex-col items-center justify-center">
                <div className="aspect-square w-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/30 dark:to-indigo-800/30 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <svg
                    className="w-12 h-12 text-blue-500 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Create New</p>
                  <p className="text-xs text-blue-500 dark:text-blue-500">Start a project</p>
                </div>
              </div>
            </div>

            {/* Actual project cards */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <div
                key={item}
                className="bg-muted/30 dark:bg-gray-800 hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-gray-400/20 dark:hover:bg-gray-750 transition-all duration-200 cursor-pointer rounded-3xl"
                onClick={() => handleProjectClick(item)}
              >
                <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-3xl">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-muted-foreground/50 dark:text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm truncate text-gray-900 dark:text-gray-100">Project {item}</p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">2 days ago</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="text-center">
        <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md">
          Show more
        </button>
      </div>
    </div>
  );
}