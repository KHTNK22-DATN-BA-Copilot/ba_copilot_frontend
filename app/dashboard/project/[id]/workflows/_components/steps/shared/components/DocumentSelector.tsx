import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, ChevronDown, ChevronRight, Lock } from "lucide-react";
import { ConstrainedDocument } from "../types";

interface DocumentSelectorProps {
    documents: ConstrainedDocument[];
    expandedItems: string[];
    onToggle: (docId: string) => void;
    onToggleParent: (parentId: string) => void;
    onToggleExpand: (docId: string) => void;
    onPreview: (docId: string) => void;
    label?: string;
    onSelectAll?: () => void;
    onDeselectAll?: () => void;
    isAllSelected?: boolean;
}

/**
 * Compute indeterminate state for a parent document:
 * true when some (but not all) enabled sub-items are checked.
 */
function isIndeterminate(doc: ConstrainedDocument): boolean {
    if (!doc.subItems) return false;
    const enabled = doc.subItems.filter((s) => !s.isDisabled);
    if (enabled.length === 0) return false;
    const checkedCount = enabled.filter((s) => s.isChecked).length;
    return checkedCount > 0 && checkedCount < enabled.length;
}

export function DocumentSelector({
    documents,
    expandedItems,
    onToggle,
    onToggleParent,
    onToggleExpand,
    onPreview,
    label = "Select Documents to Generate",
    onSelectAll,
    onDeselectAll,
    isAllSelected,
}: DocumentSelectorProps) {
    const handleSelectAllToggle = () => {
        if (isAllSelected) {
            onDeselectAll?.();
        } else {
            onSelectAll?.();
        }
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {label}
                    </label>
                    {onSelectAll && onDeselectAll && (
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="select-all"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                                {isAllSelected ? "Deselect All" : "Select All"}
                            </label>
                            <Checkbox
                                id="select-all"
                                checked={isAllSelected || false}
                                onCheckedChange={handleSelectAllToggle}
                                className="flex-shrink-0"
                            />
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    {documents.map((doc) => (
                        <div key={doc.id} className="space-y-2">
                            {/* Main Document Row */}
                            <div
                                className={`flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border rounded-lg transition-colors ${
                                    doc.isDisabled
                                        ? "border-gray-200 dark:border-gray-700 opacity-60"
                                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {doc.subItems && (
                                        <button
                                            onClick={() =>
                                                onToggleExpand(doc.id)
                                            }
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                            aria-label={
                                                expandedItems.includes(doc.id)
                                                    ? "Collapse"
                                                    : "Expand"
                                            }
                                        >
                                            {expandedItems.includes(doc.id) ? (
                                                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            )}
                                        </button>
                                    )}

                                    {doc.isDisabled && doc.disabledReason ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="inline-flex">
                                                    <Checkbox
                                                        id={doc.id}
                                                        checked={doc.isChecked}
                                                        onCheckedChange={() =>
                                                            doc.subItems
                                                                ? onToggleParent(
                                                                      doc.id,
                                                                  )
                                                                : onToggle(
                                                                      doc.id,
                                                                  )
                                                        }
                                                        className="flex-shrink-0"
                                                        data-indeterminate={isIndeterminate(
                                                            doc,
                                                        )}
                                                        disabled
                                                    />
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="top"
                                                className="flex items-center gap-1.5 max-w-xs"
                                            >
                                                <Lock className="w-3 h-3 flex-shrink-0" />
                                                <span>
                                                    {doc.disabledReason}
                                                </span>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <Checkbox
                                            id={doc.id}
                                            checked={doc.isChecked}
                                            onCheckedChange={() =>
                                                doc.subItems
                                                    ? onToggleParent(doc.id)
                                                    : onToggle(doc.id)
                                            }
                                            className="flex-shrink-0"
                                            data-indeterminate={isIndeterminate(
                                                doc,
                                            )}
                                            disabled={doc.isDisabled}
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <label
                                        htmlFor={doc.id}
                                        className={`block font-medium cursor-pointer ${
                                            doc.isDisabled
                                                ? "text-gray-400 dark:text-gray-500"
                                                : "text-gray-900 dark:text-gray-100"
                                        }`}
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
                            {doc.subItems &&
                                expandedItems.includes(doc.id) && (
                                    <div className="ml-12 space-y-2">
                                        {doc.subItems.map((subItem) => (
                                            <div
                                                key={subItem.id}
                                                className={`flex items-center gap-4 p-3 border rounded-lg transition-colors ${
                                                    subItem.isDisabled
                                                        ? "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60"
                                                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                                                }`}
                                            >
                                                {subItem.isDisabled &&
                                                subItem.disabledReason ? (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="inline-flex">
                                                                <Checkbox
                                                                    id={
                                                                        subItem.id
                                                                    }
                                                                    checked={
                                                                        subItem.isChecked
                                                                    }
                                                                    onCheckedChange={() =>
                                                                        onToggle(
                                                                            subItem.id,
                                                                        )
                                                                    }
                                                                    className="flex-shrink-0"
                                                                    disabled
                                                                />
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent
                                                            side="top"
                                                            className="flex items-center gap-1.5 max-w-xs"
                                                        >
                                                            <Lock className="w-3 h-3 flex-shrink-0" />
                                                            <span>
                                                                {
                                                                    subItem.disabledReason
                                                                }
                                                            </span>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ) : (
                                                    <Checkbox
                                                        id={subItem.id}
                                                        checked={
                                                            subItem.isChecked
                                                        }
                                                        onCheckedChange={() =>
                                                            onToggle(
                                                                subItem.id,
                                                            )
                                                        }
                                                        className="flex-shrink-0"
                                                        disabled={
                                                            subItem.isDisabled
                                                        }
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <label
                                                        htmlFor={subItem.id}
                                                        className={`block text-sm font-medium cursor-pointer ${
                                                            subItem.isDisabled
                                                                ? "text-gray-400 dark:text-gray-500"
                                                                : "text-gray-900 dark:text-gray-100"
                                                        }`}
                                                    >
                                                        {subItem.name}
                                                    </label>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-2 flex-shrink-0 text-xs"
                                                    onClick={() =>
                                                        onPreview(subItem.id)
                                                    }
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
        </TooltipProvider>
    );
}
