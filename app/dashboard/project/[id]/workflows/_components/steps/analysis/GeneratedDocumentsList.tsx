import { Button } from "@/components/ui/button";
import { CheckCircle2, Eye } from "lucide-react";
import { AnalysisDocument } from "./types";

interface GeneratedDocumentsListProps {
    documents: AnalysisDocument[];
    selectedDocs: string[];
    onPreview: (docId: string) => void;
}

export function GeneratedDocumentsList({
    documents,
    selectedDocs,
    onPreview,
}: GeneratedDocumentsListProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Generated Documents
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        {selectedDocs.length} document(s) created
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                {documents.map((doc) => {
                    // Only show if document is selected
                    if (!selectedDocs.includes(doc.id)) return null;

                    return (
                        <div
                            key={doc.id}
                            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {doc.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {doc.description}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 flex-shrink-0"
                                onClick={() => onPreview(doc.id)}
                            >
                                <Eye className="w-4 h-4" />
                                View
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
