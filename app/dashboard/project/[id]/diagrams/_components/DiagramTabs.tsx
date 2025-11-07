// ...existing code...
"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Diagram } from "../_lib/constants";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import remarkGfm from "remark-gfm";

interface DiagramTabsProps {
    diagram: Diagram;
}

mermaid.initialize({ startOnLoad: false }); // you can keep this or move into useEffect

const stripYamlFrontMatter = (s: string) => {
    if (!s) return s;

    // Xoá các comment '%' đầu file (Mermaid cho phép, không ảnh hưởng)
    const withoutComments = s.replace(/^\s*%.*\n/gm, "");

    // Xoá YAML front-matter (cho phép có khoảng trắng trước ---)
    const cleaned = withoutComments.replace(/^\s*---\s*\r?\n[\s\S]*?\r?\n\s*---\s*\r?\n?/, "").trim();

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

        blocks.forEach(async (block, idx) => {
            const raw = block.textContent ?? "";
            // first strip possible front-matter (even if it's indented)
            const withoutYaml = stripYamlFrontMatter(raw);
            // then remove common indentation so mermaid sees clean, left-aligned text
            const cleaned = dedent(withoutYaml);
            const id = `mermaid-${Date.now()}-${idx}-${Math.floor(
                Math.random() * 1000
            )}`;
            console.log(cleaned)

            try {
                const { svg } = await mermaid.render(id, cleaned);
                const wrapper = document.createElement("div");
                wrapper.innerHTML = svg;
                block.replaceWith(wrapper);
            } catch (err) {
                console.error("Mermaid render error:", err, {
                    raw,
                    withoutYaml,
                    cleaned,
                });
            }
        });
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

export function DiagramTabs({ diagram }: DiagramTabsProps) {
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
        <div className="p-2 sm:p-4 lg:p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                        Diagram View
                    </h2>
                    <div className="flex items-center gap-2">
                        {edit && (
                            <Button
                                variant="default"
                                onClick={() => {
                                    updateDiagram();
                                }}
                                className="w-fit"
                                disabled={content.trim() === diagram.markdown.trim()}
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Editor Panel */}
                        <div className="flex flex-col">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                        <div className="flex flex-col">
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
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-8 min-h-[400px] flex items-center justify-center">
                        <div className="w-full">
                            <MarkdownWithMermaid content={diagram.markdown} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
