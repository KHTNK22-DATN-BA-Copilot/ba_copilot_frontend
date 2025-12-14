import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, FileText, CheckCircle2 } from "lucide-react";

interface GenerationLoadingDialogProps {
    isOpen: boolean;
    documentNames: string[];
}

export function GenerationLoadingDialog({
    isOpen,
    documentNames,
}: GenerationLoadingDialogProps) {
    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-md" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        Generating Documents
                    </DialogTitle>
                    <DialogDescription>
                        Please wait while we generate your documents. This may take a moment.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Progress Indicator */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                Processing...
                            </span>
                        </div>
                        <Progress value={undefined} className="h-2" />
                    </div>

                    {/* Document List */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Documents being generated:
                        </p>
                        <div className="max-h-48 overflow-y-auto space-y-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            {documentNames.map((name, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                                >
                                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <span className="flex-1">{name}</span>
                                    <Loader2 className="w-3 h-3 animate-spin text-gray-400 flex-shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Message */}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            This dialog will close automatically when the generation is complete.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
