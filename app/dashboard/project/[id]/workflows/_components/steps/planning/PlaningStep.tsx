'use client';

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import PromptWithFileSelection from "../../PromptWithFileSelection";
import PreviewModal from "../../PreviewModal";
import { planningDocuments, getAllDocIds, documentFiles } from "./documents";
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
    const params = useParams();
    const projectId = params?.id as string;

    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    // Custom hooks for state management
    const documentSelection = useDocumentSelection(getAllDocIds());
    const documentPreview = useDocumentPreview(planningDocuments, documentFiles);
    const planningGeneration = useWorkflowGeneration(onGenerate);

    // Get selected document names for the loading dialog
    const selectedDocumentNames = useMemo(() => {
        const names: string[] = [];
        planningDocuments.forEach(doc => {
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
        console.log("=== PLANNING STEP - GENERATE DOCUMENTS ===");
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
            description: prompt || "Generate planning documents for the project",
            documents: documents
        };

        console.log("WebSocket Payload:", JSON.stringify(payload, null, 2));
        console.log("Step Name: planning");
        console.log("WebSocket URL will be:", `ws://localhost:8010/api/v1/ws/projects/${projectId}/planning?token=JWT_TOKEN`);
        console.log("==========================================");

        // Call WebSocket generation
        await planningGeneration.generateDocuments(payload, projectId, 'planning');
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
                isAllSelected={documentSelection.isAllSelected(planningDocuments)}
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
            {generatedDiagrams.length > 0 && documentSelection.selectedDocs.length > 0 && (
                <GeneratedDocumentsList
                    documents={planningDocuments}
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
                    type="document"
                    title={documentPreview.getPreviewTitle(documentPreview.previewDocument)}
                    content={documentPreview.previewContent}
                />
            )}

            {/* Generation Loading Dialog */}
            <GenerationLoadingDialog
                isOpen={planningGeneration.isGenerating}
                documentNames={selectedDocumentNames}
            />

            {/* Action Buttons */}
            <WorkflowActions
                hasGeneratedDocuments={generatedDiagrams.length > 0}
                isGenerating={planningGeneration.isGenerating}
                onGenerate={handleGenerateDocuments}
                onNext={onNext}
                onBack={onBack}
                nextButtonText="Continue to Analysis"
                hasSelectedDocuments={documentSelection.selectedDocs.length > 0}
            />
        </div>
    );
}
