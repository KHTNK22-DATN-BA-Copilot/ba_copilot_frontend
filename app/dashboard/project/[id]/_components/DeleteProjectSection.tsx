'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteProjectSectionProps {
    projectId: string;
    projectName: string;
}

export default function DeleteProjectSection({ projectId, projectName }: DeleteProjectSectionProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }

            // Redirect to dashboard after successful deletion
            router.push('/dashboard');
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project. Please try again.');
            setIsDeleting(false);
            setIsOpen(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-900/50 shadow-sm">
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-red-200 dark:border-red-900/50">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    Danger Zone
                </h2>
            </div>

            {/* Content */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Delete Project Row */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
                    <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                            Delete this project
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Once you delete a project, there is no going back. Please be certain.
                        </p>
                    </div>

                    {/* Delete Button with Confirmation Dialog */}
                    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="default"
                                className="gap-2 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300 shrink-0 w-full sm:w-auto"
                            >
                                Delete this project
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-lg w-[calc(100%-2rem)] mx-auto bg-gray-900 border-gray-800">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-start gap-3 text-red-500 dark:text-red-400 text-base sm:text-xl font-semibold">
                                    <AlertTriangle className="w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0 mt-0.5" />
                                    <span>Are you absolutely sure?</span>
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-left space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300 dark:text-gray-300 pt-2">
                                    <p className="text-gray-200 dark:text-gray-200">
                                        This action cannot be undone. This will permanently delete the project{' '}
                                        <span className="font-semibold text-white break-words">
                                            &quot;{projectName}&quot;
                                        </span>
                                        .
                                    </p>
                                    <p className="text-red-400 dark:text-red-400 font-semibold">
                                        All associated data including:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 sm:space-y-1.5 pl-1 text-gray-300 dark:text-gray-300">
                                        <li>SRS documents</li>
                                        <li>Wireframes and diagrams</li>
                                        <li>AI conversations</li>
                                        <li>Project settings and history</li>
                                    </ul>
                                    <p className="font-medium text-gray-200 dark:text-gray-200">will be permanently removed from our servers.</p>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2 pt-2 sm:pt-4">
                                <AlertDialogCancel
                                    disabled={isDeleting}
                                    className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white border-gray-600 order-2 sm:order-1"
                                >
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-600/50 font-medium order-1 sm:order-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <svg
                                                className="animate-spin h-4 w-4 mr-2"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete this project
                                        </>
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
}
