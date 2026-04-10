'use client';

import { Textarea } from "@/components/ui/textarea";

interface PromptWithFileSelectionProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

export default function PromptWithFileSelection({
    prompt,
    onPromptChange,
    placeholder = "Describe what you want to generate...",
    label = "Generation Prompt & Reference Files (Optional)"
}: PromptWithFileSelectionProps) {

    return (
        <div className="space-y-4">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {label}
            </label>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* Prompt Section - 3/4 width */}
                <div className="w-full">
                    <Textarea
                        placeholder={placeholder}
                        value={prompt}
                        onChange={(e) => onPromptChange(e.target.value)}
                        className="min-h-[140px] sm:min-h-[150px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    />
                </div>
            </div>
        </div>
    );
}
