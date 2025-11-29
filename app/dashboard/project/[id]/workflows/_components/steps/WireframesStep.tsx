'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Layout, CheckCircle2, Sparkles } from "lucide-react";

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
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Create Wireframes
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Generate wireframes for your application's user interface
                </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded">
                            <Layout className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                AI will generate wireframes for:
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Key screens and user flows based on your requirements
                            </p>
                        </div>
                    </div>

                    {generatedWireframes.length > 0 && (
                        <div className="space-y-2 mt-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Generated Wireframes:
                            </p>
                            {generatedWireframes.map((wireframe, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <span className="text-sm text-gray-900 dark:text-gray-100">{wireframe}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center items-center gap-3">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                {generatedWireframes.length === 0 ? (
                    <Button onClick={onGenerate} className="gap-2">
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
