'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Layout, CheckCircle2, Sparkles } from "lucide-react";
import PromptWithFileSelection from "../PromptWithFileSelection";
import { WireframeIcon } from "@/components/icons";
import PreviewModal from "../PreviewModal";

interface WireframesStepProps {
    generatedWireframes: string[];
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
}

export default function WireframesStep({
    generatedWireframes,
    onGenerate,
    onNext,
    onBack
}: WireframesStepProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [previewWireframe, setPreviewWireframe] = useState<string | null>(null);

    const handleGenerateWireframes = () => {
        console.log("Sending prompt:", prompt);
        console.log("Selected files:", selectedFiles);
        onGenerate();
    };

    const handleViewWireframe = (wireframe: string) => {
        setPreviewWireframe(wireframe);
    };

    const handleClosePreview = () => {
        setPreviewWireframe(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Create Wireframes
                </h2>
            </div>

            <PromptWithFileSelection
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedFiles={selectedFiles}
                onSelectedFilesChange={setSelectedFiles}
                placeholder="Describe the wireframes you want to generate...

Example:
- Create wireframes for user login and registration flows
- Design dashboard layout with navigation and key components
- Generate mobile-responsive wireframes for main screens"
                label="Wireframe Generation Prompt & Reference Files (Optional)"
            />

            {/* Generated Wireframes Section */}
            {generatedWireframes.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                                <WireframeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    Generated Wireframes
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {generatedWireframes.length} wireframe(s) created
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {generatedWireframes.map((wireframe, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-2 p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm text-gray-900 dark:text-gray-100">{wireframe}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => handleViewWireframe(wireframe)}
                                    >
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <PreviewModal
                isOpen={!!previewWireframe}
                onClose={handleClosePreview}
                type="wireframe"
                title={`${previewWireframe || ""} - Preview`}
            />

            <div className="flex justify-center items-center gap-3">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                {generatedWireframes.length === 0 ? (
                    <Button onClick={handleGenerateWireframes} className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate Wireframes
                    </Button>
                ) : (
                    <Button onClick={onNext} className="gap-2">
                        Continue to Review
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
