'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface RequirementsStepProps {
    requirements: string;
    onRequirementsChange: (value: string) => void;
    onNext: () => void;
}

export default function RequirementsStep({
    requirements,
    onRequirementsChange,
    onNext
}: RequirementsStepProps) {
    const router = useRouter();
    const { id } = useParams();

    const handleNavigateToFiles = () => {
        router.push(`/dashboard/project/${id}/files`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Project Requirements Input
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Describe your project requirements, goals, and any specific features you need
                </p>
            </div>

            {/* Notice about file input */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-blue-900 dark:text-blue-100 text-sm">
                        <span>Before proceeding, you can upload reference documents in the </span>
                        <button
                            onClick={handleNavigateToFiles}
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                            Files section
                        </button>
                        <span> from the sidebar, or continue if you have enough information.</span>
                    </p>
                </div>
            </div>

            <div className="flex justify-center items-center gap-3">
                <Button
                    onClick={onNext}
                    className="gap-2"
                >
                    Continue to Diagrams
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
