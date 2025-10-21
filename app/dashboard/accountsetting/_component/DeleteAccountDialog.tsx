"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteUserAccount } from "./utils";

interface DeleteAccountDialogProps {
    userEmail: string;
}

export default function DeleteAccountDialog({ userEmail }: DeleteAccountDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!isChecked) return;

        setIsDeleting(true);

        const result = await deleteUserAccount();

        if (result.success) {
            alert("Account deleted successfully");
            window.location.href = "/login";
        } else {
            alert(result.message || "Failed to delete account. Please try again.");
            setIsDeleting(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setIsChecked(false);
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
                {/* Delete Account Row */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
                    <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                            Delete this account
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                    </div>

                    {/* Delete Button with Confirmation Dialog */}
                    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="default"
                                className="gap-2 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300 shrink-0 w-full sm:w-auto"
                            >
                                Delete this account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] mx-4">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 text-base sm:text-lg">
                                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-left space-y-2 text-xs sm:text-sm">
                                    <p>
                                        This action cannot be undone. This will permanently delete the account{' '}
                                        <span className="font-semibold text-gray-900 dark:text-white break-all">
                                            {userEmail}
                                        </span>
                                        .
                                    </p>
                                    <p className="text-red-600 dark:text-red-400 font-medium">
                                        All associated data including:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 pl-2">
                                        <li>All projects and documents</li>
                                        <li>SRS documents and wireframes</li>
                                        <li>AI conversations history</li>
                                        <li>Account settings and preferences</li>
                                    </ul>
                                    <p className="font-medium">will be permanently removed from our servers.</p>
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <div className="py-3 sm:py-4">
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="confirm-delete"
                                        checked={isChecked}
                                        onCheckedChange={(checked: boolean) => setIsChecked(checked)}
                                        className="mt-0.5"
                                    />
                                    <label
                                        htmlFor="confirm-delete"
                                        className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        I understand that I won't be able to recover my account.
                                    </label>
                                </div>
                            </div>

                            <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                                <AlertDialogCancel disabled={isDeleting} className="w-full sm:w-auto">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={!isChecked || isDeleting}
                                    className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-600/50 w-full sm:w-auto"
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
                                            Delete this account
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