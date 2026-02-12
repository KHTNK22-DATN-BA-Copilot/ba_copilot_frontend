"use client";
import "github-markdown-css/github-markdown.css";
import "github-markdown-css/github-markdown-dark.css";
import "github-markdown-css/github-markdown-light.css";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentListItem } from "../types";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Download, X, Send, Loader2 } from "lucide-react";
import { exportDocument, regenerateDocument } from "../api";
import { toast } from "sonner";
import type { StepName } from "../types";

interface DocumentPreviewModalProps {
    document: DocumentListItem | null;
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    stepName: StepName;
    onRegenerateSuccess?: () => void;
    isRegenerating?: boolean;
    onRegenerate?: (documentId: string) => Promise<void>;
}

export function DocumentPreviewModal({
    document,
    isOpen,
    onClose,
    projectId,
    stepName,
    onRegenerateSuccess,
    isRegenerating = false,
    onRegenerate,
}: DocumentPreviewModalProps) {
    const [edit, setEdit] = useState(false);
    const [content, setContent] = useState("");
    const [downloadingDoc, setDownloadingDoc] = useState(false);
    const [chatInput, setChatInput] = useState("");

    useEffect(() => {
        if (document) {
            setContent(document.content || "");
        }
    }, [document]);

    const handleSend = async () => {
        if (!document || !chatInput.trim()) {
            toast.error("Please enter a prompt");
            return;
        }

        if (onRegenerate) {
            // Use parent's regenerate handler to sync state
            await onRegenerate(document.document_id);
            setChatInput(""); // Clear input after success
        } else {
            // Fallback to direct API call if no handler provided
            try {
                const response = await regenerateDocument(stepName, projectId, document.document_id);

                if (response.status !== "error") {
                    toast.success("Document regenerated successfully");
                    if (response.result?.content) {
                        setContent(response.result.content);
                    }
                    setChatInput("");
                    onRegenerateSuccess?.();
                } else {
                    throw new Error(response.message || "Failed to regenerate document");
                }
            } catch (error) {
                console.error("Error regenerating document:", error);
                const errorMessage = error instanceof Error ? error.message : "Failed to regenerate document";
                toast.error(errorMessage);
            }
        }
    };

    const handleDownload = async () => {
        if (!document) return;
        setDownloadingDoc(true);
        try {
            await exportDocument(stepName, projectId, document.document_id);
            toast.success(`Document "${document.design_type}" downloaded successfully`);
        } catch (error) {
            console.error("Error downloading document:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to download document";
            toast.error(errorMessage);
        } finally {
            setDownloadingDoc(false);
        }
    };

    const updateDocument = async () => {
        try {
            // TODO: Implement API call to update document
            console.log("Updating document with content:", content);
            toast.info("Document update feature coming soon");
        } catch (error) {
            console.error("Failed to update document:", error);
            toast.error("Failed to update document");
        }
    };

    if (!document) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="p-0 gap-0 overflow-hidden border-0"
                style={{
                    maxWidth: '96vw',
                    width: '96vw',
                    height: '96vh',
                    maxHeight: '96vh',
                }}
            >
                <div className="bg-white dark:bg-gray-800 rounded-lg h-full flex flex-col overflow-hidden">
                    {/* Header */}
                    <DialogHeader className="border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 flex-shrink-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div className="flex flex-row items-center gap-2 min-w-0">
                                {/* <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="flex-shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button> */}
                                <div className="min-w-0">
                                    <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                                        {document.design_type}
                                    </DialogTitle>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                                        {document.project_name} • Updated {new Date(document.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                                {edit && (
                                    <Button
                                        variant="default"
                                        onClick={updateDocument}
                                        size="sm"
                                        disabled={content.trim() === (document.content || "").trim()}
                                    >
                                        Save Changes
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => setEdit(!edit)}
                                    size="sm"
                                >
                                    {edit ? "Preview Only" : "Split View"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={handleDownload}
                                    disabled={downloadingDoc}
                                >
                                    <Download className={`w-4 h-4 ${downloadingDoc ? 'animate-pulse' : ''}`} />
                                    <span className="hidden sm:inline">{downloadingDoc ? "Downloading..." : "Download"}</span>
                                </Button>
                            </div> */}
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden p-2 sm:p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-2 sm:gap-4 h-full">
                            {/* Chat Layout (Left Panel) - Fixed width */}
                            <div className="flex flex-col h-full min-h-0 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 w-full lg:w-[300px] lg:min-w-[300px] lg:max-w-[300px]">
                                <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex-shrink-0">
                                    Chat with AI
                                </h3>
                                <div className="flex-1 overflow-y-auto overflow-x-hidden mb-3 sm:mb-4 space-y-2 sm:space-y-3 min-h-0">
                                    {/* Chat messages would go here */}
                                    <div className="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm py-4 sm:py-8 break-words">
                                        Ask me to update your document!
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <Textarea
                                        placeholder="Enter your prompt"
                                        className="min-h-[32px] sm:min-h-[36px] resize-none text-xs sm:text-sm w-full break-words"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        disabled={isRegenerating}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                    />
                                    <Button
                                        size="sm"
                                        className="self-end flex-shrink-0 min-h-[32px] sm:min-h-[36px]"
                                        onClick={handleSend}
                                        disabled={isRegenerating || !chatInput.trim()}
                                    >
                                        {isRegenerating ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {edit ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 h-full min-h-0 min-w-0">
                                    {/* Editor Panel */}
                                    <div className="flex flex-col h-full min-h-0 min-w-0">
                                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex-shrink-0">
                                            Editor
                                        </h3>
                                        <Textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="flex-1 w-full p-2 sm:p-4 text-xs sm:text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-0"
                                            placeholder="Edit your document here..."
                                        />
                                    </div>

                                    {/* Preview Panel */}
                                    <div className="flex flex-col h-full min-h-0 min-w-0">
                                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex-shrink-0">
                                            Live Preview
                                        </h3>
                                        <div className="flex-1 overflow-y-auto overflow-x-hidden border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-2 sm:p-4 min-h-0">
                                            <div className="markdown-body bg-transparent">
                                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                                    {content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-0 min-w-0 overflow-y-auto overflow-x-hidden border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-2 sm:p-4">
                                    <div className="markdown-body bg-transparent">
                                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                            {document.content || "No content available"}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
