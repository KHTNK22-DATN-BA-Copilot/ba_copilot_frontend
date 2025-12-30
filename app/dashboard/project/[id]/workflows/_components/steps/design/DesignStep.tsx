'use client';

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import PromptWithFileSelection from "../../PromptWithFileSelection";
import PreviewModal from "../../PreviewModal";
import { designDocuments, getAllDocIds, documentFiles } from "./documents";
import {
    DocumentSelector,
    GeneratedDocumentsList,
    WorkflowActions,
    GenerationLoadingDialog,
    useDocumentSelection,
    useDocumentPreview,
    useWorkflowGeneration,
    GenerateWorkflowPayload
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
    const params = useParams();
    const projectId = params?.id as string;

    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    // Custom hooks for state management
    const documentSelection = useDocumentSelection(getAllDocIds());
    const documentPreview = useDocumentPreview(designDocuments, documentFiles);
    const designGeneration = useWorkflowGeneration(onGenerate);

    // Get selected document names for the loading dialog
    const selectedDocumentNames = useMemo(() => {
        const names: string[] = [];
        designDocuments.forEach(doc => {
            if (doc.subItems) {
                doc.subItems.forEach(subItem => {
                    if (documentSelection.selectedDocs.includes(subItem.id)) {
                        names.push(subItem.name);
                    }
                });
            } else if (documentSelection.selectedDocs.includes(doc.id)) {
                names.push(doc.name);
            }
        });
        return names;
    }, [documentSelection.selectedDocs]);

    const handleGenerateDocuments = async () => {
        console.log("=== DESIGN STEP - GENERATE DOCUMENTS ===");
        console.log("Project ID:", projectId);
        console.log("Selected Document IDs:", documentSelection.selectedDocs);
        console.log("Prompt:", prompt);
        console.log("Selected Files:", selectedFiles);

        // Transform selected document IDs to the required format
        const documents = documentSelection.selectedDocs.map(docId => ({
            type: docId
        }));

        // Create payload according to WebSocket API specification
        const payload: GenerateWorkflowPayload = {
            project_name: "Test Project", // TODO: Get from project context/state
            description: prompt || "Generate design documents for the project",
            documents: documents
        };

        console.log("WebSocket Payload:", JSON.stringify(payload, null, 2));
        console.log("Step Name: design");
        console.log("WebSocket URL will be:", `ws://localhost:8010/api/v1/ws/projects/${projectId}/design?token=JWT_TOKEN`);
        console.log("==========================================");

        // Call WebSocket generation
        await designGeneration.generateDocuments(payload, projectId, 'design');
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

            {/* Generation Loading Dialog */}
            <GenerationLoadingDialog
                isOpen={designGeneration.isGenerating}
                documentNames={selectedDocumentNames}
            />

            {/* Action Buttons */}
            <WorkflowActions
                hasGeneratedDocuments={generatedWireframes.length > 0}
                isGenerating={designGeneration.isGenerating}
                onGenerate={handleGenerateDocuments}
                onNext={onNext}
                onBack={onBack}
                nextButtonText="Continue to Review"
                hasSelectedDocuments={documentSelection.selectedDocs.length > 0}
            />
        </div>
    );
}
