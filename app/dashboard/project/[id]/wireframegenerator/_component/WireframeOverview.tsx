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
        <div className="flex flex-col h-screen p-4">
            {/* Header with Split View Button */}
            <div className="flex justify-between items-center mb-4">
                <Button
                    variant="ghost"
                    className="mb-4 lg:mb-0 cursor-pointer"
                    onClick={() =>
                        redirect(`/dashboard/project/${project_id}/wireframegenerator`)
                    }
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Back to documents</span>
                    <span className="sm:hidden">Back</span>
                </Button>
                <Button
                    onClick={() => setIsSplitView(!isSplitView)}
                    className="px-4 py-2 cursor-pointer rounded-lg transition-colors flex items-center gap-2"
                >
                    {isSplitView ? (
                        <>
                            <Eye className="w-5 h-5" />
                            Preview Only
                        </>
                    ) : (
                        <>
                            <SplitSquareHorizontal />
                            Split View
                        </>
                    )}
                </Button>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
                <div className="overflow-auto">
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
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-auto">
                            {/* Code Editor */}
                            <div className="flex-1 flex flex-col border rounded-lg overflow-auto bg-white shadow-lg">
                                <div className="flex border-b bg-gray-50">
                                    <button
                                        className={`px-6 py-3 font-medium transition-colors ${activeTab === "html"
                                            ? "bg-blue-500 text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                        onClick={() => setActiveTab("html")}
                                    >
                                        HTML
                                    </button>
                                    <button
                                        className={`px-6 py-3 font-medium transition-colors ${activeTab === "css"
                                            ? "bg-blue-500 text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                        onClick={() => setActiveTab("css")}
                                    >
                                        CSS
                                    </button>
                                </div>
                                <textarea
                                    className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none "
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
                            <div className="flex-1 border rounded-lg overflow-auto bg-white shadow-lg">
                                <div className="bg-gray-50 px-4 py-3 border-b">
                                    <span className="font-medium text-gray-700">
                                        Live Preview
                                    </span>
                                </div>
                                <iframe
                                    srcDoc={srcDoc}
                                    title="preview"
                                    sandbox="allow-scripts"
                                    className="w-full h-full border-0"
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 border rounded-lg overflow-auto bg-white shadow-lg">
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
    );
}
