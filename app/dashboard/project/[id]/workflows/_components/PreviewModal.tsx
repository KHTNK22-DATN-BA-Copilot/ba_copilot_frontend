'use client';

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";
import remarkGfm from "remark-gfm";
import { createPortal } from 'react-dom';


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

type PreviewType = 'diagram' | 'srs' | 'wireframe' | 'document' | 'markdown';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    type?: PreviewType;
    title: string;
    content?: string;
}

export default function PreviewModal({
    isOpen,
    onClose,
    type = 'document',
    title,
    content
}: PreviewModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Prevent background scrolling when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Auto-detect type based on content if not specified or if type is generic
    const detectedType = React.useMemo(() => {
        if (type === 'wireframe' || type === 'diagram') return type;
        if (!content) return type || 'document';

        // Check if content contains mermaid diagram
        if (content.includes('```mermaid')) return 'diagram';

        // Check if content is HTML (wireframe)
        if (content.trim().startsWith('<!DOCTYPE') || content.trim().startsWith('<html')) {
            return 'wireframe';
        }

        // Default to document for markdown content
        return 'document';
    }, [content, type]);

    if (!isOpen || !mounted) return null;

    const getMockWireframeContent = (wireframeName: string) => {
        const mockHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">
                <header style="background: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h1 style="margin: 0;">${wireframeName}</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Wireframe Preview</p>
                </header>
                
                <nav style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; gap: 15px;">
                    <a href="#" style="color: #2563eb; text-decoration: none; font-weight: 500;">Home</a>
                    <a href="#" style="color: #6b7280; text-decoration: none;">About</a>
                    <a href="#" style="color: #6b7280; text-decoration: none;">Services</a>
                    <a href="#" style="color: #6b7280; text-decoration: none;">Contact</a>
                </nav>

                <main style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <section style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                        <h2 style="color: #1f2937; margin-top: 0;">Main Content Area</h2>
                        <p style="color: #6b7280; line-height: 1.6;">
                            This is a mock wireframe preview for ${wireframeName}.
                        </p>
                        <button style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-top: 10px;">
                            Call to Action
                        </button>
                    </section>

                    <aside style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                        <h3 style="color: #1f2937; margin-top: 0;">Sidebar</h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="padding: 10px; background: #f9fafb; margin-bottom: 8px; border-radius: 4px;">Widget 1</li>
                            <li style="padding: 10px; background: #f9fafb; margin-bottom: 8px; border-radius: 4px;">Widget 2</li>
                            <li style="padding: 10px; background: #f9fafb; border-radius: 4px;">Widget 3</li>
                        </ul>
                    </aside>
                </main>

                <footer style="background: #1f2937; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <p style="margin: 0;">&copy; 2025 ${wireframeName} - Mock Wireframe</p>
                </footer>
            </div>
        `;

        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${wireframeName}</title></head><body style="margin: 0; padding: 0; background: #f9fafb;">${mockHtml}</body></html>`;
    };

    const getMockDiagramContent = (diagramName: string) => {
        return `
\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
\`\`\`

### ${diagramName}

This is a sample diagram. Replace this with actual diagram data from your API.

**Features:**
- Full mermaid diagram support
- Markdown rendering
- Dark mode compatible
        `;
    };

    const getMockSRSContent = () => {
        return `# Software Requirements Specification

## 1. Introduction

This is a sample SRS document. Replace this with actual SRS content from your API.

### 1.1 Purpose
Define the purpose of this SRS document and the software system to be developed.

### 1.2 Scope
Describe the scope of the software system, including:
- Major functions
- User characteristics
- Constraints and assumptions

## 2. Functional Requirements

### 2.1 User Authentication
- **FR-001**: The system shall allow users to register with email and password
- **FR-002**: The system shall authenticate users before granting access
- **FR-003**: The system shall support password reset functionality

### 2.2 Data Management
- **FR-004**: The system shall allow CRUD operations on user data
- **FR-005**: The system shall validate all input data

## 3. Non-Functional Requirements

### 3.1 Performance
- The system shall support 1000 concurrent users
- Response time shall be less than 2 seconds

### 3.2 Security
- All data transmission shall be encrypted
- User passwords shall be hashed

**Note:** This is sample content. Actual SRS will be generated based on your requirements.`;
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {title}
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="gap-2"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Modal Content */}
                <div className="overflow-auto p-4" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                    {detectedType === 'diagram' && (
                        <div className="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-4">
                            <MarkdownWithMermaid content={content || getMockDiagramContent(title)} />
                        </div>
                    )}

                    {(detectedType === 'srs' || detectedType === 'document' || detectedType === 'markdown') && (
                        <div className="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-6">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content || getMockSRSContent()}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}

                    {detectedType === 'wireframe' && (
                        <div className="h-[calc(90vh-80px)] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                            <iframe
                                srcDoc={content || getMockWireframeContent(title)}
                                title="wireframe-preview"
                                sandbox="allow-scripts"
                                className="w-full h-full border-0"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}