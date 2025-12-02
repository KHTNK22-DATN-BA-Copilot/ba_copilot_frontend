'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import PreviewModal from "../PreviewModal";

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

    const handleViewDiagrams = () => {
        setPreviewType('diagram');
        setSelectedItem(generatedDiagrams[0] || null);
    };

    const handleViewSRS = () => {
        setPreviewType('srs');
        setSelectedItem(null);
    };

    const handleViewWireframes = () => {
        setPreviewType('wireframe');
        setSelectedItem(generatedWireframes[0] || null);
    };

    const handleClosePreview = () => {
        setPreviewType(null);
        setSelectedItem(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Final Review
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Review all generated artifacts for your project
                </p>
            </div>

            <div className="space-y-4">

                {/* Diagrams Summary */}
                <Card className="border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    Diagrams Generated
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {generatedDiagrams.length} diagrams created
                                </p>
                                <ul className="mt-2 space-y-2">
                                    {generatedDiagrams.map((diagram, idx) => (
                                        <li key={idx} className="flex items-center justify-between">
                                            <span className="truncate text-gray-800 dark:text-gray-200 text-sm">{diagram}</span>
                                            <Button variant="outline" size="sm" onClick={() => { setPreviewType('diagram'); setSelectedItem(diagram); }}>
                                                View
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* SRS Summary */}
                <Card className="border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    SRS Document
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Software Requirements Specification completed
                                </p>
                                {/* Support multiple SRS files if array, else single */}
                                {Array.isArray(generatedSRS) ? (
                                    <ul className="mt-2 space-y-2">
                                        {generatedSRS.map((srs, idx) => (
                                            <li key={idx} className="flex items-center justify-between">
                                                <span className="truncate text-gray-800 dark:text-gray-200 text-sm">{srs}</span>
                                                <Button variant="outline" size="sm" onClick={() => { setPreviewType('srs'); setSelectedItem(srs); }}>
                                                    View
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={handleViewSRS}>
                                        View
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Wireframes Summary */}
                <Card className="border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    Wireframes Created
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {generatedWireframes.length} wireframes generated
                                </p>
                                <ul className="mt-2 space-y-2">
                                    {generatedWireframes.map((wireframe, idx) => (
                                        <li key={idx} className="flex items-center justify-between">
                                            <span className="truncate text-gray-800 dark:text-gray-200 text-sm">{wireframe}</span>
                                            <Button variant="outline" size="sm" onClick={() => { setPreviewType('wireframe'); setSelectedItem(wireframe); }}>
                                                View
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Preview Modal */}
            {previewType && (
                <PreviewModal
                    isOpen={!!previewType}
                    onClose={handleClosePreview}
                    type={previewType}
                    title={
                        previewType === 'diagram' ? (selectedItem || 'Diagrams') :
                            previewType === 'srs' ? (selectedItem || 'SRS Document Preview') :
                                `${selectedItem || 'Wireframes'} - Preview`
                    }
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
