'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, FileText, CheckCircle2, Sparkles } from "lucide-react";

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
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Generate SRS Document
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Create a comprehensive Software Requirements Specification document
                </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                            <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                AI will generate:
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Complete SRS document with functional and non-functional requirements
                            </p>
                        </div>
                    </div>

                    {generatedSRS && (
                        <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{generatedSRS}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center items-center gap-3">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                {!generatedSRS ? (
                    <Button onClick={onGenerate} className="gap-2">
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
