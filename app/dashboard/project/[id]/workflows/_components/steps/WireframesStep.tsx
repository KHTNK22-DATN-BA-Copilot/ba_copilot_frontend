'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Layout, CheckCircle2, Sparkles, X } from "lucide-react";
import PromptWithFileSelection from "../PromptWithFileSelection";
import { WireframeIcon } from "@/components/icons";

interface WireframesStepProps {
    generatedWireframes: string[];
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
}

export default function WireframesStep({
    generatedWireframes,
    onGenerate,
    onNext,
    onBack
}: WireframesStepProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [previewWireframe, setPreviewWireframe] = useState<string | null>(null);

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
    };

    // Mock HTML/CSS for wireframe preview
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
                            This is a mock wireframe preview. In production, this would display the actual 
                            HTML/CSS content generated for ${wireframeName}.
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

        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${wireframeName}</title>
                </head>
                <body style="margin: 0; padding: 0; background: #f9fafb;">
                    ${mockHtml}
                </body>
            </html>
        `;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Create Wireframes
                </h2>
            </div>

            <PromptWithFileSelection
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedFiles={selectedFiles}
                onSelectedFilesChange={setSelectedFiles}
                placeholder="Describe the wireframes you want to generate...

Example:
- Create wireframes for user login and registration flows
- Design dashboard layout with navigation and key components
- Generate mobile-responsive wireframes for main screens"
                label="Wireframe Generation Prompt & Reference Files (Optional)"
            />

            {/* Generated Wireframes Section */}
            {generatedWireframes.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                                <WireframeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    Generated Wireframes
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {generatedWireframes.length} wireframe(s) created
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {generatedWireframes.map((wireframe, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-2 p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm text-gray-900 dark:text-gray-100">{wireframe}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => handleViewWireframe(wireframe)}
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
            {previewWireframe && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {previewWireframe} - Preview
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
                        <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                            <div className="h-[calc(90vh-80px)] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                                <iframe
                                    srcDoc={getMockWireframeContent(previewWireframe)}
                                    title="wireframe-preview"
                                    sandbox="allow-scripts"
                                    className="w-full h-full border-0"
                                />
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
                {generatedWireframes.length === 0 ? (
                    <Button onClick={handleGenerateWireframes} className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate Wireframes
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
