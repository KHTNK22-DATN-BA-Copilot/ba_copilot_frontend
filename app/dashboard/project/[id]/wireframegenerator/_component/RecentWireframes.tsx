"use client";

import { Button } from "@/components/ui/button";
import { Layout, Download, Eye } from "lucide-react";

export default function RecentWireframes() {
    const recentWireframes = [
        {
            id: 1,
            name: "Dashboard Layout",
            type: "Desktop",
            pages: 3,
            date: "1 day ago",
        },
        {
            id: 2,
            name: "Mobile App Screens",
            type: "Mobile",
            pages: 8,
            date: "3 days ago",
        },
        {
            id: 3,
            name: "Landing Page",
            type: "Desktop",
            pages: 1,
            date: "1 week ago",
        },
    ];

    return (
        <div className="col-span-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                <div className="space-y-4">
                    {recentWireframes.map((wireframe) => (
                        <div
                            key={wireframe.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Layout className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {wireframe.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {wireframe.type} •{" "}
                                        {wireframe.pages}{" "}
                                        {wireframe.pages === 1
                                            ? "page"
                                            : "pages"}{" "}
                                        • {wireframe.date}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="flex-1 sm:flex-none"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="flex-1 sm:flex-none"
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
