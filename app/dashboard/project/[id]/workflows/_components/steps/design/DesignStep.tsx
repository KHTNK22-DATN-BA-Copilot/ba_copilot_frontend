'use client';

import { useState } from "react";
import PromptWithFileSelection from "../../PromptWithFileSelection";
import PreviewModal from "../../PreviewModal";
import { designDocuments, getAllDocIds, documentFiles } from "./documents";
import {
    DocumentSelector,
    GeneratedDocumentsList,
    WorkflowActions,
    useDocumentSelection,
    useDocumentPreview,
    useWorkflowGeneration
} from "../shared";

interface DesignStepProps {
    generatedWireframes: string[];
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
}

export default function DesignStep({
    generatedWireframes,
    onGenerate,
    onNext,
    onBack
}: DesignStepProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    // Custom hooks for state management
    const documentSelection = useDocumentSelection(getAllDocIds());
    const documentPreview = useDocumentPreview(designDocuments, documentFiles);
    const designGeneration = useWorkflowGeneration(onGenerate);

    const handleGenerateDocuments = async () => {
        const payload = {
            prompt,
            selectedFiles,
            selectedDocIds: documentSelection.selectedDocs,
            stepType: 'design'
        };

        await designGeneration.generateDocuments(payload);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Design Step
                </h2>
            </div>

            {/* Document Selection Section */}
            <DocumentSelector
                documents={designDocuments}
                selectedDocs={documentSelection.selectedDocs}
                expandedItems={documentSelection.expandedItems}
                onDocumentToggle={documentSelection.handleDocumentToggle}
                onToggleExpand={documentSelection.handleToggleExpand}
                onParentToggle={documentSelection.handleParentToggle}
                onPreview={documentPreview.handlePreviewDocument}
                isDocumentSelected={documentSelection.isDocumentSelected}
                isDocumentIndeterminate={documentSelection.isDocumentIndeterminate}
                label="Select type of Documents to Generate"
                onSelectAll={documentSelection.handleSelectAll}
                onDeselectAll={documentSelection.handleDeselectAll}
                isAllSelected={documentSelection.isAllSelected(designDocuments)}
            />

            {/* Prompt and File Selection */}
            <PromptWithFileSelection
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedFiles={selectedFiles}
                onSelectedFilesChange={setSelectedFiles}
                placeholder="Enter prompt supporting AI to generate some documents related to Design step..."
                label="Prompt & Reference Files (Optional)"
            />

            {/* Error Message */}
            {designGeneration.error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {designGeneration.error}
                    </p>
                </div>
            )}

            {/* Generated Documents List */}
            {generatedWireframes.length > 0 && documentSelection.selectedDocs.length > 0 && (
                <GeneratedDocumentsList
                    documents={designDocuments}
                    selectedDocs={documentSelection.selectedDocs}
                    onPreview={documentPreview.handlePreviewDocument}
                    getSelectedSubItems={documentSelection.getSelectedSubItems}
                />
            )}

            {/* Preview Modal */}
            {documentPreview.previewDocument && (
                <PreviewModal
                    isOpen={!!documentPreview.previewDocument}
                    onClose={documentPreview.handleClosePreview}
                    type="wireframe"
                    title={documentPreview.getPreviewTitle(documentPreview.previewDocument)}
                    content={documentPreview.previewContent}
                />
            )}

            {/* Action Buttons */}
            <WorkflowActions
                hasGeneratedDocuments={generatedWireframes.length > 0}
                isGenerating={designGeneration.isGenerating}
                onGenerate={handleGenerateDocuments}
                onNext={onNext}
                onBack={onBack}
                nextButtonText="Continue to Review"
            />
        </div>
    );
}
