'use client';

import { useState, useMemo, useEffect, useCallback } from "react";
import PromptWithFileSelection from "../../_components/PromptWithFileSelection";
import { analysisDocuments, documentFiles } from "./documents";
import {
    DocumentSelector,
    FetchedDocumentsList,
    WorkflowActions,
    GenerationLoadingDialog,
    useDocumentPreview,
    useWorkflowGeneration,
    GenerateWorkflowPayload,
    DocumentListItem,
    getAnalysisDocuments,
    fetchAllDocument,
} from "../shared";
import { useDocumentConstraints } from "../shared/hooks/useDocumentConstraints";
import useSWR from "swr";
import PreviewModal from "../shared/components/PreviewModal";

interface AnalysisStepProps {
    generatedSRS: string;
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
    projectName?: string
}

export default function AnalysisStep({
    generatedSRS,
    onGenerate,
    onNext,
    onBack,
    projectName
}: AnalysisStepProps) {
    const projectId = localStorage.getItem("projectId") as string;

    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [previewFetchedDoc, setPreviewFetchedDoc] = useState<DocumentListItem | null>(null);

    const documentPreview = useDocumentPreview(analysisDocuments, documentFiles);

    const fetchAnalysisDocuments = useCallback(async ([pId, step]: [string, string]) => {
        console.log(`[SWR] Fetching for Project: ${pId}`);
        const response = await getAnalysisDocuments(pId);

        if (response.status === "success" && response.documents) {
            return response.documents;
        }
        throw new Error(response.message || "Failed to fetch documents");
    }, []);

    const {
        data: existingDocIds = [],
    } = useSWR(
        projectId,
        fetchAllDocument,
        {
            revalidateOnFocus: false,
        }
    )


    const {
        data: fetchedDocuments = [], // Default là mảng rỗng nếu chưa có data
        isValidating: isFetchingDocs, // Tương đương loading state
        mutate: refreshDocs // Hàm để ép gọi lại API bằng tay
    } = useSWR(
        projectId ? [projectId, 'analysis'] : null,
        fetchAnalysisDocuments,
        {
            revalidateOnFocus: false, // Tắt cái này đi để không bị gọi lại API mỗi khi chuyển tab trình duyệt
            dedupingInterval: 5000,   // Tránh spam API trong vòng 5 giây
        }
    );

    // Constraint-aware document selection
    const constraints = useDocumentConstraints({
        documents: analysisDocuments,
        existingDocIds,
    });


    // Workflow generation with callback to fetch documents after completion
    const analysisGeneration = useWorkflowGeneration(
        onGenerate,
        () => {
            console.info("Fetch thanh cong")
            refreshDocs()
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
        const documents = constraints.checkedDocIds.map(docId => ({
            type: docId
        }));

        const payload: GenerateWorkflowPayload = {
            description: prompt,
            project_name: projectName || "Test Project",
            documents: documents
        };

        await analysisGeneration.generateDocuments(payload, projectId, 'analysis');
    };

    const handlePreviewFetchedDocument = useCallback((doc: DocumentListItem) => {
        setPreviewFetchedDoc(doc);
    }, []);

    const handleRefreshDocs = useCallback(() => {
        refreshDocs();
    }, [refreshDocs]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Analysis Step
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
                    stepName="analysis"
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
                isOpen={analysisGeneration.isGenerating}
                documents={selectedDocumentsForDialog}
                statuses={analysisGeneration.documentStatuses}
                onCancel={analysisGeneration.cancelGeneration}
            />

            {/* Action Buttons */}
            <WorkflowActions
                hasGeneratedDocuments={fetchedDocuments.length > 0 || !!generatedSRS}
                isGenerating={analysisGeneration.isGenerating}
                onGenerate={handleGenerateDocuments}
                onNext={onNext}
                onBack={onBack}
                generateButtonText="Generate Documents"
                nextButtonText="Continue to Design"
                hasSelectedDocuments={constraints.checkedDocIds.length > 0}
            />
        </div>
    );
}
