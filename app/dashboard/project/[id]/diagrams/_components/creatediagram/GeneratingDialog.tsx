"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface GeneratingDialogProps {
    open: boolean;
    progress?: number;
}

export function GeneratingDialog({ open, progress = 0 }: GeneratingDialogProps) {
    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-md" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
                        Generating Diagram
                    </DialogTitle>
                    <DialogDescription>
                        Please wait while we generate your diagram. This may take a few moments...
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Progress Bar */}
                    {progress > 0 ? (
                        <div className="space-y-2">
                            <Progress value={progress} className="w-full" />
                            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                                {progress}% Complete
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Animated Spinner */}
                            <div className="flex justify-center">
                                <div className="relative w-16 h-16">
                                    <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </div>
                            {/* Status Messages */}
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Processing your request
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Analyzing input and generating diagram...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
