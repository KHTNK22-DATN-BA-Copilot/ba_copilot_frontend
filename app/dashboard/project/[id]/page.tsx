import Link from 'next/link';
import ProjectHeader from './_components/ProjectHeader';
import ProgressSection from './_components/ProgressSection';
import ProjectInfoCards from './_components/ProjectInfoCards';
import QuickStatsSection from './_components/QuickStatsSection';
import RecentActivitySection from './_components/RecentActivitySection';
import TasksOverviewSection from './_components/TasksOverviewSection';
import DeleteProjectSection from './_components/DeleteProjectSection';
import { QuickStat, RecentFile, TaskOverview } from './_components/types';
import { getProjectById, getRecentUpdatedFiles } from '@/actions/project.action';
import { notFound } from 'next/navigation';

const Error = ({error}: {error: string}) => {
    return (
        <main className="min-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-96">
                    <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                </div>
            </div>
        </main>
    );
}

export default async function ProjectOverviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const project = await getProjectById(id);
    console.log("Fetched project:", project);
    if (project.detail === "Project not found") {
        notFound();
    }
    
    const recentFilesFromApi = await getRecentUpdatedFiles(id, 6);
    const recentFiles: RecentFile[] = recentFilesFromApi.map((file) => ({
        id: file.id,
        name: file.name,
        extension: file.extension,
        updated_at: file.updated_at,
    }));

    console.log('Project Data:', project);
    console.log('ProjectOverviewPage() - Recent Files:', recentFiles);

    const quickStats: QuickStat[] = [
        { label: "Planning", value: "0", icon: "FileText" },
        { label: "Analysis", value: "0", icon: "Layout" },
        { label: "Design", value: "0", icon: "BarChart3" },
        // { label: "AI Chats", value: "0", icon: "MessageSquare" },
    ];

    const tasksOverview: TaskOverview = {
        completed: project.completedTasks || 0,
        inProgress: Math.floor((project.totalTasks - project.completedTasks) * 0.6) || 0,
        pending: Math.ceil((project.totalTasks - project.completedTasks) * 0.4) || 0,
    };


    return (
        <main className="min-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* Back Button for Mobile */}
                <div className="xl:hidden">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center space-x-2 p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        <span className="text-sm sm:text-base">Back to Dashboard</span>
                    </Link>
                </div>

                {/* Project Header */}
                <ProjectHeader project={project} />

                {/* Progress Section */}
                <ProgressSection project={project} />

                {/* Project Info Cards */}
                <ProjectInfoCards project={project} />

                {/* Quick Stats */}
                <QuickStatsSection stats={quickStats} />


                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <RecentActivitySection files={recentFiles} projectId={project.id as string} />
                    </div>

                    {/* Quick Actions & Tasks */}
                    <div className="space-y-4 sm:space-y-6">
                        <TasksOverviewSection tasks={tasksOverview} />
                    </div>
                </div>

                {/* Delete Project Section - Danger Zone */}
                <DeleteProjectSection
                    projectId={project.id as string}
                    projectName={project.name}
                />
            </div>
        </main>
    );
}