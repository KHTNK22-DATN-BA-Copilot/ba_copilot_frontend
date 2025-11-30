'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { DiagramIcon } from "@/components/icons/project-icons";
import PromptWithFileSelection from "../PromptWithFileSelection";
import PreviewModal from "../PreviewModal";

interface DiagramsStepProps {
    generatedDiagrams: string[];
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
}

export default function DiagramsStep({
    generatedDiagrams,
    onGenerate,
    onNext,
    onBack
}: DiagramsStepProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [previewDiagram, setPreviewDiagram] = useState<string | null>(null);

    const handleGenerateDiagrams = () => {
        console.log("Sending prompt:", prompt);
        console.log("Selected files:", selectedFiles);
        onGenerate();
    };

    const handleViewDiagram = (diagram: string) => {
        setPreviewDiagram(diagram);
    };

    const handleClosePreview = () => {
        setPreviewDiagram(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Generate Diagrams
                </h2>
            </div>

            <PromptWithFileSelection
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedFiles={selectedFiles}
                onSelectedFilesChange={setSelectedFiles}
                placeholder="Describe the diagrams you want to generate...

Example:
- Generate a use case diagram for user authentication
- Create a class diagram for the order management system
- Build an activity diagram for the checkout process"
                label="Diagram Generation Prompt & Reference Files (Optional)"
            />

            {/* Generated Diagrams Section */}
            {generatedDiagrams.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 ">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                                <DiagramIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    Generated Diagrams
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {generatedDiagrams.length} diagram(s) created
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {generatedDiagrams.map((diagram, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-2 p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm text-gray-900 dark:text-gray-100">{diagram}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => handleViewDiagram(diagram)}
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
                isOpen={!!previewDiagram}
                onClose={handleClosePreview}
                type="diagram"
                title={previewDiagram || ""}
            />

            <div className="flex justify-center items-center gap-3">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                {generatedDiagrams.length === 0 ? (
                    <Button onClick={handleGenerateDiagrams} className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate Diagrams
                    </Button>
                ) : (
                    <Button onClick={onNext} className="gap-2">
                        Continue to SRS
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
