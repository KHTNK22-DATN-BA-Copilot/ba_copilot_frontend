'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, FileText, Layout, BarChart3, RefreshCw } from "lucide-react";
import PreviewModal from "../PreviewModal";
import {
    DocumentListItem,
    FetchedDocumentsList,
    getAnalysisDocuments,
    getDesignDocuments,
    getPlanningDocuments,
} from "./shared";

interface ReviewStepProps {
    requirements: string;
    generatedSRS: string;
    generatedDiagrams: string[];
    generatedWireframes: string[];
    onBack: () => void;
    onComplete: () => void;
    onRestart: () => void;
}
export default function ReviewStep({
    onBack,
    onComplete,
    onRestart
}: ReviewStepProps) {
    const params = useParams();
    const projectId = params?.id as string;

    const [planningDocs, setPlanningDocs] = useState<DocumentListItem[]>([]);
    const [analysisDocs, setAnalysisDocs] = useState<DocumentListItem[]>([]);
    const [designDocs, setDesignDocs] = useState<DocumentListItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<DocumentListItem | null>(null);

    const totalDocs = useMemo(
        () => planningDocs.length + analysisDocs.length + designDocs.length,
        [planningDocs.length, analysisDocs.length, designDocs.length]
    );

    const fetchAllGeneratedDocuments = useCallback(async () => {
        if (!projectId) return;

        setIsLoading(true);
        setError(null);

        try {
            // User requested: call APIs sequentially (lần lượt)
            const planningRes = await getPlanningDocuments(projectId);
            if (planningRes.status === "success" && planningRes.documents) {
                setPlanningDocs(planningRes.documents);
            } else {
                setPlanningDocs([]);
            }

            const analysisRes = await getAnalysisDocuments(projectId);
            if (analysisRes.status === "success" && analysisRes.documents) {
                setAnalysisDocs(analysisRes.documents);
            } else {
                setAnalysisDocs([]);
            }

            const designRes = await getDesignDocuments(projectId);
            if (designRes.status === "success" && designRes.documents) {
                setDesignDocs(designRes.documents);
            } else {
                setDesignDocs([]);
            }
        } catch (e) {
            console.error("[ReviewStep] Failed to fetch generated documents:", e);
            setError(e instanceof Error ? e.message : "Failed to fetch generated documents");
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchAllGeneratedDocuments();
    }, [fetchAllGeneratedDocuments]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Final Review
                </h2>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Total generated documents: <span className="font-medium">{totalDocs}</span>
                    </p>
                    {projectId && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Project: {projectId}</p>
                    )}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={fetchAllGeneratedDocuments}
                    disabled={isLoading || !projectId}
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {isLoading && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                        Loading generated documents...
                    </p>
                </div>
            )}

            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-blue-100 rounded-sm">
                        <div className="m-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Planning Step Documents
                        </h3>
                    </div>
                    <FetchedDocumentsList documents={planningDocs} onPreview={setPreviewDoc} />
                    {!isLoading && planningDocs.length === 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            No planning documents generated yet.
                        </p>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-purple-100 rounded-sm">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded">
                            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Analysis Step Documents
                        </h3>
                    </div>
                    <FetchedDocumentsList documents={analysisDocs} onPreview={setPreviewDoc} />
                    {!isLoading && analysisDocs.length === 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            No analysis documents generated yet.
                        </p>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-green-100 rounded-sm">
                        <div className="m-2 bg-green-100 dark:bg-green-900/20 rounded">
                            <Layout className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Design Step Documents
                        </h3>
                    </div>
                    <FetchedDocumentsList documents={designDocs} onPreview={setPreviewDoc} />
                    {!isLoading && designDocs.length === 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            No design documents generated yet.
                        </p>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {previewDoc && (
                <PreviewModal
                    isOpen={!!previewDoc}
                    onClose={() => setPreviewDoc(null)}
                    type="document"
                    title={`${previewDoc.design_type} - ${previewDoc.project_name}`}
                    content={previewDoc.content || "No content available"}
                />
            )}

            <div className="flex justify-center items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                <Button onClick={onComplete} className="gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Workflow
                </Button>
                <Button variant="outline" onClick={onRestart}>
                    Start New Workflow
                </Button>
            </div>
        </div>
    );
}
