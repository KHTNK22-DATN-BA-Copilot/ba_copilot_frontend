"use client";

import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { redirect } from "next/navigation";
import { FcDocument } from "react-icons/fc";

export default function RecentDocument({id}: {id: string}) {

    const getDocument = () => {
        redirect(`/dashboard/project/${id}/srsgenerator?tabs=recent-documents&doc=1`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sm:p-6 lg:p-8 mb-8 transition-colors duration-300 space-y-4">
            <div
                className="flex hover:shadow-md flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm gap-4 sm:gap-0 cursor-pointer"
                onClick={getDocument}
            >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FcDocument className="text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                            E-Commerce Platform SRS
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span>v2.1</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="px-2 py-1 bg-black text-white rounded-full text-xs">
                                Complete
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>2 days ago</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button
                        className="p-2 h-8 w-8 sm:h-10 sm:w-10"
                        variant="outline"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        className="p-2 h-8 w-8 sm:h-10 sm:w-10"
                        variant="ghost"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
