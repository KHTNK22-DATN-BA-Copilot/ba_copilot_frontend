"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Diagram } from "../../_lib/constants";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import remarkGfm from "remark-gfm";
import { ChatWithAI, diagramChatConfig } from "@/components/chat-bot";
import { ArrowLeft, Download, Share2, Workflow } from "lucide-react";

interface DiagramTabsProps {
    diagram: Diagram;
    projectId: string;
    onBack: () => void;
}

mermaid.initialize({ startOnLoad: false }); // you can keep this or move into useEffect

const stripYamlFrontMatter = (s: string) => {
    if (!s) return s;

    // Xoá các comment '%' đầu file (Mermaid cho phép, không ảnh hưởng)
    const withoutComments = s.replace(/^\s*%.*\n/gm, "");

    // Xoá YAML front-matter (cho phép có khoảng trắng trước ---)
    const cleaned = withoutComments
        .replace(/^\s*---\s*\r?\n[\s\S]*?\r?\n\s*---\s*\r?\n?/, "")
        .trim();

    return cleaned;
};
const dedent = (text: string) => {
    if (!text) return text;
    const lines = text.split(/\r?\n/);
    // remove leading/trailing blank lines
    while (lines.length && lines[0].trim() === "") lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
    if (!lines.length) return "";

    // find minimum indent (spaces or tabs) among non-empty lines
    let minIndent: number | null = null;
    for (const line of lines) {
        const m = line.match(/^([ \t]*)\S/);
        if (m) {
            const len = m[1].length;
            if (minIndent === null || len < minIndent) minIndent = len;
        }
    }
    if (!minIndent || minIndent === 0) return lines.join("\n");
    const regex = new RegExp(`^[ \\t]{0,${minIndent}}`);
    return lines.map((l) => l.replace(regex, "")).join("\n");
};

const MarkdownWithMermaid = ({ content }: { content: string }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        try {
            mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
        } catch (e) {
            // ignore if mermaid already initialized
        }

        if (!ref.current) return;

        const blocks = Array.from(
            ref.current.querySelectorAll<HTMLDivElement>(".mermaid")
        );

        (async () => {
            for (const [idx, block] of blocks.entries()) {
                if (!block || !block.isConnected) continue;

                const raw = block.textContent ?? "";
                const withoutYaml = stripYamlFrontMatter(raw);
                const cleaned = dedent(withoutYaml);

                const uniq =
                    typeof crypto !== "undefined" && crypto.randomUUID
                        ? crypto.randomUUID()
                        : `${Date.now()}-${idx}-${Math.floor(
                            Math.random() * 1000
                        )}`;
                const id = `mermaid-${uniq}`;

                try {
                    // await so mermaid internal DOM ops don't race across many concurrent calls
                    const { svg } = await mermaid.render(id, cleaned);

                    // check again that element still in DOM (user may have edited/removed it)
                    if (!block.isConnected) continue;

                    // safer: set innerHTML of the existing container instead of replaceWith,
                    // avoids "node to be removed is not a child" errors when mermaid manipulates nodes.
                    block.innerHTML = svg;
                    block.classList.remove("mermaid");
                } catch (err) {
                    console.error("Mermaid render error:", err, {
                        raw,
                        withoutYaml,
                        cleaned,
                        id,
                    });
                }
            }
        })();
    }, [content]);

    return (
        <div ref={ref} className="w-full">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ className, children }) {
                        const lang = className?.replace("language-", "");
                        if (lang === "mermaid") {
                            const text = Array.isArray(children)
                                ? children.join("")
                                : String(children);
                            return (
                                <div className="mermaid whitespace-pre-wrap">
                                    {text}
                                </div>
                            );
                        }
                        return (
                            <pre>
                                <code className={className}>{children}</code>
                            </pre>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export function DiagramViewer({ diagram, projectId, onBack }: DiagramTabsProps) {
    const [edit, setEdit] = useState(false);
    const [content, setContent] = useState(diagram.markdown);

    useEffect(() => {
        setContent(diagram.markdown);
    }, [diagram.markdown]);

    const updateDiagram = async () => {
        try {
            // TODO: Implement API call to update diagram
            console.log("Updating diagram with content:", content);
            // Add your API call here
        } catch (error) {
            console.error("Failed to update diagram:", error);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-1.5">

            {/** Diagram detail header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:mb-2 gap-2">
                <div className="flex flex-row items-center gap-2">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        className="gap-2 relative z-10"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onBack();
                        }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>

                    {/* Diagram Header */}
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{diagram.name}</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {diagram.type} • Created {diagram.date}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {edit && (
                        <Button
                            variant="default"
                            onClick={() => {
                                updateDiagram();
                            }}
                            className="w-fit"
                            disabled={
                                content.trim() === diagram.markdown.trim()
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
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Share2 className="w-4 h-4" />
                            Share
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Download
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-2">
                {/* Chat to update diagram */}
                <div className="overflow-auto">
                    <ChatWithAI
                        apiConfig={diagramChatConfig}
                        additionalData={{ projectId: projectId, diagramId: diagram.id }}
                        onContentUpdate={(newContent) => setContent(newContent)}
                        emptyStateMessage="Ask me to update your diagram!"
                        placeholder="e.g., Change the database to a NoSQL database..."
                    />

                </div>
                {edit ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 overflow-auto">

                        {/* Editor Panel */}
                        <div className="flex flex-col h-[calc(100vh-250px)]">
                            <h3 className="text-sm  font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Editor
                            </h3>
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="flex-1 w-full p-4 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[500px]"
                                placeholder="Edit your diagram markdown here..."
                            />
                        </div>

                        {/* Preview Panel */}
                        <div className="flex flex-col h-[calc(100vh-250px)]">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Live Preview
                            </h3>
                            <div className="flex-1 overflow-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-4 min-h-[500px]">
                                <div className="w-full">
                                    <MarkdownWithMermaid content={content} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[calc(100vh-250px)] overflow-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 px-2 py-1">
                        <div className="w-full">
                            <MarkdownWithMermaid content={diagram.markdown} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
