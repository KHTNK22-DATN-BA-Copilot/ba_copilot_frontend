'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, FileText, CheckCircle2, Sparkles } from "lucide-react";
import PromptWithFileSelection from "../PromptWithFileSelection";
import { SRSIcon } from "@/components/icons";

interface SRSStepProps {
    generatedSRS: string;
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
}

export default function SRSStep({
    generatedSRS,
    onGenerate,
    onNext,
    onBack
}: SRSStepProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    const handleGenerateSRS = () => {
        console.log("Sending prompt:", prompt);
        console.log("Selected files:", selectedFiles);
        onGenerate();
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Generate SRS Document
                </h2>
            </div>

            <PromptWithFileSelection
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedFiles={selectedFiles}
                onSelectedFilesChange={setSelectedFiles}
                placeholder="Describe the SRS document you want to generate...

Example:
- Generate a complete SRS for an e-commerce platform
- Create functional requirements for user authentication module
- Document non-functional requirements for performance and security"
                label="SRS Generation Prompt & Reference Files (Optional)"
            />

            {/* Generated SRS Section */}
            {generatedSRS && (
                <div className="bg-gray-50 dark:bg-gray-800">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                                <SRSIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    Generated SRS Document
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Document created successfully
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{generatedSRS}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2">
                                    View
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-center items-center gap-3">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                {!generatedSRS ? (
                    <Button onClick={handleGenerateSRS} className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate SRS Document
                    </Button>
                ) : (
                    <Button onClick={onNext} className="gap-2">
                        Continue to Wireframes
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
