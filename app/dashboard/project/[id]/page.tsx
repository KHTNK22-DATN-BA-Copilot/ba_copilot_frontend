'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import {
    FileText,
    Layout,
    BarChart3,
    MessageSquare,
    Calendar,
    Clock,
    Users,
    CheckCircle2,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function ProjectOverviewPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id;

    const [project, setProject] = useState({
        id: projectId,
        name: `Project ${projectId}`,
        description: "A comprehensive business analysis project...",
        status: "In Progress",
        progress: 65,
        createdDate: "Oct 1, 2025",
        dueDate: "Dec 15, 2025",
        teamMembers: 5,
        completedTasks: 24,
        totalTasks: 37,
    });

    // Fetch project data when component mounts
    useEffect(() => {
        const fetchProjectData = async () => {
            if (!projectId) return;

            try {
                console.log(`🔄 Fetching project data for ID: ${projectId}`);

                const response = await fetch(`/api/projects/${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProject(prev => ({
                    ...prev,
                    name: data.name,
                    description: data.description,
                    status: data.status,
                    createdDate: data.created_at,
                    dueDate: data.updated_at,
                }));
                // Update other project fields as necessary

                // Print the response in terminal (console)
                console.log('✅ Project data received:');
                console.log(JSON.stringify(data, null, 2));
                console.log('-------------------');
                console.log('Project Details:');
                console.log(`- ID: ${data.id}`);
                console.log(`- Name: ${data.name}`);
                console.log(`- Description: ${data.description}`);
                console.log(`- Status: ${data.status}`);
                console.log(`- Created At: ${data.created_at}`);
                console.log(`- Updated At: ${data.updated_at}`);
                console.log('-------------------');

            } catch (error) {
                console.error('❌ Error fetching project data:', error);
            }
        };

        fetchProjectData();
    }, [projectId]);



    const recentActivities = [
        { id: 1, type: "srs", title: "SRS Document Updated", time: "2 hours ago", user: "John Doe" },
        { id: 2, type: "wireframe", title: "Dashboard Wireframe Created", time: "5 hours ago", user: "Jane Smith" },
        { id: 3, type: "diagram", title: "Sequence Diagram Generated", time: "1 day ago", user: "Mike Johnson" },
        { id: 4, type: "conversation", title: "AI Conversation: User Flow", time: "2 days ago", user: "Sarah Williams" },
    ];

    const quickStats = [
        { label: "Documents", value: "12", icon: FileText, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/20" },
        { label: "Wireframes", value: "8", icon: Layout, color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-900/20" },
        { label: "Diagrams", value: "15", icon: BarChart3, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/20" },
        { label: "AI Chats", value: "23", icon: MessageSquare, color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-900/20" },
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "srs": return <FileText className="w-4 h-4" />;
            case "wireframe": return <Layout className="w-4 h-4" />;
            case "diagram": return <BarChart3 className="w-4 h-4" />;
            case "conversation": return <MessageSquare className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const onNavigate = (section: string) => {
        router.push(`/dashboard/project/${projectId}/${section}`);
    };

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
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{project.name}</h1>
                                <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                                    {project.status}
                                </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
                        </div>
                        <Button variant="outline" className="ml-4">Edit Project</Button>
                    </div>

                    {/* Progress Bar */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <span className="font-medium text-gray-900 dark:text-gray-100">Overall Progress</span>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-3" />
                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>{project.completedTasks} of {project.totalTasks} tasks completed</span>
                                    <span>{project.totalTasks - project.completedTasks} remaining</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Project Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{project.createdDate}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Updated At</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{project.dueDate}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{project.teamMembers} Members</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{project.progress}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {quickStats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                                            </div>
                                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                                <Icon className={`w-8 h-8 ${stat.color}`} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mt-1">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{activity.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.user}</p>
                                                    <span className="text-gray-400 dark:text-gray-600">•</span>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full mt-4">View All Activity</Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-3"
                                        onClick={() => onNavigate("aiconversations")}
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Start AI Conversation
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-3"
                                        onClick={() => onNavigate("srsgenerator")}
                                    >
                                        <FileText className="w-4 h-4" />
                                        Generate SRS
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-3"
                                        onClick={() => onNavigate("wireframegenerator")}
                                    >
                                        <Layout className="w-4 h-4" />
                                        Create Wireframe
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-3"
                                        onClick={() => onNavigate("diagrams")}
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        Design Diagram
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tasks Overview */}
                        <Card className="mt-6">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Tasks Overview</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Completed</span>
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">{project.completedTasks}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">In Progress</span>
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">8</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Pending</span>
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">5</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}