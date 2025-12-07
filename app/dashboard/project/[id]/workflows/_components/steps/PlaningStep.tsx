'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Eye } from "lucide-react";
import { DiagramIcon } from "@/components/icons/project-icons";
import PromptWithFileSelection from "../PromptWithFileSelection";
import PreviewModal from "../PreviewModal";

interface DiagramsStepProps {
    generatedDiagrams: string[];
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
}

interface PlanningDocument {
    id: string;
    name: string;
    description: string;
}

const planningDocuments: PlanningDocument[] = [
    {
        id: "project-charter",
        name: "Project Charter Document",
        description: "Core project initiation documents including objectives, scope, and stakeholders"
    },
    {
        id: "business-case",
        name: "Business Case Document",
        description: "Justification for the project with cost-benefit analysis and strategic alignment"
    },
    {
        id: "scope-statement",
        name: "Scope Statement Document",
        description: "Detailed project scope, deliverables, and boundaries definition"
    },
    {
        id: "product-roadmap",
        name: "Product Roadmap Document",
        description: "High-level timeline and milestones for project delivery phases"
    }
];

export default function DiagramsStep({
    generatedDiagrams,
    onGenerate,
    onNext,
    onBack
}: DiagramsStepProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [selectedPlanningDocs, setSelectedPlanningDocs] = useState<string[]>([]);
    const [previewDiagram, setPreviewDiagram] = useState<string | null>(null);
    const [previewDocument, setPreviewDocument] = useState<string | null>(null);

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
        setPreviewDocument(null);
    };

    const handleDocumentToggle = (docId: string) => {
        setSelectedPlanningDocs(prev =>
            prev.includes(docId)
                ? prev.filter(id => id !== docId)
                : [...prev, docId]
        );
    };

    const handlePreviewDocument = (docId: string) => {
        setPreviewDocument(docId);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Planning Step
                </h2>
            </div>

            {/* Document Selection Section */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Select type of Documents to Generate
                </label>
                <div className="space-y-2">
                    {planningDocuments.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                        >
                            <Checkbox
                                id={doc.id}
                                checked={selectedPlanningDocs.includes(doc.id)}
                                onCheckedChange={() => handleDocumentToggle(doc.id)}
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
                                onClick={() => handlePreviewDocument(doc.id)}
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <PromptWithFileSelection
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedFiles={selectedFiles}
                onSelectedFilesChange={setSelectedFiles}
                placeholder="
                "
                label="Prompt & Reference Files for Planning Step (Optional)"
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
                                    Generated
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

            {/* Preview Modals */}
            <PreviewModal
                isOpen={!!previewDiagram}
                onClose={handleClosePreview}
                type="diagram"
                title={previewDiagram || ""}
            />

            {previewDocument && (
                <PreviewModal
                    isOpen={!!previewDocument}
                    onClose={handleClosePreview}
                    type="diagram"
                    title={planningDocuments.find(doc => doc.id === previewDocument)?.name || ""}
                />
            )}

            <div className="flex justify-center items-center gap-3">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                {generatedDiagrams.length === 0 ? (
                    <Button onClick={handleGenerateDiagrams} className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate
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
