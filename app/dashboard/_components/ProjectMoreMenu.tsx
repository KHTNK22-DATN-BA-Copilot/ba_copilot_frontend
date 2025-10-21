import { MoreVertical, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProjectMoreMenuProps {
    projectId: number;
    projectName?: string;
    onDelete: (projectId: number) => void;
    isDeleting?: boolean;
}

export default function ProjectMoreMenu({ projectId, projectName, onDelete, isDeleting = false }: ProjectMoreMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleToggleMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    const handleDeleteClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsOpen(false);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        setShowDeleteDialog(false);
        onDelete(projectId);
    };

    const handleCancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteDialog(false);
    };

    const handleCloseMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsOpen(false);
    };

    return (
        <>
            <div className="relative">
                <button
                    onClick={handleToggleMenu}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                    aria-label="More options"
                >
                    <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>

                {isOpen && (
                    <>
                        {/* Backdrop to close menu when clicking outside */}
                        <div className="fixed inset-0 z-10" onClick={handleCloseMenu} />

                        {/* Dropdown menu */}
                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-20">
                            <ul className="py-1">
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                        onClick={handleDeleteClick}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Project
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) {
                        // Only allow closing when not deleting
                        setShowDeleteDialog(false);
                    }
                }}
            >
                <AlertDialogContent
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="sm:max-w-lg w-[calc(100%-2rem)] mx-auto bg-gray-900 border-gray-800"
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-start gap-3 text-red-500 dark:text-red-400 text-base sm:text-xl font-semibold">
                            <AlertTriangle className="w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0 mt-0.5" />
                            <span>Are you absolutely sure?</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300 dark:text-gray-300 pt-2">
                            <p className="text-gray-200 dark:text-gray-200">
                                This action cannot be undone. This will permanently delete the project{' '}
                                <span className="font-semibold text-white break-words">
                                    {projectName ? `"${projectName}"` : 'this project'}
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
                            onClick={handleCancelDelete}
                            disabled={isDeleting}
                            className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white border-gray-600 order-2 sm:order-1"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmDelete();
                            }}
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
        </>
    );
}