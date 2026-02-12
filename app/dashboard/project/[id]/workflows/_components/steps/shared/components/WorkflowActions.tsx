import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface WorkflowActionsProps {
    hasGeneratedDocuments: boolean;
    isGenerating: boolean;
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
    generateButtonText?: string;
    nextButtonText?: string;
    hasSelectedDocuments?: boolean;
}

export function WorkflowActions({
    hasGeneratedDocuments,
    isGenerating,
    onGenerate,
    onNext,
    onBack,
    generateButtonText = "Generate",
    nextButtonText = "Continue",
    hasSelectedDocuments = true,
}: WorkflowActionsProps) {
    return (
        <div className="flex justify-center items-center gap-3">
            <Button
                variant="outline"
                onClick={onBack}
                className="gap-2"
                disabled={isGenerating}
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </Button>
            <Button
                onClick={onGenerate}
                className="gap-2"
                disabled={isGenerating || !hasSelectedDocuments}
            >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? "Generating..." : generateButtonText}
            </Button>

            {hasGeneratedDocuments && (
                <Button
                    onClick={onNext}
                    className="gap-2"
                    disabled={isGenerating}
                >
                    {nextButtonText}
                    <ArrowRight className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
