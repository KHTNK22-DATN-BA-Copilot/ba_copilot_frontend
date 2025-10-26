"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function DocumentViewer({ projectId }: { projectId: string }) {
    const param = useSearchParams();
    const document_id = param.get("doc") || "srs-document";
    const [content, setContent] = useState("");

    useEffect(() => {
        const fetchDocument = async () => {
            const res = await fetch(`/api/srs-generate/doc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: projectId, document_id }),
            });
            if (!res.ok) {
                throw new Error("Failed to fetch document");
            }
            const data = await res.json();
            setContent(data.content);
        };
        fetchDocument();
    }, []);

    const DownloadFile = async () => {
        try {
            const res = await fetch(`/api/srs-generate/download`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: projectId, document_id })
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
    }

    return (
        <div className="w-full">
            <Button
                variant="ghost"
                className="mb-4 lg:mb-0 cursor-pointer"
                onClick={() =>
                    redirect(
                        `/dashboard/project/${projectId}/srsgenerator?tabs=recent-documents`
                    )
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
                            <Button className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm px-3 py-2" onClick={DownloadFile}>
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
            <div className="flex-1">
                <div className="p-2 sm:p-4 lg:p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
                            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                                Preview
                            </h2>
                            <span className="text-xs sm:text-sm p-1 rounded-2xl border border-black dark:border-white w-fit">
                                Full document
                            </span>
                        </div>

                        <div className="prose max-w-none">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
