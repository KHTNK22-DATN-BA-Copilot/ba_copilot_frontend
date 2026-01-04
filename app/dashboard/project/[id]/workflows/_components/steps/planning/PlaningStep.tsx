'use client';

import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import PromptWithFileSelection from "../../PromptWithFileSelection";
import PreviewModal from "../../PreviewModal";
import { planningDocuments, getAllDocIds, documentFiles } from "./documents";
import {
    DocumentSelector,
    GeneratedDocumentsList,
    FetchedDocumentsList,
    WorkflowActions,
    GenerationLoadingDialog,
    useDocumentSelection,
    useDocumentPreview,
    useWorkflowGeneration,
    GenerateWorkflowPayload,
    DocumentListItem,
    getPlanningDocuments
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
    const [fetchedDocuments, setFetchedDocuments] = useState<DocumentListItem[]>([]);
    const [isFetchingDocs, setIsFetchingDocs] = useState(false);
    const [previewFetchedDoc, setPreviewFetchedDoc] = useState<DocumentListItem | null>(null);

    // Custom hooks for state management
    const documentSelection = useDocumentSelection(getAllDocIds());
    const documentPreview = useDocumentPreview(planningDocuments, documentFiles);

    // Fetch documents list function
    const fetchDocumentsList = useCallback(async () => {
        if (!projectId) return;

        console.log("[PlanningStep] Fetching documents list for project:", projectId);
        setIsFetchingDocs(true);

        try {
            const response = await getPlanningDocuments(projectId);

            if (response.status === "success" && response.documents) {
                console.log("[PlanningStep] Documents fetched successfully:", response.documents);
                setFetchedDocuments(response.documents);
            } else {
                console.error("[PlanningStep] Error fetching documents:", response.message);
            }
        } catch (error) {
            console.error("[PlanningStep] Error fetching documents:", error);
        } finally {
            setIsFetchingDocs(false);
        }
    }, [projectId]);

    // Fetch documents on component mount
    useEffect(() => {
        fetchDocumentsList();
    }, [fetchDocumentsList]);

    // Workflow generation with callback to fetch documents after completion
    const planningGeneration = useWorkflowGeneration(
        onGenerate,
        fetchDocumentsList // This will be called after generation completes
    );

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

    // Handle preview of fetched documents
    const handlePreviewFetchedDocument = useCallback((doc: DocumentListItem) => {
        console.log("[PlanningStep] Preview fetched document:", doc);
        setPreviewFetchedDoc(doc);
    }, []);

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
                />
            )}

            {/* Preview Modal for Template Documents */}
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
                isOpen={planningGeneration.isGenerating}
                documentNames={selectedDocumentNames}
            />

            {/* Action Buttons */}
            <WorkflowActions
                hasGeneratedDocuments={fetchedDocuments.length > 0}
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
