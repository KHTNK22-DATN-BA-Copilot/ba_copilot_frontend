'use client';

import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import PromptWithFileSelection from "../../PromptWithFileSelection";
import PreviewModal from "../../PreviewModal";
import { designDocuments, documentFiles } from "./documents";
import {
    DocumentSelector,
    FetchedDocumentsList,
    WorkflowActions,
    GenerationLoadingDialog,
    useDocumentPreview,
    useWorkflowGeneration,
    GenerateWorkflowPayload,
    DocumentListItem,
    getDesignDocuments,
    getPlanningDocuments,
    getAnalysisDocuments
} from "../shared";
import { useDocumentConstraints } from "../shared/hooks/useDocumentConstraints";

interface DesignStepProps {
    generatedWireframes: string[];
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
    projectName?: string;
}

export default function DesignStep({
    generatedWireframes,
    onGenerate,
    onNext,
    onBack,
    projectName
}: DesignStepProps) {
    const params = useParams();
    const projectId = params?.id as string;

    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [fetchedDocuments, setFetchedDocuments] = useState<DocumentListItem[]>([]);
    const [isFetchingDocs, setIsFetchingDocs] = useState(false);

    // Track documents already generated in previous steps (for cross-step constraints)
    const [existingDocIds, setExistingDocIds] = useState<string[]>([]);

    // Constraint-aware document selection
    const constraints = useDocumentConstraints({
        documents: designDocuments,
        existingDocIds,
    });
    const documentPreview = useDocumentPreview(designDocuments, documentFiles);

    // Fetch existing documents from Planning + Analysis steps (cross-step prerequisites)
    const fetchExistingDocs = useCallback(async () => {
        if (!projectId) return;
        try {
            const [planningResp, analysisResp] = await Promise.all([
                getPlanningDocuments(projectId),
                getAnalysisDocuments(projectId),
            ]);
            const ids: string[] = [];
            if (planningResp.status === "success" && planningResp.documents) {
                ids.push(...planningResp.documents.map((d) => d.doc_type || d.design_type));
            }
            if (analysisResp.status === "success" && analysisResp.documents) {
                ids.push(...analysisResp.documents.map((d) => d.doc_type || d.design_type));
            }
            setExistingDocIds(ids);
        } catch (error) {
            console.error("[DesignStep] Error fetching existing docs:", error);
        }
    }, [projectId]);

    const fetchDocumentsList = useCallback(async () => {
        if (!projectId) return;

        setIsFetchingDocs(true);
        try {
            const response = await getDesignDocuments(projectId);
            if (response.status === "success" && response.documents) {
                setFetchedDocuments(response.documents);
            } else {
                console.error("[DesignStep] Error fetching documents:", response.message);
            }
        } catch (error) {
            console.error("[DesignStep] Error fetching documents:", error);
        } finally {
            setIsFetchingDocs(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchExistingDocs();
        fetchDocumentsList();
    }, [fetchExistingDocs, fetchDocumentsList]);

    // Workflow generation with callback to fetch documents after completion
    const designGeneration = useWorkflowGeneration(
        onGenerate,
        fetchDocumentsList
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
            description: prompt || "Generate design documents for the project",
            documents: documents
        };

        console.log("WebSocket Payload:", JSON.stringify(payload, null, 2));
        console.log("Step Name: design");
        console.log("==========================================");

        await designGeneration.generateDocuments(payload, projectId, 'design');
    };

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
                    onRegenerateSuccess={fetchDocumentsList}
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
