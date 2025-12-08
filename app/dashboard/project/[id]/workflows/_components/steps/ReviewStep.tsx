'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Eye, FileText, Layout, BarChart3 } from "lucide-react";
import PreviewModal from "../PreviewModal";

interface SubItem {
    id: string;
    name: string;
}

interface Document {
    id: string;
    name: string;
    description: string;
    subItems?: SubItem[];
}

interface ReviewStepProps {
    requirements: string;
    generatedSRS: string;
    generatedDiagrams: string[];
    generatedWireframes: string[];
    onBack: () => void;
    onComplete: () => void;
    onRestart: () => void;
}

type PreviewType = 'diagram' | 'srs' | 'wireframe' | null;

// Document definitions from each step
const planningDocuments: Document[] = [
    {
        id: "project-charter",
        name: "Project Charter Document",
        description: "Core project initiation documents",
        subItems: [
            { id: "stakeholder-register", name: "Stakeholder Register" },
            { id: "high-level-requirements", name: "High-level Requirements" },
            { id: "requirements-management-plan", name: "Requirements Management Plan" }
        ]
    },
    {
        id: "business-case",
        name: "Business Case Document",
        description: "Justification and cost-benefit analysis"
    },
    {
        id: "scope-statement",
        name: "Scope Statement Document",
        description: "Project scope and deliverables"
    },
    {
        id: "product-roadmap",
        name: "Product Roadmap Document",
        description: "Timeline and milestones"
    }
];

const analysisDocuments: Document[] = [
    {
        id: "feasibility-study",
        name: "Feasibility Study Report",
        description: "Technical, operational, and economic feasibility"
    },
    {
        id: "cost-benefit-analysis",
        name: "Cost-Benefit Analysis Document",
        description: "Financial analysis of costs vs benefits"
    },
    {
        id: "risk-register",
        name: "Risk Register Document",
        description: "Risk identification and mitigation"
    },
    {
        id: "compliance",
        name: "Compliance Document",
        description: "Legal and regulatory requirements"
    }
];

const designDocuments: Document[] = [
    {
        id: "srs",
        name: "Software Requirement Specification",
        description: "Functional and non-functional requirements"
    },
    {
        id: "hld",
        name: "HLD (High-Level Design)",
        description: "System-level architecture",
        subItems: [
            { id: "hld-arch", name: "System Architecture Diagram" },
            { id: "hld-cloud", name: "Cloud Infrastructure Setup" },
            { id: "hld-tech", name: "Tech Stack Selection" }
        ]
    },
    {
        id: "lld",
        name: "LLD (Low-Level Design)",
        description: "Component-level design",
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
        description: "Visual design assets",
        subItems: [
            { id: "uiux-wireframe", name: "Wireframes" },
            { id: "uiux-mockup", name: "Mockups" },
            { id: "uiux-prototype", name: "Prototypes" }
        ]
    },
    {
        id: "rtm",
        name: "RTM (Requirements Traceability Matrix)",
        description: "Requirements mapping"
    }
];


export default function ReviewStep({
    requirements,
    generatedSRS,
    generatedDiagrams,
    generatedWireframes,
    onBack,
    onComplete,
    onRestart
}: ReviewStepProps) {
    const [previewType, setPreviewType] = useState<PreviewType>(null);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [previewContent, setPreviewContent] = useState<string>("");

    const handleViewDocument = (docId: string, type: PreviewType) => {
        setPreviewType(type);
        setSelectedItem(docId);
    };

    const handleClosePreview = () => {
        setPreviewType(null);
        setSelectedItem(null);
        setPreviewContent("");
    };

    // Mock: All documents are assumed to be generated for demo purposes
    // In real implementation, filter based on actual selection state passed from parent
    const hasGeneratedDocs = generatedDiagrams.length > 0 || generatedSRS || generatedWireframes.length > 0;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Final Review
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Review all generated documents from Planning, Analysis, and Design steps
                </p>
            </div>

            <div className="space-y-6">
                {/* Planning Step Documents */}
                {generatedDiagrams.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Planning Step Documents
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {planningDocuments.length} document type(s) available
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {planningDocuments.map((doc) => (
                                <div key={doc.id} className="space-y-2">
                                    {/* Parent Document */}
                                    {!doc.subItems && (
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
                                                onClick={() => handleViewDocument(doc.id, 'diagram')}
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Button>
                                        </div>
                                    )}

                                    {/* Parent with Sub-items */}
                                    {doc.subItems && (
                                        <>
                                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {doc.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {doc.subItems.length} sub-document(s)
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Sub-items */}
                                            <div className="ml-12 space-y-2">
                                                {doc.subItems.map((subItem) => (
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
                                                            onClick={() => handleViewDocument(subItem.id, 'diagram')}
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
                            ))}
                        </div>
                    </div>
                )}

                {/* Analysis Step Documents */}
                {generatedSRS && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded">
                                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Analysis Step Documents
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {analysisDocuments.length} document(s) available
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {analysisDocuments.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                >
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
                                        onClick={() => handleViewDocument(doc.id, 'srs')}
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Design Step Documents */}
                {generatedWireframes.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                                <Layout className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Design Step Documents
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {designDocuments.length} document type(s) available
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {designDocuments.map((doc) => (
                                <div key={doc.id} className="space-y-2">
                                    {/* Parent Document */}
                                    {!doc.subItems && (
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
                                                onClick={() => handleViewDocument(doc.id, 'wireframe')}
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Button>
                                        </div>
                                    )}

                                    {/* Parent with Sub-items */}
                                    {doc.subItems && (
                                        <>
                                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {doc.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {doc.subItems.length} sub-document(s)
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Sub-items */}
                                            <div className="ml-12 space-y-2">
                                                {doc.subItems.map((subItem) => (
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
                                                            onClick={() => handleViewDocument(subItem.id, 'wireframe')}
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
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            {previewType && (
                <PreviewModal
                    isOpen={!!previewType}
                    onClose={handleClosePreview}
                    type={previewType}
                    title={(() => {
                        if (!selectedItem) return "Document Preview";

                        // Search in all document arrays
                        const allDocs = [...planningDocuments, ...analysisDocuments, ...designDocuments];

                        // Find in main documents
                        const mainDoc = allDocs.find(doc => doc.id === selectedItem);
                        if (mainDoc) return mainDoc.name;

                        // Find in sub-items
                        for (const doc of allDocs) {
                            if (doc.subItems) {
                                const subItem = doc.subItems.find(sub => sub.id === selectedItem);
                                if (subItem) return `${doc.name} - ${subItem.name}`;
                            }
                        }
                        return "Document Preview";
                    })()}
                    content={previewContent}
                />
            )}

            <div className="flex justify-center items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                <Button onClick={onComplete} className="gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Workflow
                </Button>
                <Button variant="outline" onClick={onRestart}>
                    Start New Workflow
                </Button>
            </div>
        </div>
    );
}
