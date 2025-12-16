import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface PlanningActionsProps {
    hasGeneratedDocuments: boolean;
    isGenerating: boolean;
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
}

export function PlanningActions({
    hasGeneratedDocuments,
    isGenerating,
    onGenerate,
    onNext,
    onBack,
}: PlanningActionsProps) {
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
            {!hasGeneratedDocuments ? (
                <Button
                    onClick={onGenerate}
                    className="gap-2"
                    disabled={isGenerating}
                >
                    <Sparkles className="w-4 h-4" />
                    {isGenerating ? "Generating..." : "Generate"}
                </Button>
            ) : (
                <Button
                    onClick={onNext}
                    className="gap-2"
                    disabled={isGenerating}
                >
                    Continue to Analysis
                    <ArrowRight className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
