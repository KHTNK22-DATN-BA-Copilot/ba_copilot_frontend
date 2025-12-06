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
