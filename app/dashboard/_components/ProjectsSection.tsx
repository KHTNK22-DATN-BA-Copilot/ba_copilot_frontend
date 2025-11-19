import { FolderOpen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ProjectMoreMenu from "./ProjectMoreMenu";
import { redirect } from "next/navigation";
import { getDay } from "@/lib/utils";

type ProjectsSectionProps = {
    isOpenFilter: boolean;
    setIsOpenFilter: (value: boolean) => void;
    selectedFilter: string;
    setSelectedFilter: (value: string) => void;
    isLoading?: boolean;
    projects: any[];
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

export default function ProjectsSection({
    isOpenFilter,
    setIsOpenFilter,
    selectedFilter,
    setSelectedFilter,
    isLoading = false,
    projects,
}: ProjectsSectionProps) {
    const [deletingProjectId, setDeletingProjectId] = useState<number | null>(
        null
    );
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [sortedProjects, setSortedProjects] = useState<any[]>(projects);

    const handleFilterSelect = (filterName: string) => {
        setSelectedFilter(filterName);
        setIsOpenFilter(false);
        console.log(`${filterName} selected`);
        switch (filterName) {
            case "Most Recent":
                setSortedProjects(
                    [...projects].sort((a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                );
                break; 
            case "Title":
                setSortedProjects(
                    [...projects].sort((a, b) =>
                        a.name.localeCompare(b.name)
                    )
                );
                break;
            default:
                setSortedProjects(projects);
                break;
        }
    };


    const handleDeleteProject = async (projectId: number) => {
        setDeletingProjectId(projectId);
        setDeleteError(null);

        try {
            // Soft delete: Backend sets project status to "deleted" instead of removing it
            const response = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                // Success - project has been soft deleted (status changed to "deleted")
                console.log("Project deleted successfully:", data.message);
                // Refresh the page to update the project list (soft deleted projects won't appear)

            } else {
                // Error from API
                setDeleteError(data.error || "Failed to delete project");
                console.error("Error deleting project:", data.error);
            }
        } catch (error) {
            // Network or other error
            setDeleteError(
                "An unexpected error occurred while deleting the project"
            );
            console.error("Error deleting project:", error);
        } finally {
            setDeletingProjectId(null);
        }
    };

    return (
        <div className="col-span-12">
            {/* Error Message */}
            {deleteError && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm">
                        {deleteError}
                    </p>
                </div>
            )}

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
                            className={`w-4 h-4 transition-transform duration-200 ${isOpenFilter ? "rotate-180" : ""
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {isOpenFilter && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() =>
                                            handleFilterSelect("Most Recent")
                                        }
                                    >
                                        Most Recent
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() =>
                                            handleFilterSelect("Title")
                                        }
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
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 sm:gap-4 mb-8">
                {isLoading ? (
                    // Skeleton loading state
                    Array.from({ length: projects.length }).map((_, index) => (
                        <ProjectCardSkeleton key={`skeleton-${index}`} />
                    ))
                ) : (
                    <>
                        {/* Create New Project Button */}
                        <Link
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-blue-500/20 transition-all duration-200 cursor-pointer rounded-3xl group"
                            href="/new-project"
                        >
                            {/* Mobile: horizontal layout */}
                            <div className="p-4 rounded-3xl flex items-center gap-4 sm:hidden">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/30 dark:to-indigo-800/30 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0">
                                    <svg
                                        className="w-8 h-8 text-blue-500 dark:text-blue-400"
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
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        Create New
                                    </p>
                                    <p className="text-xs text-blue-500 dark:text-blue-500">
                                        Start a project
                                    </p>
                                </div>
                            </div>

                            {/* Desktop: original vertical layout */}
                            <div className="hidden sm:flex p-6 rounded-3xl h-full flex-col items-center justify-center">
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
                                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        Create New
                                    </p>
                                    <p className="text-xs text-blue-500 dark:text-blue-500">
                                        Start a project
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Actual project cards */}
                        {sortedProjects.map((item) => (
                            <div
                                onClick={(e) => {
                                    redirect(`/dashboard/project/${item.id}`)
                                }}
                                key={item.id}
                                className="bg-muted/30 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-gray-400/20 dark:hover:bg-gray-750 transition-all duration-200 cursor-pointer rounded-3xl"
                            >
                                {/* Mobile: horizontal list layout */}
                                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center gap-4 sm:hidden">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                                        <FolderOpen className="w-8 h-8 text-muted-foreground/50 dark:text-gray-400" />
                                    </div>
                                    <div className="flex-1 flex items-center justify-between">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm truncate text-gray-900 dark:text-gray-100">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground dark:text-gray-400">
                                                {getDay(item.created_at)}
                                            </p>
                                        </div>
                                        <ProjectMoreMenu
                                            projectId={item.id}
                                            projectName={`Project ${item.name}`}
                                            onDelete={() => handleDeleteProject(item.id)}
                                            isDeleting={
                                                deletingProjectId === item.id
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Desktop: original vertical card layout */}
                                <div className="hidden sm:block p-6 bg-gray-100 dark:bg-gray-800 rounded-3xl">
                                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                                        <FolderOpen className="w-12 h-12 text-muted-foreground/50 dark:text-gray-400" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm truncate text-gray-900 dark:text-gray-100">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground dark:text-gray-400">
                                                {getDay(item.created_at)}
                                            </p>
                                        </div>

                                        
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
