"use client";
import "github-markdown-css/github-markdown.css";
import "github-markdown-css/github-markdown-dark.css";
import "github-markdown-css/github-markdown-light.css";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentListItem, SessionMessage } from "../types";
import ReactMarkdown from "react-markdown";
import { useEffect, useMemo, useRef, useState } from "react";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Download, Send, Loader2, GitCompare, Eye } from "lucide-react";
import { exportDocument, getSessionHistory, regenerateDocument, updateDocumentContent } from "../api";
import { toast } from "sonner";
import type { StepName } from "../types";
import { diffLines } from "diff";
import { cn } from "@/lib/utils";
import mermaid from "mermaid";

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

const normalizeMermaidSource = (raw: string) => {
    if (!raw) return "";

    // Some backend payloads contain escaped newlines/tabs in plain text.
    const unescaped = raw
        .replace(/\\r\\n/g, "\n")
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t");

    const withoutYaml = stripYamlFrontMatter(unescaped);
    return dedent(withoutYaml).trim();
};

const isHtmlDocument = (text: string) => {
    const trimmed = text.trim();
    return (
        trimmed.startsWith("<!DOCTYPE") ||
        trimmed.startsWith("<html") ||
        /^<(div|main|section|article|header|footer|nav|form|table|style|body)(\s|>)/i.test(trimmed)
    );
};

type StructuredFormat = "markers" | "json";

interface StructuredHtmlCss {
    html: string;
    css: string;
    format: StructuredFormat;
}

const parseStructuredHtmlCss = (raw: string): StructuredHtmlCss | null => {
    if (!raw) return null;

    const markerHtmlStart = "<!--HTML_START-->";
    const markerHtmlEnd = "<!--HTML_END-->";
    const markerCssStart = "<!--CSS_START-->";
    const markerCssEnd = "<!--CSS_END-->";

    if (
        raw.includes(markerHtmlStart) &&
        raw.includes(markerHtmlEnd) &&
        raw.includes(markerCssStart) &&
        raw.includes(markerCssEnd)
    ) {
        try {
            const html = raw.split(markerHtmlStart)[1].split(markerHtmlEnd)[0].trim();
            const css = raw.split(markerCssStart)[1].split(markerCssEnd)[0].trim();
            return { html, css, format: "markers" };
        } catch {
            // Fall through to JSON/plain HTML detection.
        }
    }

    try {
        const parsed = JSON.parse(raw) as { html?: unknown; css?: unknown };
        if (typeof parsed?.html === "string" || typeof parsed?.css === "string") {
            return {
                html: typeof parsed.html === "string" ? parsed.html : "",
                css: typeof parsed.css === "string" ? parsed.css : "",
                format: "json",
            };
        }
    } catch {
        // Not JSON; continue.
    }

    return null;
};

const serializeStructuredHtmlCss = (
    html: string,
    css: string,
    format: StructuredFormat
) => {
    if (format === "markers") {
        return `<!--HTML_START-->\n${html}\n<!--HTML_END-->\n<!--CSS_START-->\n${css}\n<!--CSS_END-->`;
    }

    return JSON.stringify({ html, css });
};

const buildSrcDoc = (html: string, css: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${css}</style>
  </head>
  <body>
    ${html}
  </body>
</html>
`;

let mermaidInitialized = false;

const ensureMermaidInitialized = () => {
    if (mermaidInitialized) return;
    mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
    mermaidInitialized = true;
};

const MermaidBlock = ({ source }: { source: string }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let isCancelled = false;
        let rafA: number | null = null;
        let rafB: number | null = null;
        let retryTimer: number | null = null;

        const renderDiagram = async () => {
            if (isCancelled || !ref.current) return;

            const cleaned = normalizeMermaidSource(source);
            if (!cleaned) {
                ref.current.textContent = "";
                return;
            }

            try {
                ensureMermaidInitialized();
                const uniq =
                    typeof crypto !== "undefined" && crypto.randomUUID
                        ? crypto.randomUUID()
                        : `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                const id = `mermaid-${uniq}`;
                const { svg } = await mermaid.render(id, cleaned);

                if (isCancelled || !ref.current) return;
                ref.current.innerHTML = svg;
                ref.current.classList.remove("mermaid");
            } catch (error) {
                if (!ref.current) return;
                // Keep fallback text visible when render fails.
                ref.current.textContent = cleaned;
                console.error("Mermaid render error:", error);
            }
        };

        // Render immediately and retry after paint to handle dialog mount timing.
        void renderDiagram();
        rafA = window.requestAnimationFrame(() => {
            rafB = window.requestAnimationFrame(() => {
                void renderDiagram();
            });
        });
        retryTimer = window.setTimeout(() => {
            void renderDiagram();
        }, 120);

        return () => {
            isCancelled = true;
            if (rafA !== null) window.cancelAnimationFrame(rafA);
            if (rafB !== null) window.cancelAnimationFrame(rafB);
            if (retryTimer !== null) window.clearTimeout(retryTimer);
        };
    }, [source]);

    return <div ref={ref} className="mermaid whitespace-pre-wrap" />;
};

const MarkdownWithMermaid = ({ content }: { content: string }) => {
    return (
        <div className="markdown-body bg-white p-2 sm:p-4" style={{ colorScheme: "light" }}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                    code({ className, children }) {
                        const lang = className?.replace("language-", "");
                        if (lang === "mermaid") {
                            const text = Array.isArray(children)
                                ? children.join("")
                                : String(children);
                            return <MermaidBlock source={text} />;
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

const DiffView = ({ original, modified }: { original: string; modified: string }) => {
    const changes = diffLines(original, modified);
    return (
        <div className="font-mono text-xs leading-5 overflow-x-auto">
            {changes.map((part, idx) => {
                const lines = part.value.split("\n");
                if (lines[lines.length - 1] === "") lines.pop();
                return lines.map((line, lineIdx) => (
                    <div
                        key={`${idx}-${lineIdx}`}
                        className={cn(
                            "flex px-2 py-0.5 whitespace-pre-wrap break-words",
                            part.added
                                ? "bg-green-50 dark:bg-green-950"
                                : part.removed
                                    ? "bg-red-50 dark:bg-red-950"
                                    : ""
                        )}
                    >
                        <span
                            className={cn(
                                "select-none mr-3 w-3 flex-shrink-0 font-bold",
                                part.added
                                    ? "text-green-600 dark:text-green-400"
                                    : part.removed
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-gray-400"
                            )}
                        >
                            {part.added ? "+" : part.removed ? "-" : " "}
                        </span>
                        <span
                            className={cn(
                                part.added
                                    ? "text-green-800 dark:text-green-200"
                                    : part.removed
                                        ? "text-red-800 dark:text-red-200"
                                        : "text-gray-700 dark:text-gray-300"
                            )}
                        >
                            {line}
                        </span>
                    </div>
                ));
            })}
        </div>
    );
};

interface DocumentPreviewModalProps {
    document: DocumentListItem | null;
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    stepName: StepName;
    onRegenerateSuccess?: () => void;
    isRegenerating?: boolean;
    onRegenerate?: (documentId: string, description?: string) => Promise<void>;
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
    const [isSaving, setIsSaving] = useState(false);
    const [downloadingDoc, setDownloadingDoc] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatHistory, setChatHistory] = useState<SessionMessage[]>([]);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);
    const [diffMode, setDiffMode] = useState(false);
    const [codeTab, setCodeTab] = useState<"html" | "css">("html");
    const [htmlContent, setHtmlContent] = useState("");
    const [cssContent, setCssContent] = useState("");
    const [structuredFormat, setStructuredFormat] = useState<StructuredFormat>("json");
    const chatListRef = useRef<HTMLDivElement | null>(null);
    const hasAutoSwitchedToDiffRef = useRef(false);
    const editorPanelRef = useRef<HTMLDivElement | null>(null);
    const previewPanelRef = useRef<HTMLDivElement | null>(null);
    const htmlPreviewIframeRef = useRef<HTMLIFrameElement | null>(null);
    const iframeScrollCleanupRef = useRef<(() => void) | null>(null);
    const scrollingSourceRef = useRef<"editor" | "preview" | null>(null);

    const structuredContent = useMemo(() => parseStructuredHtmlCss(content || ""), [content]);
    const isStructuredHtmlCss = Boolean(structuredContent);
    const isHtmlPreview = isStructuredHtmlCss || isHtmlDocument(content || "");

    const previewHtml = isStructuredHtmlCss ? htmlContent : content || "";
    const previewCss = isStructuredHtmlCss ? cssContent : "";
    const previewSrcDoc = buildSrcDoc(previewHtml, previewCss);

    const isUserRole = (role: string) => role.toLowerCase() === "user";

    const formatTimestamp = (timestamp: string) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) return "";
        return date.toLocaleString();
    };

    const loadSessionHistory = async (contentId: string) => {
        if (!contentId) {
            setChatHistory([]);
            return;
        }

        setIsHistoryLoading(true);
        setHistoryError(null);
        try {
            const response = await getSessionHistory(contentId);
            console.log("Session history response:", response);
            if (response.status === "error") {
                throw new Error(response.message || "Failed to load chat history");
            }

            setChatHistory(response.Sessions || []);
        } catch (error) {
            console.error("Error loading chat history:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to load chat history";
            setHistoryError(errorMessage);
        } finally {
            setIsHistoryLoading(false);
        }
    };

    useEffect(() => {
        if (document) {
            setContent(document.content || "");
        }
    }, [document]);

    useEffect(() => {
        if (!content) {
            setHtmlContent("");
            setCssContent("");
            return;
        }

        const parsed = parseStructuredHtmlCss(content);
        if (!parsed) {
            setHtmlContent("");
            setCssContent("");
            return;
        }

        setHtmlContent(parsed.html || "");
        setCssContent(parsed.css || "");
        setStructuredFormat(parsed.format);
    }, [content]);

    useEffect(() => {
        if (!isOpen || !document?.document_id) {
            setChatHistory([]);
            setHistoryError(null);
            return;
        }

        // The backend expects content_id = file_id of the previewed file.
        // In this screen, the previewed file id is document.document_id.
        void loadSessionHistory(document.document_id);
    }, [document?.document_id, isOpen]);

    useEffect(() => {
        if (!chatListRef.current) return;
        chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }, [chatHistory, isHistoryLoading, isSendingMessage]);

    const getScrollRatio = (scrollTop: number, scrollHeight: number, clientHeight: number) => {
        const maxScroll = Math.max(scrollHeight - clientHeight, 0);
        if (maxScroll === 0) return 0;
        return Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    };

    const getEditorElement = () => {
        return editorPanelRef.current?.querySelector("textarea") ?? null;
    };

    const applyScrollToEditor = (ratio: number) => {
        const editor = getEditorElement();
        if (!editor) return;

        const maxScroll = Math.max(editor.scrollHeight - editor.clientHeight, 0);
        editor.scrollTop = ratio * maxScroll;
    };

    const applyScrollToPreview = (ratio: number) => {
        if (isHtmlPreview && !diffMode) {
            const iframe = htmlPreviewIframeRef.current;
            const win = iframe?.contentWindow;
            const doc = iframe?.contentDocument;
            if (!win || !doc) return;

            const root = doc.documentElement;
            const body = doc.body;
            const scrollHeight = Math.max(
                root?.scrollHeight ?? 0,
                body?.scrollHeight ?? 0,
            );
            const clientHeight = win.innerHeight;
            const maxScroll = Math.max(scrollHeight - clientHeight, 0);

            win.scrollTo({ top: ratio * maxScroll });
            return;
        }

        const preview = previewPanelRef.current;
        if (!preview) return;

        const maxScroll = Math.max(preview.scrollHeight - preview.clientHeight, 0);
        preview.scrollTop = ratio * maxScroll;
    };

    const syncPreviewFromEditor = () => {
        const editor = getEditorElement();
        if (!editor) return;

        const ratio = getScrollRatio(editor.scrollTop, editor.scrollHeight, editor.clientHeight);
        applyScrollToPreview(ratio);
    };

    const handleEditorScroll = () => {
        if (!edit) return;
        if (scrollingSourceRef.current === "preview") return;

        scrollingSourceRef.current = "editor";
        syncPreviewFromEditor();
        requestAnimationFrame(() => {
            if (scrollingSourceRef.current === "editor") {
                scrollingSourceRef.current = null;
            }
        });
    };

    const handlePreviewScroll = (scrollTop: number, scrollHeight: number, clientHeight: number) => {
        if (!edit) return;
        if (scrollingSourceRef.current === "editor") return;

        scrollingSourceRef.current = "preview";
        const ratio = getScrollRatio(scrollTop, scrollHeight, clientHeight);
        applyScrollToEditor(ratio);
        requestAnimationFrame(() => {
            if (scrollingSourceRef.current === "preview") {
                scrollingSourceRef.current = null;
            }
        });
    };

    useEffect(() => {
        return () => {
            iframeScrollCleanupRef.current?.();
        };
    }, []);

    useEffect(() => {
        iframeScrollCleanupRef.current?.();
        iframeScrollCleanupRef.current = null;

        if (!edit || !isHtmlPreview || diffMode) return;

        const iframe = htmlPreviewIframeRef.current;
        const win = iframe?.contentWindow;
        const doc = iframe?.contentDocument;
        if (!iframe || !win || !doc) return;

        const onIframeScroll = () => {
            const root = doc.documentElement;
            const body = doc.body;
            const scrollTop = win.scrollY;
            const scrollHeight = Math.max(
                root?.scrollHeight ?? 0,
                body?.scrollHeight ?? 0,
            );
            const clientHeight = win.innerHeight;
            handlePreviewScroll(scrollTop, scrollHeight, clientHeight);
        };

        win.addEventListener("scroll", onIframeScroll, { passive: true });
        iframeScrollCleanupRef.current = () => {
            win.removeEventListener("scroll", onIframeScroll);
        };

        syncPreviewFromEditor();

        return () => {
            iframeScrollCleanupRef.current?.();
            iframeScrollCleanupRef.current = null;
        };
    }, [edit, isHtmlPreview, diffMode, previewSrcDoc]);

    useEffect(() => {
        if (!edit || !document) {
            hasAutoSwitchedToDiffRef.current = false;
            return;
        }

        const hasChanges = content !== (document.content || "");

        if (hasChanges && !hasAutoSwitchedToDiffRef.current) {
            setDiffMode(true);
            hasAutoSwitchedToDiffRef.current = true;
        }

        if (!hasChanges) {
            hasAutoSwitchedToDiffRef.current = false;
        }
    }, [edit, content, document]);

    const handleSend = async () => {
        if (!document || !chatInput.trim() || isSendingMessage) {
            toast.error("Please enter a prompt");
            return;
        }

        const prompt = chatInput.trim();

        setChatHistory((prev) => [
            ...prev,
            {
                role: "user",
                message: prompt,
                summary: "",
                create_at: new Date().toISOString(),
            },
        ]);
        setChatInput("");
        setIsSendingMessage(true);

        console.log("Sending prompt:", prompt);

        if (onRegenerate) {
            try {
                // Use parent's regenerate handler to sync state.
                await onRegenerate(document.document_id, prompt);
                console.log("Document regenerated successfully via parent handler");
                void loadSessionHistory(document.document_id);
            } catch (error) {
                console.error("Error regenerating document:", error);
                const errorMessage = error instanceof Error ? error.message : "Failed to regenerate document";
                toast.error(errorMessage);
            } finally {
                setIsSendingMessage(false);
            }
        } else {
            // Fallback to direct API call if no handler provided
            try {
                const response = await regenerateDocument(stepName, projectId, document.document_id, prompt);
                console.log("Regenerate document response:", response);
                console.log("Document preview modal.ts chatitput", prompt);
                if (response.status !== "error") {
                    toast.success("Document regenerated successfully");
                    if (response.result?.content) {
                        setContent(response.result.content);
                    }
                    onRegenerateSuccess?.();
                    void loadSessionHistory(document.document_id);
                } else {
                    throw new Error(response.message || "Failed to regenerate document");
                }
            } catch (error) {
                console.error("Error regenerating document:", error);
                const errorMessage = error instanceof Error ? error.message : "Failed to regenerate document";
                toast.error(errorMessage);
            } finally {
                setIsSendingMessage(false);
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
        if (isSaving) return;

        setIsSaving(true);
        try {
            if (!document) return;

            const trimmedContent = content.trim();
            if (!trimmedContent) {
                toast.error("Document content is required");
                return;
            }

            const response = await updateDocumentContent(
                stepName,
                projectId,
                document.document_id,
                trimmedContent,
            );

            if (response.status === "error") {
                throw new Error(response.message || "Failed to update document");
            }

            if (response.result?.content) {
                setContent(response.result.content);
            }

            toast.success("Document updated successfully");
        } catch (error) {
            console.error("Failed to update document:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to update document";
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleStructuredCodeChange = (nextValue: string) => {
        if (codeTab === "html") {
            setHtmlContent(nextValue);
            setContent(serializeStructuredHtmlCss(nextValue, cssContent, structuredFormat));
            return;
        }

        setCssContent(nextValue);
        setContent(serializeStructuredHtmlCss(htmlContent, nextValue, structuredFormat));
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

                            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                                {edit && (
                                    <Button
                                        variant="default"
                                        onClick={updateDocument}
                                        size="sm"
                                        disabled={isSaving || content.trim() === (document.content || "").trim()}
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
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
                            </div>
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
                                <div
                                    ref={chatListRef}
                                    className="flex-1 overflow-y-auto overflow-x-hidden mb-3 sm:mb-4 space-y-2 sm:space-y-3 min-h-0"
                                >
                                    {isHistoryLoading ? (
                                        <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Loading chat history...
                                        </div>
                                    ) : historyError ? (
                                        <div className="text-center text-red-500 text-xs sm:text-sm py-4 sm:py-8 break-words">
                                            {historyError}
                                        </div>
                                    ) : chatHistory.length === 0 ? (
                                        <div className="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm py-4 sm:py-8 break-words">
                                            Ask me to update your document!
                                        </div>
                                    ) : (
                                        chatHistory.map((item, index) => {
                                            const isUser = isUserRole(item.role);
                                            const aiSummary = item.summary?.trim();
                                            const displayText = isUser
                                                ? item.message
                                                : aiSummary === '""' || !aiSummary
                                                    ? `I changed this ${document.design_type || "document"}`
                                                    : item.summary;
                                            const normalizedDisplayText = displayText?.trim() || "";

                                            if (!normalizedDisplayText) {
                                                return null;
                                            }
                                            return (
                                                <div
                                                    key={`${item.create_at || "no-time"}-${index}`}
                                                    className={cn("flex", isUser ? "justify-end" : "justify-start")}
                                                >
                                                    <div
                                                        className={cn(
                                                            "max-w-[92%] rounded-lg px-2.5 py-2 text-xs sm:text-sm break-words",
                                                            isUser
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                                        )}
                                                    >
                                                        <p className="whitespace-pre-wrap">{normalizedDisplayText}</p>
                                                        {item.create_at && normalizedDisplayText ? (
                                                            <p
                                                                className={cn(
                                                                    "mt-1 text-[10px] sm:text-[11px]",
                                                                    isUser
                                                                        ? "text-blue-100"
                                                                        : "text-gray-500 dark:text-gray-400"
                                                                )}
                                                            >
                                                                {formatTimestamp(item.create_at)}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}

                                    {isSendingMessage ? (
                                        <div className="flex justify-start">
                                            <div className="max-w-[92%] rounded-lg px-2.5 py-2 text-xs sm:text-sm break-words bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    <span>Generating...</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <Textarea
                                        placeholder="Enter your prompt"
                                        className="min-h-[32px] sm:min-h-[36px] resize-none text-xs sm:text-sm w-full break-words"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        disabled={isRegenerating || isSendingMessage}
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
                                        disabled={isRegenerating || isSendingMessage || !chatInput.trim()}
                                    >
                                        {isRegenerating || isSendingMessage ? (
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
                                    <div ref={editorPanelRef} className="flex flex-col h-full min-h-0 min-w-0">
                                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex-shrink-0">
                                            Editor
                                        </h3>
                                        {isStructuredHtmlCss ? (
                                            <>
                                                <div className="flex border-b bg-gray-50 dark:bg-gray-800 rounded-t-lg overflow-hidden">
                                                    <button
                                                        className={cn(
                                                            "px-4 py-2 font-medium transition-colors text-xs sm:text-sm",
                                                            codeTab === "html"
                                                                ? "bg-blue-500 text-white"
                                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        )}
                                                        onClick={() => setCodeTab("html")}
                                                    >
                                                        HTML
                                                    </button>
                                                    <button
                                                        className={cn(
                                                            "px-4 py-2 font-medium transition-colors text-xs sm:text-sm",
                                                            codeTab === "css"
                                                                ? "bg-blue-500 text-white"
                                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        )}
                                                        onClick={() => setCodeTab("css")}
                                                    >
                                                        CSS
                                                    </button>
                                                </div>
                                                <Textarea
                                                    value={codeTab === "html" ? htmlContent : cssContent}
                                                    onChange={(e) => handleStructuredCodeChange(e.target.value)}
                                                    onScroll={handleEditorScroll}
                                                    className="flex-1 w-full p-2 sm:p-4 text-xs sm:text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-b-lg resize-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-0"
                                                    placeholder={`Edit ${codeTab.toUpperCase()} here...`}
                                                />
                                            </>
                                        ) : (
                                            <Textarea
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                onScroll={handleEditorScroll}
                                                className="flex-1 w-full p-2 sm:p-4 text-xs sm:text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-0"
                                                placeholder="Edit your document here..."
                                            />
                                        )}
                                    </div>

                                    {/* Preview Panel */}
                                    <div className="flex flex-col h-full min-h-0 min-w-0">
                                        <div className="flex items-center justify-between mb-2 flex-shrink-0">
                                            <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {diffMode ? "Diff View" : "Live Preview"}
                                            </h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 gap-1 text-xs"
                                                onClick={() => setDiffMode((v) => !v)}
                                            >
                                                {diffMode ? (
                                                    <><Eye className="w-3 h-3" /> Preview</>
                                                ) : (
                                                    <><GitCompare className="w-3 h-3" /> Diff</>
                                                )}
                                            </Button>
                                        </div>
                                        <div
                                            ref={previewPanelRef}
                                            onScroll={(e) => {
                                                const target = e.currentTarget;
                                                handlePreviewScroll(
                                                    target.scrollTop,
                                                    target.scrollHeight,
                                                    target.clientHeight,
                                                );
                                            }}
                                            className={cn(
                                            "flex-1 overflow-y-auto overflow-x-hidden border rounded-lg min-h-0",
                                            diffMode
                                                ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                                                : "border-gray-300 bg-white"
                                        )}>
                                            {diffMode ? (
                                                <DiffView
                                                    original={document.content || ""}
                                                    modified={content}
                                                />
                                            ) : isHtmlPreview ? (
                                                <iframe
                                                    ref={htmlPreviewIframeRef}
                                                    onLoad={syncPreviewFromEditor}
                                                    srcDoc={previewSrcDoc}
                                                    title="html-live-preview"
                                                    sandbox="allow-scripts"
                                                    className="h-full w-full border-0 bg-white"
                                                />
                                            ) : (
                                                <MarkdownWithMermaid content={content} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-0 min-w-0 overflow-y-auto overflow-x-hidden border border-gray-300 rounded-lg bg-white p-2 sm:p-4">
                                    {isHtmlPreview ? (
                                        <iframe
                                            srcDoc={previewSrcDoc}
                                            title="html-document-preview"
                                            sandbox="allow-scripts"
                                            className="h-full w-full border-0 bg-white"
                                        />
                                    ) : (
                                        <MarkdownWithMermaid content={content || "No content available"} />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
