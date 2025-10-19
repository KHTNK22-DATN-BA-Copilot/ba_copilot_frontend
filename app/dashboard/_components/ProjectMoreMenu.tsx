import { MoreVertical, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
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
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <AlertDialogTitle className="text-left">
                                Delete Project
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-left pt-2">
                            Are you sure you want to delete {projectName ? `"${projectName}"` : 'this project'}?
                            The project will be moved to trash and will no longer appear in your active projects list.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={(e) => e.stopPropagation()}
                            disabled={isDeleting}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmDelete();
                            }}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}