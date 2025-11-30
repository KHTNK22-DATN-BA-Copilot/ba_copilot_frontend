'use client';

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { WorkflowStep } from "./types";

interface WorkflowStepIndicatorProps {
    steps: WorkflowStep[];
}

export default function WorkflowStepIndicator({ steps }: WorkflowStepIndicatorProps) {
    return (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = step.status === "completed";
                        const isCurrent = step.status === "current";

                        return (
                            <div key={step.id} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`p-3 rounded-full transition-colors ${isCompleted
                                                ? "bg-green-100 dark:bg-green-900/20"
                                                : isCurrent
                                                    ? "bg-blue-100 dark:bg-blue-900/20"
                                                    : "bg-gray-100 dark:bg-gray-700"
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <Icon
                                                className={`w-5 h-5 ${isCurrent
                                                        ? "text-blue-600 dark:text-blue-400"
                                                        : "text-gray-500 dark:text-gray-400"
                                                    }`}
                                            />
                                        )}
                                    </div>
                                    <p
                                        className={`text-xs mt-2 text-center max-w-[100px] ${isCurrent
                                                ? "text-blue-600 dark:text-blue-400 font-medium"
                                                : "text-gray-600 dark:text-gray-400"
                                            }`}
                                    >
                                        {step.title}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`h-0.5 w-12 mx-2 ${isCompleted
                                                ? "bg-green-600 dark:bg-green-400"
                                                : "bg-gray-200 dark:bg-gray-700"
                                            }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
