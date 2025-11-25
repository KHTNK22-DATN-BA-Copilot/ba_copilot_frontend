"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, SplitSquareHorizontal } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useWireframe } from "@/hooks/use-wireframe";
import { Textarea } from "@/components/ui/textarea";
import ChatBot from "@/components/chat-bot/ChatBot";
import { ChatWithAI, wireframeChatConfig } from "@/components/chat-bot";

export default function WireframeOverview({
    project_id,
    wireframe_id,
}: {
    project_id: string;
    wireframe_id: string;
}) {
    const { data, error, isLoading } = useWireframe(wireframe_id);
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [activeTab, setActiveTab] = useState<"html" | "css">("html");
    const [isSplitView, setIsSplitView] = useState(false);

    useEffect(() => {
        if (data) {
            setHtml(data.html_content || "");
            setCss(data.css_content || "");
        }
    }, [data])

    const srcDoc = `
        <!DOCTYPE html>
        <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}
            </body>
        </html>
    `;

    return (
        <div className="w-full relative">
            <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-0.5 pb-1.5 pt-1 relative">
                <div className="pt-3 px-1">
                    {/* Header with Split View Button */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                className="cursor-pointer"
                                onClick={() =>
                                    redirect(`/dashboard/project/${project_id}/wireframegenerator`)
                                }
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline ml-2">Back to documents</span>
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsSplitView(!isSplitView)}
                                className="w-fit flex items-center justify-center"
                            >
                                {isSplitView ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M1.75 12C3.5 7.5 8 4.5 12 4.5c4 0 8.5 3 10.25 7.5-1.75 4.5-6.25 7.5-10.25 7.5-4 0-8.5-3-10.25-7.5z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        <span className="ml-2">Preview Only</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                            <rect x="3" y="4" width="7" height="16" rx="2" />
                                            <rect x="14" y="4" width="7" height="16" rx="2" />
                                        </svg>
                                        <span className="ml-2">Split View</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-1.5">
                        {/* Chat to update wireframe - hidden on mobile */}
                        <div className="hidden lg:flex flex-col overflow-auto">
                            <ChatWithAI
                                apiConfig={wireframeChatConfig}
                                additionalData={{ projectId: project_id, wireframeId: wireframe_id }}
                                onContentUpdate={(newContent) => {
                                    // Assuming the API returns HTML content
                                    setHtml(newContent);
                                }}
                                onSuccess={(data) => {
                                    // Update both HTML and CSS if available in response
                                    if (data.html_content) setHtml(data.html_content);
                                    if (data.css_content) setCss(data.css_content);
                                }}
                                emptyStateMessage="Ask me to update your wireframe!"
                                placeholder="e.g., Add a navigation bar with logo and menu..."
                            />
                        </div>

                        {isSplitView ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 overflow-auto">
                                {/* Code Editor */}
                                <div className="flex flex-col">
                                    <div className="flex border-b bg-gray-50 dark:bg-gray-800 rounded-t-lg overflow-hidden">
                                        <button
                                            className={`px-6 py-3 font-medium transition-colors text-sm ${activeTab === "html"
                                                ? "bg-blue-500 text-white"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                }`}
                                            onClick={() => setActiveTab("html")}
                                        >
                                            HTML
                                        </button>
                                        <button
                                            className={`px-6 py-3 font-medium transition-colors text-sm ${activeTab === "css"
                                                ? "bg-blue-500 text-white"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                }`}
                                            onClick={() => setActiveTab("css")}
                                        >
                                            CSS
                                        </button>
                                    </div>
                                    <textarea
                                        className="h-[calc(100vh-295px)] w-full p-4 text-sm font-mono 
                                                    border border-gray-300 dark:border-gray-600 rounded-b-lg resize-none 
                                                    bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white 
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={activeTab === "html" ? html : css}
                                        onChange={(e) =>
                                            activeTab === "html"
                                                ? setHtml(e.target.value)
                                                : setCss(e.target.value)
                                        }
                                        placeholder={`Enter ${activeTab.toUpperCase()} code here...`}
                                    />
                                </div>

                                {/* Live Preview */}
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Live Preview
                                    </h3>
                                    <div className="h-[calc(100vh-270px)] overflow-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                                        <iframe
                                            srcDoc={srcDoc}
                                            title="preview"
                                            sandbox="allow-scripts"
                                            className="w-full h-full border-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[calc(100vh-250px)] overflow-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                                <iframe
                                    srcDoc={srcDoc}
                                    title="preview"
                                    sandbox="allow-scripts"
                                    className="w-full h-full border-0"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
