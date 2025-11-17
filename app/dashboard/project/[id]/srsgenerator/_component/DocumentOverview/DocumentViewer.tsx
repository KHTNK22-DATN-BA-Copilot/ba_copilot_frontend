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
import { describe } from "node:test";

export default function DocumentViewer({ projectId }: { projectId: string }) {
    const param = useSearchParams();
    const document_id = param.get("doc") || "srs-document";
    const messageDescription = "";
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

    const regenerateDocument = async () => {

    }

    return (
        <div className="w-full relative">
            <div className="flex-1 bg-white border border-gray-200 dark:border-gray-700 rounded-xl px-1 pb-2 pt-1 relative">
                <div className="pt-3 px-1">
                    <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center mb-4 sm:mb-6 gap-2">
                        {/* Back to generate SRS document */}
                        <Button
                            variant="ghost"
                            className="mb-4 lg:mb-0 cursor-pointer"
                            onClick={() =>
                                redirect(`/dashboard/project/${projectId}/srsgenerator`)
                            }
                        >
                            <ArrowLeft className=" h-4 w-4" />
                        </Button>

                        {/* SRS document title and status */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                                E-Commerce Platform SRS
                            </h1>
                            <div className="flex flex-row items-center gap-2 ">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-white dark:bg-white dark:text-gray-900 w-fit">
                                    Complete
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    v2.1 • Last updated 2 days ago
                                </span>
                            </div>
                        </div>

                        {/* SRS view options button */}
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
                                className="w-fit flex items-center justify-center"
                            >
                                {/* Only icon on mobile, text on sm+ */}
                                {edit ? (
                                    <>
                                        {/* Eye icon for Preview Only */}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M1.75 12C3.5 7.5 8 4.5 12 4.5c4 0 8.5 3 10.25 7.5-1.75 4.5-6.25 7.5-10.25 7.5-4 0-8.5-3-10.25-7.5z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        <span className="hidden sm:inline">Preview Only</span>
                                    </>
                                ) : (
                                    <>
                                        {/* Columns icon for Split View */}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                            <rect x="3" y="4" width="7" height="16" rx="2" />
                                            <rect x="14" y="4" width="7" height="16" rx="2" />
                                        </svg>
                                        <span className="hidden sm:inline">Split View</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* SRS download button */}
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

                    {/*Document detail display */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-1.5">

                        {/* Chat to update document - hidden on mobile */}
                        <div className="hidden lg:flex flex-col overflow-auto">
                            <ChatWithAI
                                onContentUpdate={(newContent) => setContent(newContent)}
                                projectId={projectId}
                                documentId={document_id}
                            />
                        </div>

                        {edit ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 overflow-auto ">

                                {/* Editor and Preview */}
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Editor
                                    </h3>
                                    <Textarea
                                        value={content}
                                        onChange={(e) =>
                                            setContent(e.target.value)
                                        }
                                        className="h-[calc(100vh-270px)] w-full p-4 text-sm font-mono 
                                                    border border-gray-300 dark:border-gray-600 rounded-lg resize-none 
                                                    bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white 
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Edit your markdown content here..."
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Live Preview
                                    </h3>
                                    <div className="h-[calc(100vh-270px)] overflow-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-2 py-1">
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
                            <div className="h-[calc(100vh-250px)] markdown-body overflow-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-2 py-1">
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                    {content || data?.content || ""}
                                </ReactMarkdown>
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>

            {/* Chatbot Icon */}
            <ChatBot assisstanceName="Document AI Assistant" />
        </div>
    );
}
