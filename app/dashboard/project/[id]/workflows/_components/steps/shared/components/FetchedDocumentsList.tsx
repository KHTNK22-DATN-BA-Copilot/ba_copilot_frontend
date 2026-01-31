import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Eye, FileText, RefreshCw } from "lucide-react";
import { DocumentListItem } from "../types";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { regenerateDocument, exportDocument } from "../api";
import type { StepName } from "../types";
import { DocumentPreviewModal } from "./DocumentPreviewModal";

interface FetchedDocumentsListProps {
    documents: DocumentListItem[];
    stepName: StepName;
    projectId: string;
    onRegenerateSuccess?: () => void;
}

export function FetchedDocumentsList({
    documents,
    stepName,
    projectId,
    onRegenerateSuccess,
}: FetchedDocumentsListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<DocumentListItem | null>(null);
    const [regeneratingDocId, setRegeneratingDocId] = useState<string | null>(null);
    const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<DocumentListItem | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleRegenerateClick = (doc: DocumentListItem) => {
        setSelectedDoc(doc);
        setIsDialogOpen(true);
    };

    const handlePreview = (doc: DocumentListItem) => {
        setPreviewDoc(doc);
        setIsPreviewOpen(true);
    };

    const handleRegenerateFromModal = async (documentId: string) => {
        setRegeneratingDocId(documentId);

        toast.info(`Regenerating document...`, {
            duration: 2000,
        });

        try {
            const data = await regenerateDocument(
                stepName,
                projectId,
                documentId
            );

            if (data.status !== "error") {
                toast.success("Document regenerated successfully");
                onRegenerateSuccess?.();
            } else {
                throw new Error(data.message || "Failed to regenerate document");
            }
        } catch (error) {
            console.error("Error regenerating document:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to regenerate document";
            toast.error(errorMessage);
        } finally {
            setRegeneratingDocId(null);
        }
    };

    const handleDownload = async (doc: DocumentListItem) => {
        setDownloadingDocId(doc.document_id);
        try {
            await exportDocument(stepName, projectId, doc.document_id);
            toast.success(`Document "${doc.design_type}" downloaded successfully`);
        } catch (error) {
            console.error("Error downloading document:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to download document";
            toast.error(errorMessage);
        } finally {
            setDownloadingDocId(null);
        }
    };

    const handleRegenerateConfirm = async () => {
        if (!selectedDoc) return;

        setRegeneratingDocId(selectedDoc.document_id);
        setIsDialogOpen(false);

        // Show processing notification
        toast.info(`Regenerating "${selectedDoc.design_type}"...`, {
            duration: 2000,
        });

        try {
            const data = await regenerateDocument(
                stepName,
                projectId,
                selectedDoc.document_id
            );

            // Check if request was successful (not error status)
            if (data.status !== "error") {
                toast.success("Document regenerated successfully");
                onRegenerateSuccess?.();
            } else {
                throw new Error(data.message || "Failed to regenerate document");
            }
        } catch (error) {
            console.error("Error regenerating document:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to regenerate document";
            toast.error(errorMessage);
        } finally {
            setRegeneratingDocId(null);
            setSelectedDoc(null);
        }
    };

    if (!documents || documents.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Generated Documents
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        {documents.length} document(s) created
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                {documents.map((doc) => (
                    <div
                        key={doc.document_id}
                        className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded flex-shrink-0">
                            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {doc.design_type}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {doc.project_name}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${doc.status === "completed"
                                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                            : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                                            }`}
                                    >
                                        {doc.status}
                                    </span>
                                </div>
                            </div>

                            {doc.content && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                    {doc.content.substring(0, 150)}
                                    {doc.content.length > 150 ? "..." : ""}
                                </p>
                            )}

                            <div className="flex items-center justify-between mt-3">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Updated: {new Date(doc.updated_at).toLocaleString()}
                                </p>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDownload(doc)}
                                        disabled={downloadingDocId !== null || regeneratingDocId !== null}
                                        title="Download"
                                    >
                                        <Download className={`w-4 h-4 ${downloadingDocId === doc.document_id ? 'animate-pulse' : ''}`} />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => handleRegenerateClick(doc)}
                                        disabled={regeneratingDocId !== null || downloadingDocId !== null}
                                    >
                                        <RefreshCw className={`w-4 h-4 ${regeneratingDocId === doc.document_id ? 'animate-spin' : ''}`} />
                                        {regeneratingDocId === doc.document_id ? 'Regenerating...' : 'Regenerate'}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => handlePreview(doc)}
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <DocumentPreviewModal
                document={previewDoc}
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                projectId={projectId}
                stepName={stepName}
                onRegenerateSuccess={onRegenerateSuccess}
                isRegenerating={regeneratingDocId === previewDoc?.document_id}
                onRegenerate={handleRegenerateFromModal}
            />

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Regenerate Document</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to regenerate this document? This action will create a new version
                            of "{selectedDoc?.design_type}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={regeneratingDocId !== null}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRegenerateConfirm}
                            disabled={regeneratingDocId !== null}
                        >
                            {regeneratingDocId !== null ? "Regenerating..." : "OK"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
