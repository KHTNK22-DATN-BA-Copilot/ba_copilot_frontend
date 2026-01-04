import { Button } from "@/components/ui/button";
import { CheckCircle2, Eye, FileText } from "lucide-react";
import { DocumentListItem } from "../types";

interface FetchedDocumentsListProps {
    documents: DocumentListItem[];
    onPreview?: (doc: DocumentListItem) => void;
}

export function FetchedDocumentsList({
    documents,
    onPreview,
}: FetchedDocumentsListProps) {
    if (!documents || documents.length === 0) {
        return null;
    }

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
                        {documents.length} document(s) created
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                {documents.map((doc) => (
                    <div
                        key={doc.document_id}
                        className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded flex-shrink-0">
                            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {doc.design_type}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        Project: {doc.project_name}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${doc.status === "completed"
                                                ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                                : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                                            }`}
                                    >
                                        {doc.status}
                                    </span>
                                </div>
                            </div>

                            {doc.content && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                    {doc.content.substring(0, 150)}
                                    {doc.content.length > 150 ? "..." : ""}
                                </p>
                            )}

                            <div className="flex items-center justify-between mt-3">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Updated: {new Date(doc.updated_at).toLocaleString()}
                                </p>

                                {onPreview && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => onPreview(doc)}
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
