'use client';

import { useState } from "react";
import PromptWithFileSelection from "../../PromptWithFileSelection";
import PreviewModal from "../../PreviewModal";
import { planningDocuments } from "./documents";
import { DocumentSelector, GeneratedDocumentsList, PlanningActions } from ".";
import { useDocumentSelection, useDocumentPreview, usePlanningGeneration } from "./hooks";

interface PlanningStepProps {
    generatedDiagrams: string[];
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
}

export default function PlanningStep({
    generatedDiagrams,
    onGenerate,
    onNext,
    onBack
}: PlanningStepProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    // Custom hooks for state management
    const documentSelection = useDocumentSelection();
    const documentPreview = useDocumentPreview();
    const planningGeneration = usePlanningGeneration(onGenerate);

    const handleGenerateDocuments = async () => {
        const payload = {
            prompt,
            selectedFiles,
            selectedDocIds: documentSelection.selectedPlanningDocs,
        };

        await planningGeneration.generateDocuments(payload);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Planning Step
                </h2>
            </div>

            {/* Document Selection Section */}
            <DocumentSelector
                documents={planningDocuments}
                selectedDocs={documentSelection.selectedPlanningDocs}
                expandedItems={documentSelection.expandedItems}
                onDocumentToggle={documentSelection.handleDocumentToggle}
                onToggleExpand={documentSelection.handleToggleExpand}
                onParentToggle={documentSelection.handleParentToggle}
                onPreview={documentPreview.handlePreviewDocument}
                isDocumentSelected={documentSelection.isDocumentSelected}
                isDocumentIndeterminate={documentSelection.isDocumentIndeterminate}
            />

            {/* Prompt and File Selection */}
            <PromptWithFileSelection
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedFiles={selectedFiles}
                onSelectedFilesChange={setSelectedFiles}
                placeholder=""
                label="Prompt & Reference Files for Planning Step (Optional)"
            />

            {/* Error Message */}
            {planningGeneration.error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {planningGeneration.error}
                    </p>
                </div>
            )}

            {/* Generated Documents List */}
            {generatedDiagrams.length > 0 && documentSelection.selectedPlanningDocs.length > 0 && (
                <GeneratedDocumentsList
                    documents={planningDocuments}
                    selectedDocs={documentSelection.selectedPlanningDocs}
                    onPreview={documentPreview.handlePreviewDocument}
                    getSelectedSubItems={documentSelection.getSelectedSubItems}
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
            <PlanningActions
                hasGeneratedDocuments={generatedDiagrams.length > 0}
                isGenerating={planningGeneration.isGenerating}
                onGenerate={handleGenerateDocuments}
                onNext={onNext}
                onBack={onBack}
            />
        </div>
    );
}
