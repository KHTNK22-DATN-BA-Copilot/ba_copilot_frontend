'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface ReviewStepProps {
    requirements: string;
    generatedDiagrams: string[];
    generatedWireframes: string[];
    onBack: () => void;
    onComplete: () => void;
    onRestart: () => void;
}

export default function ReviewStep({
    requirements,
    generatedDiagrams,
    generatedWireframes,
    onBack,
    onComplete,
    onRestart
}: ReviewStepProps) {
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
                {/* Project Requirements Summary */}
                <Card className="border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    Project Requirements
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {requirements.substring(0, 150)}...
                                </p>
                            </div>
                            <Button variant="outline" size="sm">
                                View
                            </Button>
                        </div>
                    </CardContent>
                </Card>

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
                            </div>
                            <Button variant="outline" size="sm">
                                View
                            </Button>
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
                            </div>
                            <Button variant="outline" size="sm">
                                View
                            </Button>
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
                            </div>
                            <Button variant="outline" size="sm">
                                View
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
