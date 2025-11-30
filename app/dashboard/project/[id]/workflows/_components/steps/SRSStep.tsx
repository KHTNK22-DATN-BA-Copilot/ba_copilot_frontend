'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, FileText, CheckCircle2, Sparkles, X } from "lucide-react";
import PromptWithFileSelection from "../PromptWithFileSelection";
import { SRSIcon } from "@/components/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SRSStepProps {
    generatedSRS: string;
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
}

export default function SRSStep({
    generatedSRS,
    onGenerate,
    onNext,
    onBack
}: SRSStepProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [previewSRS, setPreviewSRS] = useState(false);

    const handleGenerateSRS = () => {
        console.log("Sending prompt:", prompt);
        console.log("Selected files:", selectedFiles);
        onGenerate();
    };

    const handleViewSRS = () => {
        setPreviewSRS(true);
    };

    const handleClosePreview = () => {
        setPreviewSRS(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Generate SRS Document
                </h2>
            </div>

            <PromptWithFileSelection
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedFiles={selectedFiles}
                onSelectedFilesChange={setSelectedFiles}
                placeholder="Describe the SRS document you want to generate...

Example:
- Generate a complete SRS for an e-commerce platform
- Create functional requirements for user authentication module
- Document non-functional requirements for performance and security"
                label="SRS Generation Prompt & Reference Files (Optional)"
            />

            {/* Generated SRS Section */}
            {generatedSRS && (
                <div className="bg-gray-50 dark:bg-gray-800">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                                <SRSIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    Generated SRS Document
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Document created successfully
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{generatedSRS}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={handleViewSRS}
                                >
                                    View
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewSRS && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                SRS Document Preview
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
                            <div className="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-6">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {`# Software Requirements Specification

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

**Note:** This is sample content. Actual SRS will be generated based on your requirements.`}
                                    </ReactMarkdown>
                                </div>
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
                {!generatedSRS ? (
                    <Button onClick={handleGenerateSRS} className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate SRS Document
                    </Button>
                ) : (
                    <Button onClick={onNext} className="gap-2">
                        Continue to Wireframes
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
