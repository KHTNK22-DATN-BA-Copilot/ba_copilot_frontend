import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye } from "lucide-react";
import { AnalysisDocument } from "./types";

interface DocumentSelectorProps {
    documents: AnalysisDocument[];
    selectedDocs: string[];
    onDocumentToggle: (docId: string) => void;
    onPreview: (docId: string) => void;
}

export function DocumentSelector({
    documents,
    selectedDocs,
    onDocumentToggle,
    onPreview,
}: DocumentSelectorProps) {
    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Select Documents to Generate
            </label>
            <div className="space-y-2">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                        <Checkbox
                            id={doc.id}
                            checked={selectedDocs.includes(doc.id)}
                            onCheckedChange={() => onDocumentToggle(doc.id)}
                            className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <label
                                htmlFor={doc.id}
                                className="block font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                            >
                                {doc.name}
                            </label>
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
                            Preview
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
