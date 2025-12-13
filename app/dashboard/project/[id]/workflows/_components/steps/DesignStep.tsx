'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, Layout, CheckCircle2, Sparkles, Eye, ChevronDown, ChevronRight } from "lucide-react";
import PromptWithFileSelection from "../PromptWithFileSelection";
import { WireframeIcon } from "@/components/icons";
import PreviewModal from "../PreviewModal";
import { all } from "axios";

interface SubItem {
    id: string;
    name: string;
}

interface DesignDocument {
    id: string;
    name: string;
    description: string;
    subItems?: SubItem[];
}

const designDocuments: DesignDocument[] = [
    {
        id: "srs",
        name: "Software Requirement Specification",
        description: "Comprehensive documentation of functional and non-functional requirements"
    },
    {
        id: "hld",
        name: "HLD (High-Level Design)",
        description: "System-level architecture and design decisions",
        subItems: [
            { id: "hld-arch", name: "System Architecture Diagram" },
            { id: "hld-cloud", name: "Cloud Infrastructure (AWS/Azure) Setup" },
            { id: "hld-tech", name: "Tech Stack Selection" }
        ]
    },
    {
        id: "lld",
        name: "LLD (Low-Level Design)",
        description: "Detailed component-level design and implementation specifications",
        subItems: [
            { id: "lld-arch", name: "Architecture Diagrams" },
            { id: "lld-db", name: "Database Schemas" },
            { id: "lld-api", name: "API Specifications" },
            { id: "lld-pseudo", name: "Pseudocode" }
        ]
    },
    {
        id: "uiux",
        name: "UI/UX Design Kit",
        description: "Visual design assets and interactive prototypes",
        subItems: [
            { id: "uiux-wireframe", name: "Wireframes" },
            { id: "uiux-mockup", name: "Mockups" },
            { id: "uiux-prototype", name: "Prototypes" }
        ]
    },
    {
        id: "rtm",
        name: "RTM (Requirements Traceability Matrix)",
        description: "Mapping of requirements to design, implementation, and test cases"
    }
];

interface DesignStepProps {
    generatedWireframes: string[];
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
}

export default function DiagramStep({
    generatedWireframes,
    onGenerate,
    onNext,
    onBack
}: DesignStepProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const allDocIds = designDocuments.flatMap(doc =>
        doc.subItems ? doc.subItems.map(sub => sub.id) : [doc.id]
    );
    const [selectedDesignDocs, setSelectedDesignDocs] = useState<string[]>(allDocIds);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [previewWireframe, setPreviewWireframe] = useState<string | null>(null);
    const [previewDocument, setPreviewDocument] = useState<string | null>(null);

    const handleGenerateWireframes = () => {
        console.log("Sending prompt:", prompt);
        console.log("Selected files:", selectedFiles);
        onGenerate();
    };

    const handleViewWireframe = (wireframe: string) => {
        setPreviewWireframe(wireframe);
    };

    const handleClosePreview = () => {
        setPreviewWireframe(null);
        setPreviewDocument(null);
    };

    const handleDocumentToggle = (docId: string) => {
        setSelectedDesignDocs(prev =>
            prev.includes(docId)
                ? prev.filter(id => id !== docId)
                : [...prev, docId]
        );
    };

    const handleToggleExpand = (docId: string) => {
        setExpandedItems(prev =>
            prev.includes(docId)
                ? prev.filter(id => id !== docId)
                : [...prev, docId]
        );
    };

    const handlePreviewDocument = (docId: string) => {
        setPreviewDocument(docId);
    };

    const isDocumentSelected = (doc: DesignDocument) => {
        if (selectedDesignDocs.includes(doc.id)) return true;
        if (doc.subItems) {
            return doc.subItems.some(sub => selectedDesignDocs.includes(sub.id));
        }
        return false;
    };

    const isDocumentIndeterminate = (doc: DesignDocument) => {
        if (!doc.subItems) return false;
        const selectedSubItems = doc.subItems.filter(sub => selectedDesignDocs.includes(sub.id));
        return selectedSubItems.length > 0 && selectedSubItems.length < doc.subItems.length;
    };

    const handleParentToggle = (doc: DesignDocument) => {
        if (!doc.subItems) {
            handleDocumentToggle(doc.id);
            return;
        }

        const allSelected = doc.subItems.every(sub => selectedDesignDocs.includes(sub.id));
        if (allSelected) {
            // Deselect all sub-items
            setSelectedDesignDocs(prev =>
                prev.filter(id => !doc.subItems!.some(sub => sub.id === id))
            );
        } else {
            // Select all sub-items
            const subItemIds = doc.subItems.map(sub => sub.id);
            setSelectedDesignDocs(prev => [
                ...prev.filter(id => !doc.subItems!.some(sub => sub.id === id)),
                ...subItemIds
            ]);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Design Step
                </h2>
            </div>

            {/* Document Selection Section */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Select Documents to Generate
                </label>
                <div className="space-y-2">
                    {designDocuments.map((doc) => (
                        <div key={doc.id} className="space-y-2">
                            {/* Main Document Row */}
                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                                <div className="flex items-center gap-2">
                                    {doc.subItems && (
                                        <button
                                            onClick={() => handleToggleExpand(doc.id)}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                        >
                                            {expandedItems.includes(doc.id) ? (
                                                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            )}
                                        </button>
                                    )}
                                    <Checkbox
                                        id={doc.id}
                                        checked={isDocumentSelected(doc)}
                                        onCheckedChange={() => handleParentToggle(doc)}
                                        className="flex-shrink-0"
                                        data-indeterminate={isDocumentIndeterminate(doc)}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <label
                                        htmlFor={doc.id}
                                        className="block font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                                    >
                                        {doc.name}
                                    </label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {doc.description}
                                    </p>
                                </div>
                                {!doc.subItems && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 flex-shrink-0"
                                        onClick={() => handlePreviewDocument(doc.id)}
                                    >
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </Button>
                                )}
                            </div>

                            {/* Sub-items */}
                            {doc.subItems && expandedItems.includes(doc.id) && (
                                <div className="ml-12 space-y-2">
                                    {doc.subItems.map((subItem) => (
                                        <div
                                            key={subItem.id}
                                            className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                                        >
                                            <Checkbox
                                                id={subItem.id}
                                                checked={selectedDesignDocs.includes(subItem.id)}
                                                onCheckedChange={() => handleDocumentToggle(subItem.id)}
                                                className="flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <label
                                                    htmlFor={subItem.id}
                                                    className="block text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                                                >
                                                    {subItem.name}
                                                </label>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-2 flex-shrink-0 text-xs"
                                                onClick={() => handlePreviewDocument(subItem.id)}
                                            >
                                                <Eye className="w-3 h-3" />
                                                Preview
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <PromptWithFileSelection
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedFiles={selectedFiles}
                onSelectedFilesChange={setSelectedFiles}
                placeholder="Enter prompt supporting AI to generate some documents related to Design step..."
                label="Prompt & Reference Files (Optional)"
            />

            {/* Generated Design Documents Section */}
            {generatedWireframes.length > 0 && selectedDesignDocs.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Generated Documents
                            </label>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {selectedDesignDocs.length} document(s) created
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {designDocuments.map((doc) => {
                            // Check if this parent document has any selected sub-items
                            const selectedSubItems = doc.subItems?.filter(sub =>
                                selectedDesignDocs.includes(sub.id)
                            ) || [];

                            // Check if parent itself is selected (for non-parent items)
                            const isParentSelected = !doc.subItems && selectedDesignDocs.includes(doc.id);

                            // Only show if parent is selected OR has selected sub-items
                            if (!isParentSelected && selectedSubItems.length === 0) return null;

                            return (
                                <div key={doc.id} className="space-y-2">
                                    {/* Main Document Row */}
                                    {isParentSelected && (
                                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {doc.name}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {doc.description}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2 flex-shrink-0"
                                                onClick={() => handlePreviewDocument(doc.id)}
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Button>
                                        </div>
                                    )}

                                    {/* Parent with Sub-items */}
                                    {selectedSubItems.length > 0 && (
                                        <>
                                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {doc.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {selectedSubItems.length} sub-document(s) selected
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Selected Sub-items */}
                                            <div className="ml-12 space-y-2">
                                                {selectedSubItems.map((subItem) => (
                                                    <div
                                                        key={subItem.id}
                                                        className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
                                                    >
                                                        <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {subItem.name}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="gap-2 flex-shrink-0 text-xs"
                                                            onClick={() => handlePreviewDocument(subItem.id)}
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            View
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Preview Modals */}
            <PreviewModal
                isOpen={!!previewWireframe}
                onClose={handleClosePreview}
                type="wireframe"
                title={`${previewWireframe || ""} - Preview`}
            />

            {previewDocument && (
                <PreviewModal
                    isOpen={!!previewDocument}
                    onClose={handleClosePreview}
                    type="diagram"
                    title={(() => {
                        // Find document name from main items
                        const mainDoc = designDocuments.find(doc => doc.id === previewDocument);
                        if (mainDoc) return mainDoc.name;

                        // Find document name from sub-items
                        for (const doc of designDocuments) {
                            if (doc.subItems) {
                                const subItem = doc.subItems.find(sub => sub.id === previewDocument);
                                if (subItem) return `${doc.name} - ${subItem.name}`;
                            }
                        }
                        return "Document Preview";
                    })()}
                />
            )}

            <div className="flex justify-center items-center gap-3">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                {generatedWireframes.length === 0 ? (
                    <Button onClick={handleGenerateWireframes} className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate
                    </Button>
                ) : (
                    <Button onClick={onNext} className="gap-2">
                        Continue to Review
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
