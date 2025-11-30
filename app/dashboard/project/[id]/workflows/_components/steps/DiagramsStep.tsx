'use client';

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, X } from "lucide-react";
import { DiagramIcon } from "@/components/icons/project-icons";
import PromptWithFileSelection from "../PromptWithFileSelection";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";
import remarkGfm from "remark-gfm";

const stripYamlFrontMatter = (s: string) => {
    if (!s) return s;
    const withoutComments = s.replace(/^\s*%.*\n/gm, "");
    const cleaned = withoutComments
        .replace(/^\s*---\s*\r?\n[\s\S]*?\r?\n\s*---\s*\r?\n?/, "")
        .trim();
    return cleaned;
};

const dedent = (text: string) => {
    if (!text) return text;
    const lines = text.split(/\r?\n/);
    while (lines.length && lines[0].trim() === "") lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
    if (!lines.length) return "";

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
                    const { svg } = await mermaid.render(id, cleaned);
                    if (!block.isConnected) continue;
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

interface DiagramsStepProps {
    generatedDiagrams: string[];
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
}

export default function DiagramsStep({
    generatedDiagrams,
    onGenerate,
    onNext,
    onBack
}: DiagramsStepProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [previewDiagram, setPreviewDiagram] = useState<string | null>(null);

    const handleGenerateDiagrams = () => {
        console.log("Sending prompt:", prompt);
        console.log("Selected files:", selectedFiles);
        onGenerate();
    };

    const handleViewDiagram = (diagram: string) => {
        setPreviewDiagram(diagram);
    };

    const handleClosePreview = () => {
        setPreviewDiagram(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Generate Diagrams
                </h2>
            </div>

            <PromptWithFileSelection
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedFiles={selectedFiles}
                onSelectedFilesChange={setSelectedFiles}
                placeholder="Describe the diagrams you want to generate...

Example:
- Generate a use case diagram for user authentication
- Create a class diagram for the order management system
- Build an activity diagram for the checkout process"
                label="Diagram Generation Prompt & Reference Files (Optional)"
            />

            {/* Generated Diagrams Section */}
            {generatedDiagrams.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 ">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                                <DiagramIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    Generated Diagrams
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {generatedDiagrams.length} diagram(s) created
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {generatedDiagrams.map((diagram, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-2 p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm text-gray-900 dark:text-gray-100">{diagram}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => handleViewDiagram(diagram)}
                                    >
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewDiagram && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {previewDiagram}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClosePreview}
                                className="gap-2"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-auto p-4" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                            <div className="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-4">
                                <MarkdownWithMermaid content={`
\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
\`\`\`

### ${previewDiagram}

This is a sample diagram. Replace this with actual diagram data from your API.

**Features:**
- Full mermaid diagram support
- Markdown rendering
- Dark mode compatible
                                `} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-center items-center gap-3">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                {generatedDiagrams.length === 0 ? (
                    <Button onClick={handleGenerateDiagrams} className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate Diagrams
                    </Button>
                ) : (
                    <Button onClick={onNext} className="gap-2">
                        Continue to SRS
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
