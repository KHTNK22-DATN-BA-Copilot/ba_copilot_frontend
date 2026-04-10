'use client';

import { useCallback, useEffect, useState } from "react";
import { Send, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FeedbackDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onFeedbackSubmit: () => void;
    title?: string;
    description?: string;
    buttonText?: string;
}

export default function FeedbackDialog({
    isOpen,
    onOpenChange,
    onFeedbackSubmit,
    title = "Feedback & Suggestions",
    description = "Help us improve by sharing your experience",
    buttonText = "Share Feedback"
}: FeedbackDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Send className="w-5 h-5 text-blue-500" />
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                            Your feedback helps us build better tools and improve the user experience for everyone.
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex gap-2 sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onFeedbackSubmit}
                        className="flex-1"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        {buttonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
