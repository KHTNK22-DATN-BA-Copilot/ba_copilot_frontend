'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WorkflowProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export default function WorkflowProgressBar({ currentStep, totalSteps }: WorkflowProgressBarProps) {
    const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

    return (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                            Overall Progress
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Step {currentStep + 1} of {totalSteps}
                        </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                </div>
            </CardContent>
        </Card>
    );
}
