// ...existing code...
"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Diagram } from "../_lib/constants";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";
import { useEffect, useRef } from "react";
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
    console.log("Rendering DiagramTabs with diagram:", diagram.markdown);
    return (
        <Tabs defaultValue="preview">
            <div className="flex w-full flex-col sm:flex-row sm:w-fit p-1 rounded-2xl bg-gray-300 dark:bg-gray-700 justify-between mb-7">
                <TabsList className="bg-transparent">
                    <TabsTrigger
                        value="preview"
                        className="p-2 rounded-2xl font-semibold text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:dark:text-white dark:text-gray-300"
                    >
                        Preview
                    </TabsTrigger>
                    <TabsTrigger
                        value="edit"
                        className="p-2 rounded-2xl font-semibold text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:dark:text-white dark:text-gray-300"
                    >
                        Edit
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="preview" className="mt-6">
                <div className="col-span-12">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 min-h-96 flex items-center justify-center">
                            <div className="text-center space-y-4 w-full">
                                <MarkdownWithMermaid
                                    content={diagram.markdown}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="edit" className="mt-6">
                <div className="col-span-12">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Markdown Source
                                </h3>
                                <Button variant="outline" size="sm">
                                    Save Changes
                                </Button>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 min-h-96 font-mono text-sm">
                                <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                                    {diagram.markdown}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}
