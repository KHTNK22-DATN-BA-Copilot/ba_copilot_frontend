'use client';

import { Sparkles } from "lucide-react";

export default function WorkflowHeader() {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Project Workflow
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Generate all project deliverables in a guided workflow
                    </p>
                </div>
            </div>
        </div>
    );
}
