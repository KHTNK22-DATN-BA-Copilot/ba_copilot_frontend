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
import { Trash2 } from "lucide-react";

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
        try {
            const res = await fetch("/api/me", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                // Account deleted successfully, redirect to login
                alert("Account deleted successfully");
                window.location.href = "/login";
            } else {
                const result = await res.json();
                throw new Error(result.message || "Failed to delete account");
            }
        } catch (error) {
            console.error("Failed to delete account:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to delete account. Please try again.";
            alert(errorMessage);
        } finally {
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
        <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <Button
                    className="absolute bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
                    onClick={() => setIsOpen(true)}
                >
                    Delete Personal Account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Delete Account
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Are you sure you want to delete the account linked to{" "}
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                            {userEmail}
                        </span>
                        ?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="py-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="confirm-delete"
                            checked={isChecked}
                            onCheckedChange={(checked: boolean) => setIsChecked(checked)}
                        />
                        <label
                            htmlFor="confirm-delete"
                            className="text-sm text-gray-700 dark:text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            I understand that I won't be able to recover my account.
                        </label>
                    </div>
                </div>

                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel
                        onClick={() => setIsOpen(false)}
                        className="flex-1"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={!isChecked || isDeleting}
                        className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}