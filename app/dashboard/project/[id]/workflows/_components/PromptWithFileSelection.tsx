'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PromptWithFileSelectionProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    selectedFiles: string[];
    onSelectedFilesChange: (files: string[]) => void;
    placeholder?: string;
    label?: string;
}

export default function PromptWithFileSelection({
    prompt,
    onPromptChange,
    selectedFiles,
    onSelectedFilesChange,
    placeholder = "Describe what you want to generate...",
    label = "Generation Prompt & Reference Files (Optional)"
}: PromptWithFileSelectionProps) {
    const [isFileDropdownOpen, setIsFileDropdownOpen] = useState(false);

    // Mock files - replace with actual files from project
    const projectFiles = [
        { id: "1", name: "requirements.pdf" },
        { id: "2", name: "user-stories.docx" },
        { id: "3", name: "project-brief.txt" },
        { id: "4", name: "specifications.md" },
    ];

    const handleFileToggle = (fileId: string) => {
        const newSelectedFiles = selectedFiles.includes(fileId)
            ? selectedFiles.filter(id => id !== fileId)
            : [...selectedFiles, fileId];
        onSelectedFilesChange(newSelectedFiles);
    };

    const handleRemoveFile = (fileId: string) => {
        onSelectedFilesChange(selectedFiles.filter(id => id !== fileId));
    };

    const getSelectedFileNames = () => {
        return projectFiles
            .filter(file => selectedFiles.includes(file.id))
            .map(file => file.name);
    };

    return (
        <div className="space-y-4">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {label}
            </label>

            <div className="flex gap-4">
                {/* Prompt Section - 3/4 width */}
                <div className="w-3/4 space-y-3">
                    <Textarea
                        placeholder={placeholder}
                        value={prompt}
                        onChange={(e) => onPromptChange(e.target.value)}
                        className="min-h-[150px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    />
                </div>

                {/* File Selection Section - 1/4 width */}
                <div className="w-1/4 space-y-3">
                    <div className="space-y-3">
                        {/* Selected Files Display */}
                        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 max-h-[100px] min-h-[100px] overflow-y-auto">
                            {selectedFiles.length > 0 ? (
                                getSelectedFileNames().map((fileName, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="flex items-center gap-1 px-2 py-1 text-xs h-fit"
                                    >
                                        <FileText className="w-3 h-3" />
                                        <span className="truncate max-w-[80px]">{fileName}</span>
                                        <button
                                            onClick={() => handleRemoveFile(selectedFiles[index])}
                                            className="ml-1 hover:text-red-600 dark:hover:text-red-400"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-xs text-gray-400 dark:text-gray-500">
                                    No files selected
                                </div>
                            )}
                        </div>

                        {/* File Selection Dropdown */}
                        <div className="relative">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsFileDropdownOpen(!isFileDropdownOpen)}
                                className="w-full justify-between bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-xs"
                            >
                                <span className="text-gray-600 dark:text-gray-400 truncate">
                                    {selectedFiles.length > 0
                                        ? `${selectedFiles.length} file(s)`
                                        : "Select files"}
                                </span>
                                <svg
                                    className={`w-4 h-4 transition-transform flex-shrink-0 ${isFileDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Button>

                            {isFileDropdownOpen && (
                                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <div className="p-2 space-y-1">
                                        {projectFiles.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                                                onClick={() => handleFileToggle(file.id)}
                                            >
                                                <Checkbox
                                                    checked={selectedFiles.includes(file.id)}
                                                    onCheckedChange={() => handleFileToggle(file.id)}
                                                />
                                                <FileText className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                                <span className="text-xs text-gray-900 dark:text-gray-100 truncate">
                                                    {file.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
