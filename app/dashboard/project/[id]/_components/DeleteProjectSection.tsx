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
            <div className="px-6 py-4 border-b border-red-200 dark:border-red-900/50">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Danger Zone
                </h2>
            </div>

            {/* Content */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Delete Project Row */}
                <div className="px-6 py-5 flex items-center justify-between gap-6">
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                            Delete this project
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Once you delete a project, there is no going back. Please be certain.
                        </p>
                    </div>

                    {/* Delete Button with Confirmation Dialog */}
                    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="default"
                                className="gap-2 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300 shrink-0"
                            >
                                Delete this project
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <AlertTriangle className="w-5 h-5" />
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-left space-y-2">
                                    <p>
                                        This action cannot be undone. This will permanently delete the project{' '}
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            &quot;{projectName}&quot;
                                        </span>
                                        .
                                    </p>
                                    <p className="text-red-600 dark:text-red-400 font-medium">
                                        All associated data including:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 pl-2">
                                        <li>SRS documents</li>
                                        <li>Wireframes and diagrams</li>
                                        <li>AI conversations</li>
                                        <li>Project settings and history</li>
                                    </ul>
                                    <p className="font-medium">will be permanently removed from our servers.</p>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-600/50"
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
