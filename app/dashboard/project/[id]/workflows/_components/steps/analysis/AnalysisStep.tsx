'use client';

import { useState } from "react";
import PromptWithFileSelection from "../../PromptWithFileSelection";
import PreviewModal from "../../PreviewModal";
import { analysisDocuments } from "./documents";
import { DocumentSelector, GeneratedDocumentsList, AnalysisActions } from ".";
import { useDocumentSelection, useDocumentPreview, useAnalysisGeneration } from "./hooks";

interface AnalysisStepProps {
    generatedSRS: string;
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
}

export default function AnalysisStep({
    generatedSRS,
    onGenerate,
    onNext,
    onBack
}: AnalysisStepProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    // Custom hooks for state management
    const documentSelection = useDocumentSelection();
    const documentPreview = useDocumentPreview();
    const analysisGeneration = useAnalysisGeneration(onGenerate);

    const handleGenerateDocuments = async () => {
        const payload = {
            prompt,
            selectedFiles,
            selectedDocIds: documentSelection.selectedAnalysisDocs,
        };

        await analysisGeneration.generateDocuments(payload);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Analysis Step
                </h2>
            </div>

            {/* Document Selection Section */}
            <DocumentSelector
                documents={analysisDocuments}
                selectedDocs={documentSelection.selectedAnalysisDocs}
                onDocumentToggle={documentSelection.handleDocumentToggle}
                onPreview={documentPreview.handlePreviewDocument}
            />

            {/* Prompt and File Selection */}
            <PromptWithFileSelection
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedFiles={selectedFiles}
                onSelectedFilesChange={setSelectedFiles}
                placeholder="Enter prompt to generate document at analysis step..."
                label="Prompt & Reference Files (Optional)"
            />

            {/* Error Message */}
            {analysisGeneration.error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {analysisGeneration.error}
                    </p>
                </div>
            )}

            {/* Generated Documents List */}
            {generatedSRS && documentSelection.selectedAnalysisDocs.length > 0 && (
                <GeneratedDocumentsList
                    documents={analysisDocuments}
                    selectedDocs={documentSelection.selectedAnalysisDocs}
                    onPreview={documentPreview.handlePreviewDocument}
                />
            )}

            {/* Preview Modal */}
            {documentPreview.previewDocument && (
                <PreviewModal
                    isOpen={!!documentPreview.previewDocument}
                    onClose={documentPreview.handleClosePreview}
                    type="srs"
                    title={documentPreview.getPreviewTitle(documentPreview.previewDocument)}
                    content={documentPreview.previewContent}
                />
            )}

            {/* Action Buttons */}
            <AnalysisActions
                hasGeneratedDocuments={!!generatedSRS}
                isGenerating={analysisGeneration.isGenerating}
                onGenerate={handleGenerateDocuments}
                onNext={onNext}
                onBack={onBack}
            />
        </div>
    );
}
