'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, FileText, CheckCircle2, Sparkles, Eye } from "lucide-react";
import PromptWithFileSelection from "../PromptWithFileSelection";
import { SRSIcon } from "@/components/icons";
import PreviewModal from "../PreviewModal";

interface AnalysisDocument {
    id: string;
    name: string;
    description: string;
}

const analysisDocuments: AnalysisDocument[] = [
    {
        id: "feasibility-study",
        name: "Feasibility Study Report",
        description: "Comprehensive analysis of technical, operational, and economic feasibility"
    },
    {
        id: "cost-benefit-analysis",
        name: "Cost-Benefit Analysis Document",
        description: "Detailed financial analysis comparing project costs against expected benefits"
    },
    {
        id: "risk-register",
        name: "Risk Register Document",
        description: "Identification and assessment of potential project risks and mitigation strategies"
    },
    {
        id: "compliance",
        name: "Compliance Document",
        description: "Legal, regulatory, and standards compliance requirements and verification"
    }
];

interface AnalysisStepProps {
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
}: AnalysisStepProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const allDocIds = analysisDocuments.flatMap(doc =>
        [doc.id]
    );
    const [selectedAnalysisDocs, setSelectedAnalysisDocs] = useState<string[]>(allDocIds);
    const [previewSRS, setPreviewSRS] = useState(false);
    const [previewDocument, setPreviewDocument] = useState<string | null>(null);

    const handleGenerateSRS = () => {
        console.log("Sending prompt:", prompt);
        console.log("Selected files:", selectedFiles);
        onGenerate();
    };

    const handleViewSRS = () => {
        setPreviewSRS(true);
    };

    const handleClosePreview = () => {
        setPreviewSRS(false);
        setPreviewDocument(null);
    };

    const handleDocumentToggle = (docId: string) => {
        setSelectedAnalysisDocs(prev =>
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
                    Analysis Step
                </h2>
            </div>

            {/* Document Selection Section */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Select Documents to Generate
                </label>
                <div className="space-y-2">
                    {analysisDocuments.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                        >
                            <Checkbox
                                id={doc.id}
                                checked={selectedAnalysisDocs.includes(doc.id)}
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
                placeholder="Enter prompt to generate document at analysis step..."
                label="Prompt & Reference Files (Optional)"
            />

            {/* Generated Analysis Documents Section */}
            {generatedSRS && selectedAnalysisDocs.length > 0 && (
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
                                {selectedAnalysisDocs.length} document(s) created
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {analysisDocuments.map((doc) => {
                            // Only show if document is selected
                            if (!selectedAnalysisDocs.includes(doc.id)) return null;

                            return (
                                <div
                                    key={doc.id}
                                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {doc.name}
                                        </p>
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
                                        View
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Preview Modals */}
            <PreviewModal
                isOpen={previewSRS}
                onClose={handleClosePreview}
                type="srs"
                title="SRS Document Preview"
            />

            {previewDocument && (
                <PreviewModal
                    isOpen={!!previewDocument}
                    onClose={handleClosePreview}
                    type="srs"
                    title={analysisDocuments.find(doc => doc.id === previewDocument)?.name || ""}
                />
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
                        Continue to Design
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
