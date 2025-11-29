'use client';

interface WorkflowsMainProps {
    projectId: string;
}

export default function WorkflowsMain({ projectId }: WorkflowsMainProps) {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Project Workflows
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    All-in-one flow for managing your project workflow
                </p>
            </div>

            {/* Placeholder Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                        <svg
                            className="w-8 h-8 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Workflows Feature
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        This feature is under development. Implementation coming soon.
                    </p>
                </div>
            </div>
        </div>
    );
}
