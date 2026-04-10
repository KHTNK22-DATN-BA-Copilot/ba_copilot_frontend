'use client';

import { useState, useMemo, useCallback } from "react";
import PromptWithFileSelection from "../../_components/PromptWithFileSelection";
import { designDocuments, documentFiles } from "./documents";
import {
    DocumentSelector,
    FetchedDocumentsList,
    WorkflowActions,
    GenerationLoadingDialog,
    useDocumentPreview,
    useWorkflowGeneration,
    GenerateWorkflowPayload,
    getDesignDocuments,
    fetchAllDocument,
} from "../shared";
import { useDocumentConstraints } from "../shared/hooks/useDocumentConstraints";
import useSWR from "swr";
import PreviewModal from "../shared/components/PreviewModal";

interface DesignStepProps {
    generatedWireframes: string[];
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
    projectName?: string
}

export default function DesignStep({
    generatedWireframes,
    onGenerate,
    onNext,
    onBack,
    projectName
}: DesignStepProps) {
    const projectId = localStorage.getItem("projectId") as string

    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    const {
        data: existingDocIds = [],
    } = useSWR(
        projectId,
        fetchAllDocument,
        {
            revalidateOnFocus: false,
        }
    )


    // Constraint-aware document selection
    const constraints = useDocumentConstraints({
        documents: designDocuments,
        existingDocIds,
    });
    const documentPreview = useDocumentPreview(designDocuments, documentFiles);

    const fetchDesignDocument = async ([projectId, step]: [string, string]) => {
        const response = await getDesignDocuments(projectId);
        if (response.documents) {
            return response.documents;
        }
        else {
            return []
        }
    }

    const {
        data: fetchedDocuments = [],
        isLoading: isFetchingDocs,
        mutate: refreshDoc
    } = useSWR(
        [projectId, 'design'],
        fetchDesignDocument,
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000
        }
    )


    // Workflow generation with callback to fetch documents after completion
    const designGeneration = useWorkflowGeneration(
        onGenerate,
        () => {
            refreshDoc()
        }
    );

    // Get selected document names for the loading dialog
    const selectedDocumentsForDialog = useMemo(() => {
        const items: { id: string; name: string }[] = [];
        for (const doc of constraints.constrainedDocuments) {
            if (doc.subItems) {
                for (const sub of doc.subItems) {
                    if (sub.isChecked) items.push({ id: sub.id, name: sub.name });
                }
            } else if (doc.isChecked) {
                items.push({ id: doc.id, name: doc.name });
            }
        }
        return items;
    }, [constraints.constrainedDocuments]);

    const handleGenerateDocuments = async () => {
        console.log("=== DESIGN STEP - GENERATE DOCUMENTS ===");
        console.log("Project ID:", projectId);
        console.log("Selected Document IDs:", constraints.checkedDocIds);
        console.log("Prompt:", prompt);

        const documents = constraints.checkedDocIds.map(docId => ({
            type: docId
        }));

        const payload: GenerateWorkflowPayload = {
            project_name: projectName || "Test Project",
            description: prompt,
            documents: documents
        };

        console.log("WebSocket Payload:", JSON.stringify(payload, null, 2));
        console.log("Step Name: design");
        console.log("==========================================");

        await designGeneration.generateDocuments(payload, projectId, 'design');
    };

    const handleRefreshDoc = useCallback(() => {
        refreshDoc()
    }, [refreshDoc])

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Design Step
                </h2>
            </div>

            {/* Document Selection with Constraints */}
            <DocumentSelector
                documents={constraints.constrainedDocuments}
                expandedItems={constraints.expandedItems}
                onToggle={constraints.toggleDocument}
                onToggleParent={constraints.toggleParent}
                onToggleExpand={constraints.toggleExpand}
                onPreview={documentPreview.handlePreviewDocument}
                label="Select type of Documents to Generate"
                onSelectAll={constraints.selectAll}
                onDeselectAll={constraints.deselectAll}
                isAllSelected={constraints.isAllSelected}
            />

            {/* Prompt and File Selection */}
            <PromptWithFileSelection
                prompt={prompt}
                onPromptChange={setPrompt}
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

            {/* Generated Documents List - Fetched from API */}
            {isFetchingDocs ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                        Loading generated documents...
                    </p>
                </div>
            ) : (
                <FetchedDocumentsList
                    documents={fetchedDocuments}
                    stepName="design"
                    projectId={projectId}
                    onRegenerateSuccess={handleRefreshDoc}
                />
            )}

            {/* Preview Modal for Template Documents */}
            {documentPreview.previewDocument && (
                <PreviewModal
                    isOpen={!!documentPreview.previewDocument}
                    onClose={documentPreview.handleClosePreview}
                    type="document"
                    title={documentPreview.getPreviewTitle(
                        documentPreview.previewDocument,
                    )}
                    content={documentPreview.previewContent}
                />
            )}

            {/* Generation Loading Dialog */}
            <GenerationLoadingDialog
                isOpen={designGeneration.isGenerating}
                documents={selectedDocumentsForDialog}
                statuses={designGeneration.documentStatuses}
                onCancel={designGeneration.cancelGeneration}
            />

            {/* Action Buttons */}
            <WorkflowActions
                hasGeneratedDocuments={fetchedDocuments.length > 0 || generatedWireframes.length > 0}
                isGenerating={designGeneration.isGenerating}
                onGenerate={handleGenerateDocuments}
                onNext={onNext}
                onBack={onBack}
                nextButtonText="Continue to Review"
                hasSelectedDocuments={constraints.checkedDocIds.length > 0}
            />
        </div>
    );
}
