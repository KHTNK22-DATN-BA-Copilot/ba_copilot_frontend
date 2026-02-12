'use client';

import { useState, useMemo, useEffect, useCallback } from "react";
import PromptWithFileSelection from "../../PromptWithFileSelection";
import PreviewModal from "../../PreviewModal";
import { analysisDocuments, getAllDocIds, documentFiles } from "./documents";
import {
    DocumentSelector,
    FetchedDocumentsList,
    WorkflowActions,
    GenerationLoadingDialog,
    useDocumentSelection,
    useDocumentPreview,
    useWorkflowGeneration,
    GenerateWorkflowPayload,
    DocumentListItem,
    getAnalysisDocuments
} from "../shared";
import { useParams } from "next/navigation";

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
    const params = useParams();
    const projectId = params?.id as string;

    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [fetchedDocuments, setFetchedDocuments] = useState<DocumentListItem[]>([]);
    const [isFetchingDocs, setIsFetchingDocs] = useState(false);
    const [previewFetchedDoc, setPreviewFetchedDoc] = useState<DocumentListItem | null>(null);

    // Custom hooks for state management
    const documentSelection = useDocumentSelection(getAllDocIds());
    const documentPreview = useDocumentPreview(analysisDocuments, documentFiles);

    const fetchDocumentsList = useCallback(async () => {
        if (!projectId) return;

        setIsFetchingDocs(true);
        try {
            const response = await getAnalysisDocuments(projectId);

            if (response.status === "success" && response.documents) {
                setFetchedDocuments(response.documents);
            } else {
                console.error("[AnalysisStep] Error fetching documents:", response.message);
            }
        } catch (error) {
            console.error("[AnalysisStep] Error fetching documents:", error);
        } finally {
            setIsFetchingDocs(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchDocumentsList();
    }, [fetchDocumentsList]);

    // Workflow generation with callback to fetch documents after completion
    const analysisGeneration = useWorkflowGeneration(
        onGenerate,
        fetchDocumentsList
    );

    // Get selected document names for the loading dialog
    const selectedDocumentsForDialog = useMemo(() => {
        const items: { id: string; name: string }[] = [];
        analysisDocuments.forEach(doc => {
            if (doc.subItems) {
                doc.subItems.forEach(subItem => {
                    if (documentSelection.selectedDocs.includes(subItem.id)) {
                        items.push({ id: subItem.id, name: subItem.name });
                    }
                });
            } else if (documentSelection.selectedDocs.includes(doc.id)) {
                items.push({ id: doc.id, name: doc.name });
            }
        });
        return items;
    }, [documentSelection.selectedDocs]);

    const handleGenerateDocuments = async () => {

        const documents = documentSelection.selectedDocs.map(docId => ({
            type: docId
        }));

        const payload: GenerateWorkflowPayload = {
            description: prompt || "Generate analysis documents.",
            project_name: "Test Project",
            documents: documents
        };

        await analysisGeneration.generateDocuments(payload, projectId, 'analysis');
    };

    const handlePreviewFetchedDocument = useCallback((doc: DocumentListItem) => {
        setPreviewFetchedDoc(doc);
    }, []);

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
                isAllSelected={documentSelection.isAllSelected(analysisDocuments)}
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
                    onPreview={handlePreviewFetchedDocument}
                    stepName="analysis"
                    projectId={projectId}
                    onRegenerateSuccess={fetchDocumentsList}
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

            {/* Preview Modal for Fetched Documents */}
            {previewFetchedDoc && (
                <PreviewModal
                    isOpen={!!previewFetchedDoc}
                    onClose={() => setPreviewFetchedDoc(null)}
                    type="document"
                    title={`${previewFetchedDoc.design_type} - ${previewFetchedDoc.project_name}`}
                    content={previewFetchedDoc.content || "No content available"}
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
                hasSelectedDocuments={documentSelection.selectedDocs.length > 0}
            />
        </div>
    );
}
