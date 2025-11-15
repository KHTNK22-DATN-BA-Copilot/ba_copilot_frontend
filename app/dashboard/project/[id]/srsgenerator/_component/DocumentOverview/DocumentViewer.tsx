"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import "github-markdown-css/github-markdown.css";
import "github-markdown-css/github-markdown-dark.css";
import "github-markdown-css/github-markdown-light.css";

import ReactMarkdown from "react-markdown";
import { useSRS } from "@/hooks/use-srs-doc";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Textarea } from "@/components/ui/textarea";
import ChatBot from "@/components/chat-bot/ChatBot";
import { ChatWithAI } from "@/components/chat-bot/ChatWithAI";

export default function DocumentViewer({ projectId }: { projectId: string }) {
    const param = useSearchParams();
    const document_id = param.get("doc") || "srs-document";
    const { data, error, isLoading } = useSRS(projectId, document_id);
    const [content, setContent] = useState("");
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        setContent(data?.content);
    }, [data?.content]);

    const DownloadFile = async () => {
        try {
            const res = await fetch(`/api/srs-generate/download`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: projectId, document_id }),
            });
            if (!res.ok) {
                throw new Error("Failed to download document");
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "document.md";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error(error);
        }
    };

    const updateDocument = async () => {
        try {
            const res = await fetch(`/api/srs-generate`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    project_id: projectId,
                    document_id,
                    content,
                }),
            });
            const data = await res.json();
            console.log("Document updated:", data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full relative">
            <Button
                variant="ghost"
                className="mb-4 lg:mb-0 cursor-pointer"
                onClick={() =>
                    redirect(`/dashboard/project/${projectId}/srsgenerator`)
                }
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back to documents</span>
                <span className="sm:hidden">Back</span>
            </Button>

            {/* Header with title and actions */}
            <div className="flex-1">
                <div className="p-2 sm:p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row bg-white dark:bg-gray-800 justify-between rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-8 gap-4 sm:gap-0">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                                E-Commerce Platform SRS
                            </h1>
                            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-900 text-white dark:bg-white dark:text-gray-900 w-fit">
                                    Complete
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    v2.1 • Last updated 2 days ago
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm px-3 py-2"
                                onClick={DownloadFile}
                            >
                                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:block">
                                    Download
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative">
                <div className="p-2 sm:p-4 lg:p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
                            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white"></h2>
                            <div className="flex items-center gap-2">
                                {edit && (
                                    <Button
                                        variant="default"
                                        onClick={() => {
                                            updateDocument();
                                        }}
                                        className="w-fit"
                                        disabled={
                                            content.trim() ===
                                            data?.content.trim()
                                        }
                                    >
                                        Save Changes
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => setEdit(!edit)}
                                    className="w-fit"
                                >
                                    {edit ? "Preview Only" : "Split View"}
                                </Button>
                            </div>
                        </div>

                        {edit ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/*Chat to update document */}
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 h-6">
                                        Chat
                                    </h3>
                                    <ChatWithAI onContentUpdate={(newContent) => setContent(newContent)} />

                                </div>
                                {/* Editor and Preview */}
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Editor
                                    </h3>
                                    <Textarea
                                        value={content}
                                        onChange={(e) =>
                                            setContent(e.target.value)
                                        }
                                        className="flex-1 w-full p-4 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Edit your markdown content here..."
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Live Preview
                                    </h3>
                                    <div className="flex-1 overflow-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-4">
                                        <div className="markdown-body">
                                            <ReactMarkdown
                                                remarkPlugins={[
                                                    remarkGfm,
                                                    remarkBreaks,
                                                ]}
                                            >
                                                {content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
                                {/* Chat to update document */}
                                <div className="overflow-auto">
                                    <ChatWithAI onContentUpdate={(newContent) => setContent(newContent)} />
                                </div>

                                {/* preview only */}
                                <div className="markdown-body overflow-auto">
                                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                        {content || data?.content || ""}
                                    </ReactMarkdown>
                                </div>
                            </div>


                        )}
                    </div>
                </div>
            </div>

            {/* Chatbot Icon */}
            <ChatBot assisstanceName="Document AI Assistant" />
        </div>
    );
}
