'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProjectData } from './_components/useProjectData';
import ProjectHeader from './_components/ProjectHeader';
import ProgressSection from './_components/ProgressSection';
import ProjectInfoCards from './_components/ProjectInfoCards';
import QuickStatsSection from './_components/QuickStatsSection';
import RecentActivitySection from './_components/RecentActivitySection';
import QuickActionsSection from './_components/QuickActionsSection';
import TasksOverviewSection from './_components/TasksOverviewSection';
import { Activity, QuickStat, TaskOverview } from './_components/types';

export default function ProjectOverviewPage() {
    const params = useParams();
    const projectId = params.id;

    // Use custom hook for data fetching
    const { project, isLoading, error, updateProject } = useProjectData(projectId as string);

    // Mock data for sections (these should eventually come from API)
    const recentActivities: Activity[] = [
        { id: 1, type: "srs", title: "SRS Document Updated", time: "2 hours ago", user: "John Doe" },
        { id: 2, type: "wireframe", title: "Dashboard Wireframe Created", time: "5 hours ago", user: "Jane Smith" },
        { id: 3, type: "diagram", title: "Sequence Diagram Generated", time: "1 day ago", user: "Mike Johnson" },
        { id: 4, type: "conversation", title: "AI Conversation: User Flow", time: "2 days ago", user: "Sarah Williams" },
    ];

    const quickStats: QuickStat[] = [
        { label: "Documents", value: "12", icon: "FileText", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/20" },
        { label: "Wireframes", value: "8", icon: "Layout", color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-900/20" },
        { label: "Diagrams", value: "15", icon: "BarChart3", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/20" },
        { label: "AI Chats", value: "23", icon: "MessageSquare", color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-900/20" },
    ];

    const tasksOverview: TaskOverview = {
        completed: project.completedTasks,
        inProgress: Math.floor((project.totalTasks - project.completedTasks) * 0.6),
        pending: Math.ceil((project.totalTasks - project.completedTasks) * 0.4),
    };

    if (isLoading) {
        return (
            <main className="min-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <div className="p-6 max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-96">
                        <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
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

    return (
        <main className="min-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Back Button for Mobile */}
                <div className="xl:hidden mb-4">
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
                        <span>Back to Dashboard</span>
                    </Link>
                </div>

                {/* Project Header */}
                <ProjectHeader project={project} onProjectUpdate={updateProject} />

                {/* Progress Section */}
                <ProgressSection project={project} />

                {/* Project Info Cards */}
                <ProjectInfoCards project={project} />

                {/* Quick Stats */}
                <QuickStatsSection stats={quickStats} />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <RecentActivitySection activities={recentActivities} />
                    </div>

                    {/* Quick Actions & Tasks */}
                    <div className="space-y-6">
                        <QuickActionsSection projectId={projectId as string | string[]} />
                        <TasksOverviewSection tasks={tasksOverview} />
                    </div>
                </div>
            </div>
        </main>
    );
}