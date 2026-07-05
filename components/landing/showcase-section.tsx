"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import {
  FileText,
  Terminal,
  ChevronRight,
  FolderOpen,
  Sparkles,
  Play
} from "lucide-react";
import type { ShowcaseData, ShowcaseDocument } from "@/lib/showcase";
import "github-markdown-css/github-markdown-light.css";
import mermaid from "mermaid"

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

let mermaidInitialized = false;

const ensureMermaidInitialized = () => {
  if (mermaidInitialized) return;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    suppressErrorRendering: true
  });
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
      let id;
      try {
        ensureMermaidInitialized();
        const uniq =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        id = `mermaid-${uniq}`;

        // Use mermaid.parse to check if the syntax is valid before rendering.
        // This prevents continuous error throwing while the code is being typed.
        try {
          await mermaid.parse(cleaned, { suppressErrors: true });
        } catch (parseError) {
          // Syntax is incomplete/invalid. Show raw text and skip rendering.
          if (ref.current) ref.current.textContent = cleaned;
          return;
        }

        const { svg } = await mermaid.render(id, cleaned);

        if (isCancelled || !ref.current) return;
        ref.current.innerHTML = svg;
        ref.current.classList.remove("mermaid");
      } catch (error) {
        if (!ref.current) return;
        ref.current.textContent = cleaned;
        const errorContainer = document.getElementById(`d${id}`);
        if (errorContainer) {
          errorContainer.remove();
        }
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

const markdownComponents = {
  code({ className, children }: any) {
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
};

const MarkdownWithMermaid = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
};

export function ShowcaseSection({ data }: { data: ShowcaseData }) {
  const [activeDoc, setActiveDoc] = useState<ShowcaseDocument | null>(data.input);
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!activeDoc) return;

    // If it's the input, show instantly.
    if (activeDoc.phase === "Input") {
      setDisplayedContent(activeDoc.content);
      setIsTyping(false);
      return;
    }

    // AI Typing effect for outputs
    setIsTyping(true);
    setDisplayedContent("");

    let currentIndex = 0;
    const fullText = activeDoc.content;
    const chunkSize = Math.max(15, Math.floor(fullText.length / 100)); // Adjust speed based on length

    // Find all mermaid block ranges to skip typing them
    const mermaidRanges: { start: number; end: number }[] = [];
    const regex = /```mermaid[\s\S]*?```/g;
    let match;
    while ((match = regex.exec(fullText)) !== null) {
      mermaidRanges.push({ start: match.index, end: match.index + match[0].length });
    }

    const typingInterval = setInterval(() => {
      currentIndex += chunkSize;

      // Fast-forward if current index falls inside a mermaid block
      for (const range of mermaidRanges) {
        if (currentIndex > range.start && currentIndex < range.end) {
          currentIndex = range.end;
          break;
        }
      }

      if (currentIndex >= fullText.length) {
        setDisplayedContent(fullText);
        setIsTyping(false);
        clearInterval(typingInterval);
      } else {
        setDisplayedContent(fullText.substring(0, currentIndex));
      }
    }, 20); // 20ms per chunk

    return () => clearInterval(typingInterval);
  }, [activeDoc]);

  if (!data.input) return null;

  const renderNavSection = (
    title: string,
    docs: ShowcaseDocument[],
    icon: React.ReactNode,
    isInput: boolean = false
  ) => {
    if (docs.length === 0 && !isInput) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 px-3 mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
          {icon}
          {title}
        </div>
        <div className="space-y-1">
          {isInput && data.input ? (
            <button
              onClick={() => setActiveDoc(data.input)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left ${activeDoc?.id === data.input.id
                ? "bg-blue-600 text-white font-medium shadow-sm"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
            >
              <Terminal className={`w-4 h-4 ${activeDoc?.id === data.input.id ? "text-white" : "text-slate-400"}`} />
              <span className="truncate">{data.input.name} (Input)</span>
            </button>
          ) : (
            docs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left ${activeDoc?.id === doc.id
                  ? "bg-blue-50 text-blue-700 font-medium border border-blue-200"
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
              >
                <FileText className={`w-4 h-4 ${activeDoc?.id === doc.id ? "text-blue-600" : "text-slate-400"}`} />
                <span className="truncate">{doc.name}</span>
                {activeDoc?.id === doc.id && isTyping && (
                  <span className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="showcase" className="bg-slate-50 py-20 lg:py-32 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500 opacity-10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1240px] mx-auto p-4 md:p-8 relative z-10">
        <div className="text-center mb-12 max-w-[800px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 shadow-sm rounded-full px-4 py-1 text-[11px] font-bold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Live Project Showcase
          </div>
          <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.2] text-slate-900 mb-4">
            See the <em className="text-blue-600">Magic</em> in Action
          </h2>
          <p className="text-[16px] md:text-[18px] text-slate-600 leading-[1.7]">
            Select the input brief below, then browse through the comprehensive Business Analysis artifacts generated automatically across all project phases.
          </p>
        </div>

        {/* Browser/Editor Window Mockup */}
        <div className="flex flex-col lg:flex-row gap-0 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden min-h-[700px] max-h-[850px]">

          {/* Sidebar */}
          <div className="w-full lg:w-[320px] bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto max-h-[300px] lg:max-h-full">
            <div className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50/95 backdrop-blur z-10">
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#EAB308]" />
                <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                <span className="ml-2 text-xs text-slate-500 font-mono">workspace/showcase</span>
              </div>
            </div>

            <div className="p-4">
              {renderNavSection("Problem Statement", [], <Terminal className="w-3.5 h-3.5" />, true)}
              <div className="my-6 border-t border-slate-200" />
              {renderNavSection("Planning Phase", data.planning, <FolderOpen className="w-3.5 h-3.5" />)}
              {renderNavSection("Analysis Phase", data.analysis, <FolderOpen className="w-3.5 h-3.5" />)}
              {renderNavSection("Design Phase", data.design, <FolderOpen className="w-3.5 h-3.5" />)}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-b border-slate-200">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-slate-500 text-sm whitespace-nowrap hidden sm:inline">Viewing:</span>
                <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-md border border-slate-200 text-sm text-slate-700 shadow-sm max-w-full truncate">
                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="truncate font-mono text-xs">{activeDoc?.id}</span>
                </div>
              </div>
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-blue-600 animate-pulse whitespace-nowrap bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  <Play className="w-3 h-3" /> Generating...
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
              <div className="max-w-[800px] mx-auto">
                {activeDoc?.phase === 'Input' ? (
                  <div className="markdown-body !bg-transparent !text-slate-800 p-2 sm:p-4" style={{ colorScheme: 'light' }}>
                    <MarkdownWithMermaid content={displayedContent} />
                  </div>
                ) : (
                  <div className="markdown-body !bg-transparent !text-slate-800 p-2 sm:p-4" style={{ colorScheme: 'light' }}>
                    <MarkdownWithMermaid content={displayedContent} />
                    {isTyping && (
                      <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse align-middle" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F8FAFC;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
        /* Custom markdown overrides for light mode */
        .markdown-body {
          font-family: inherit;
        }
        .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {
          color: #0F172A !important;
          border-bottom-color: #E2E8F0 !important;
        }
        .markdown-body table tr {
          background-color: transparent !important;
          border-top-color: #E2E8F0 !important;
        }
        .markdown-body table th, .markdown-body table td {
          border-color: #E2E8F0 !important;
        }
        .markdown-body table tr:nth-child(2n) {
          background-color: #F8FAFC !important;
        }
        .markdown-body blockquote {
          color: #64748B !important;
          border-left-color: #CBD5E1 !important;
        }
        .markdown-body code {
          background-color: #F1F5F9 !important;
        }
        .markdown-body pre {
          background-color: #F8FAFC !important;
          border: 1px solid #E2E8F0 !important;
        }
      `}} />
    </section>
  );
}
