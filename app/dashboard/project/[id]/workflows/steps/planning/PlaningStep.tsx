"use client";

import { useState, useMemo, useCallback, memo } from "react";
import PromptWithFileSelection from "../../_components/PromptWithFileSelection";
import { planningDocuments, documentFiles } from "./documents";
import {
    DocumentSelector,
    FetchedDocumentsList,
    WorkflowActions,
    GenerationLoadingDialog,
    useDocumentPreview,
    useWorkflowGeneration,
    GenerateWorkflowPayload,
    DocumentListItem,
    fetchAllDocument,
    getPlanningDocuments,
} from "../shared";
import { useDocumentConstraints } from "../shared/hooks/useDocumentConstraints";
import useSWR from "swr";
import PreviewModal from "../shared/components/PreviewModal";

interface PlanningStepProps {
    generatedDiagrams: string[];
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
    projectName?: string;
}

function PlanningStep({
    onGenerate,
    onNext,
    onBack,
    projectName,
}: PlanningStepProps) {
    const projectId = localStorage.getItem("projectId") as string;

    const [prompt, setPrompt] = useState("");
    const hasPrompt = prompt.trim().length > 0;
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [previewFetchedDoc, setPreviewFetchedDoc] =
        useState<DocumentListItem | null>(null);
    
    const {
        data: existingDocIds = [],
    } = useSWR(
        projectId,
        fetchAllDocument,
        {
            revalidateOnFocus: false,
        }
    )

    const fetchDocuments = async ([pId, step]: [string, string, string]) => {
        console.log(`[SWR] Fetching for Project: ${pId}, Step: ${step}`);
        const response = await getPlanningDocuments(pId);
        console.log(`[SWR] Response for Project: ${pId}, Step: ${step}`, response);

        if (response.status === "success" && response.documents) {
            return response.documents;
        }
        throw new Error(response.message || "Failed to fetch documents");
    }

    const {
        data: fetchedDocuments = [], // Default là mảng rỗng nếu chưa có data
        isLoading: isFetchingDocs, // Tương đương loading state
        mutate: refreshDocs // Hàm để ép gọi lại API bằng tay
    } = useSWR(
        projectId ? [projectId, 'planning'] : null,
        fetchDocuments,
        {
            revalidateOnFocus: false,
        }
    );


    // Constraint-aware document selection (Planning is first step — no external deps)
    const constraints = useDocumentConstraints({
        documents: planningDocuments,
        existingDocIds: existingDocIds,
    });
    const documentPreview = useDocumentPreview(
        planningDocuments,
        documentFiles,
    );


    // Workflow generation with callback to fetch documents after completion
    const { generateDocuments, error, isGenerating, cancelGeneration, documentStatuses } = useWorkflowGeneration(
        onGenerate,
        () => {
            refreshDocs()
        }
    );

    // Get selected document names for the loading dialog
    const selectedDocumentsForDialog = useMemo(() => {
        const items: { id: string; name: string }[] = [];
        for (const doc of constraints.constrainedDocuments) {
            if (doc.subItems) {
                for (const sub of doc.subItems) {
                    if (sub.isChecked)
                        items.push({ id: sub.id, name: sub.name });
                }
            } else if (doc.isChecked) {
                items.push({ id: doc.id, name: doc.name });
            }
        }
        return items;
    }, [constraints.constrainedDocuments]);


    const handleRefreshDocs = useCallback(() => {
        refreshDocs();
    }, [refreshDocs]);

    const checkedIdsString = constraints.checkedDocIds.join(',');

    const handleGenerateDocuments = useCallback( async () => {
        const currentCheckedIds = checkedIdsString ? checkedIdsString.split(',') : [];

        console.log("=== PLANNING STEP - GENERATE DOCUMENTS ===");
        console.log("Project ID:", projectId);
        console.log("Selected Document IDs:", currentCheckedIds);
        console.log("Prompt:", prompt);

        const documents = currentCheckedIds.map((docId) => ({
            type: docId,
        }));

        const payload: GenerateWorkflowPayload = {
            project_name: projectName || "Test Project",
            description: prompt,
            documents: documents,
        };

        console.log("WebSocket Payload:", JSON.stringify(payload, null, 2));
        console.log("Step Name: planning");
        console.log("==========================================");

        await generateDocuments(
            payload,
            projectId,
            "planning",
        );
    }, [projectId, checkedIdsString, prompt, projectName, generateDocuments])

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Planning Step
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
                placeholder=""
                label="Prompt & Reference Files for Planning Step (Optional)"
            />

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {error}
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
                    stepName="planning"
                    projectId={projectId}
                    onRegenerateSuccess={handleRefreshDocs}
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
                isOpen={isGenerating}
                documents={selectedDocumentsForDialog}
                statuses={documentStatuses}
                onCancel={cancelGeneration}
            />

            {/* Action Buttons */}
            <WorkflowActions
                hasGeneratedDocuments={fetchedDocuments.length > 0}
                isGenerating={isGenerating}
                onGenerate={handleGenerateDocuments}
                onNext={onNext}
                onBack={onBack}
                nextButtonText="Continue to Analysis"
                hasSelectedDocuments={constraints.checkedDocIds.length > 0}
                hasPrompt={hasPrompt}
            />
        </div>
    );
}

export default memo(PlanningStep)
