import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
    projectId: string | string[] | undefined;
}

export function PageHeader({ projectId }: PageHeaderProps) {
    return (
        <div className="col-span-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2.5 gap-4">
                <div className="flex items-center space-x-3">
                    <Link
                        href={`/dashboard/project/${projectId}`}
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 xl:hidden"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Diagrams
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Create visual diagrams for your projects
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
