import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

export default function RecentDocument() {
    return ( 
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 mb-8 transition-colors duration-300 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm gap-4 sm:gap-0">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clipRule="evenodd"
                            />
                        </svg>
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
                    <Button className="p-2 h-8 w-8 sm:h-10 sm:w-10" variant="outline">
                        <Eye className="h-4 w-4"/>
                    </Button>
                    <Button className="p-2 h-8 w-8 sm:h-10 sm:w-10" variant="ghost">
                        <Download className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
        </div>
    );
}
