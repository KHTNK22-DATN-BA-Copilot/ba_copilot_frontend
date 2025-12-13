import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, ChevronDown, ChevronRight } from "lucide-react";
import { PlanningDocument } from "./types";

interface DocumentSelectorProps {
    documents: PlanningDocument[];
    selectedDocs: string[];
    expandedItems: string[];
    onDocumentToggle: (docId: string) => void;
    onToggleExpand: (docId: string) => void;
    onParentToggle: (doc: PlanningDocument) => void;
    onPreview: (docId: string) => void;
    isDocumentSelected: (doc: PlanningDocument) => boolean;
    isDocumentIndeterminate: (doc: PlanningDocument) => boolean;
}

export function DocumentSelector({
    documents,
    selectedDocs,
    expandedItems,
    onDocumentToggle,
    onToggleExpand,
    onParentToggle,
    onPreview,
    isDocumentSelected,
    isDocumentIndeterminate,
}: DocumentSelectorProps) {
    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Select type of Documents to Generate
            </label>
            <div className="space-y-2">
                {documents.map((doc) => (
                    <div key={doc.id} className="space-y-2">
                        {/* Main Document Row */}
                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                            <div className="flex items-center gap-2">
                                {doc.subItems && (
                                    <button
                                        onClick={() => onToggleExpand(doc.id)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                        aria-label={expandedItems.includes(doc.id) ? "Collapse" : "Expand"}
                                    >
                                        {expandedItems.includes(doc.id) ? (
                                            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        )}
                                    </button>
                                )}
                                <Checkbox
                                    id={doc.id}
                                    checked={isDocumentSelected(doc)}
                                    onCheckedChange={() => onParentToggle(doc)}
                                    className="flex-shrink-0"
                                    data-indeterminate={isDocumentIndeterminate(doc)}
                                />
                            </div>
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
                            {!doc.subItems && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 flex-shrink-0"
                                    onClick={() => onPreview(doc.id)}
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview
                                </Button>
                            )}
                        </div>

                        {/* Sub-items */}
                        {doc.subItems && expandedItems.includes(doc.id) && (
                            <div className="ml-12 space-y-2">
                                {doc.subItems.map((subItem) => (
                                    <div
                                        key={subItem.id}
                                        className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                                    >
                                        <Checkbox
                                            id={subItem.id}
                                            checked={selectedDocs.includes(subItem.id)}
                                            onCheckedChange={() => onDocumentToggle(subItem.id)}
                                            className="flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <label
                                                htmlFor={subItem.id}
                                                className="block text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                                            >
                                                {subItem.name}
                                            </label>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2 flex-shrink-0 text-xs"
                                            onClick={() => onPreview(subItem.id)}
                                        >
                                            <Eye className="w-3 h-3" />
                                            Preview
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
