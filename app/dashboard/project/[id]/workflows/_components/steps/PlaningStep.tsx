'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Eye, ChevronDown, ChevronRight } from "lucide-react";
import { DiagramIcon } from "@/components/icons/project-icons";
import PromptWithFileSelection from "../PromptWithFileSelection";
import PreviewModal from "../PreviewModal";

interface DiagramsStepProps {
    generatedDiagrams: string[];
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
}

interface SubItem {
    id: string;
    name: string;
}

interface PlanningDocument {
    id: string;
    name: string;
    description: string;
    subItems?: SubItem[];
}

const planningDocuments: PlanningDocument[] = [
    {
        id: "project-charter",
        name: "Project Charter Document",
        description: "Core project initiation documents including objectives, scope, and stakeholders",
        subItems: [
            { id: "stakeholder-register", name: "Stakeholder Register" },
            { id: "high-level-requirements", name: "High-level Requirements" },
            { id: "requirements-management-plan", name: "Requirements Management Plan" }
        ]
    },
    {
        id: "business-case",
        name: "Business Case Document",
        description: "Justification for the project with cost-benefit analysis and strategic alignment"
    },
    {
        id: "scope-statement",
        name: "Scope Statement Document",
        description: "Detailed project scope, deliverables, and boundaries definition"
    },
    {
        id: "product-roadmap",
        name: "Product Roadmap Document",
        description: "High-level timeline and milestones for project delivery phases"
    }
];

export default function DiagramsStep({
    generatedDiagrams,
    onGenerate,
    onNext,
    onBack
}: DiagramsStepProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [selectedPlanningDocs, setSelectedPlanningDocs] = useState<string[]>([]);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [previewDiagram, setPreviewDiagram] = useState<string | null>(null);
    const [previewDocument, setPreviewDocument] = useState<string | null>(null);
    const [previewContent, setPreviewContent] = useState<string>("");

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
        setPreviewDocument(null);
    };

    const handleDocumentToggle = (docId: string) => {
        setSelectedPlanningDocs(prev =>
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

    const isDocumentSelected = (doc: PlanningDocument) => {
        if (selectedPlanningDocs.includes(doc.id)) return true;
        if (doc.subItems) {
            return doc.subItems.some(sub => selectedPlanningDocs.includes(sub.id));
        }
        return false;
    };

    const isDocumentIndeterminate = (doc: PlanningDocument) => {
        if (!doc.subItems) return false;
        const selectedSubItems = doc.subItems.filter(sub => selectedPlanningDocs.includes(sub.id));
        return selectedSubItems.length > 0 && selectedSubItems.length < doc.subItems.length;
    };

    const handleParentToggle = (doc: PlanningDocument) => {
        if (!doc.subItems) {
            handleDocumentToggle(doc.id);
            return;
        }

        const allSelected = doc.subItems.every(sub => selectedPlanningDocs.includes(sub.id));
        if (allSelected) {
            // Deselect all sub-items
            setSelectedPlanningDocs(prev =>
                prev.filter(id => !doc.subItems!.some(sub => sub.id === id))
            );
        } else {
            // Select all sub-items
            const subItemIds = doc.subItems.map(sub => sub.id);
            setSelectedPlanningDocs(prev => [
                ...prev.filter(id => !doc.subItems!.some(sub => sub.id === id)),
                ...subItemIds
            ]);
        }
    };

    const handlePreviewDocument = async (docId: string) => {
        setPreviewDocument(docId);

        // Map document IDs to their respective markdown files
        const documentFiles: Record<string, string> = {
            "project-charter": "/mock/planning/charter/charter_docs_template.md",
            "stakeholder-register": "/mock/planning/charter/stakeholder_register_template.md",
            "high-level-requirements": "/mock/planning/charter/high_level_requirements_template.md",
            "requirements-management-plan": "/mock/planning/charter/requirements_management_plan_template.md",
            "business-case": "/mock/planning/business_case_template.md",
            "scope-statement": "/mock/planning/scope_statement_template.md",
            "product-roadmap": "/mock/planning/product_roadmap_template.md"
        };

        const filePath = documentFiles[docId];
        if (filePath) {
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    const content = await response.text();
                    setPreviewContent(content);
                } else {
                    setPreviewContent(`# ${planningDocuments.find(doc => doc.id === docId)?.name}\n\nContent not available yet.`);
                }
            } catch (error) {
                console.error("Error fetching document:", error);
                setPreviewContent(`# ${planningDocuments.find(doc => doc.id === docId)?.name}\n\nError loading content.`);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Planning Step
                </h2>
            </div>

            {/* Document Selection Section */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Select type of Documents to Generate
                </label>
                <div className="space-y-2">
                    {planningDocuments.map((doc) => (
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
                                                checked={selectedPlanningDocs.includes(subItem.id)}
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
                placeholder="
                "
                label="Prompt & Reference Files for Planning Step (Optional)"
            />

            {/* Generated File of Planning Section */}
            {generatedDiagrams.length > 0 && selectedPlanningDocs.length > 0 && (
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
                                {selectedPlanningDocs.length} document(s) created
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {planningDocuments.map((doc) => {
                            // Check if this parent document has any selected sub-items
                            const selectedSubItems = doc.subItems?.filter(sub =>
                                selectedPlanningDocs.includes(sub.id)
                            ) || [];

                            // Check if parent itself is selected (for non-parent items)
                            const isParentSelected = !doc.subItems && selectedPlanningDocs.includes(doc.id);

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
                isOpen={!!previewDiagram}
                onClose={handleClosePreview}
                type="srs"
                title={previewDiagram || ""}
            />

            {previewDocument && (
                <PreviewModal
                    isOpen={!!previewDocument}
                    onClose={handleClosePreview}
                    type="srs"
                    title={(() => {
                        // Find document name from main items
                        const mainDoc = planningDocuments.find(doc => doc.id === previewDocument);
                        if (mainDoc) return mainDoc.name;

                        // Find document name from sub-items
                        for (const doc of planningDocuments) {
                            if (doc.subItems) {
                                const subItem = doc.subItems.find(sub => sub.id === previewDocument);
                                if (subItem) return `${doc.name} - ${subItem.name}`;
                            }
                        }
                        return "Document Preview";
                    })()}
                    content={previewContent}
                />
            )}

            <div className="flex justify-center items-center gap-3">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                {generatedDiagrams.length === 0 ? (
                    <Button onClick={handleGenerateDiagrams} className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate
                    </Button>
                ) : (
                    <Button onClick={onNext} className="gap-2">
                        Continue to Analysis
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
