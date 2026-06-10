import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { memo } from "react";
import { useProjectMembership } from "@/context/ProjectMembershipContext";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface WorkflowActionsProps {
    hasGeneratedDocuments: boolean;
    isGenerating: boolean;
    onGenerate: () => void;
    onNext: () => void;
    onBack: () => void;
    generateButtonText?: string;
    nextButtonText?: string;
    hasSelectedDocuments?: boolean;
    generateButtonDataTour?: string;
}

export const WorkflowActions = memo(function Component ({
    hasGeneratedDocuments,
    isGenerating,
    onGenerate,
    onNext,
    onBack,
    generateButtonText = "Generate",
    nextButtonText = "Continue",
    hasSelectedDocuments = true,
    generateButtonDataTour,
}: WorkflowActionsProps) {
    const { role } = useProjectMembership();
    const isViewer = role === "Viewer";

    const handleGenerateClick = (e: React.MouseEvent) => {
        if (isViewer) {
            e.preventDefault();
            e.stopPropagation();
            toast.error("You do not have permission to generate documents. Your role is Viewer.");
            return;
        }
        onGenerate();
    };

    const generateBtn = (
        <Button
            onClick={isViewer ? handleGenerateClick : onGenerate}
            className={`gap-2 w-full sm:w-auto ${isViewer ? "opacity-50 cursor-not-allowed pointer-events-auto hover:bg-primary hover:text-primary-foreground" : ""}`}
            disabled={!isViewer && (isGenerating || !hasSelectedDocuments)}
            data-tour={generateButtonDataTour}
        >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? "Generating..." : generateButtonText}
        </Button>
    );

    return (
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3">
            <Button
                variant="outline"
                onClick={onBack}
                className="gap-2 w-full sm:w-auto"
                disabled={isGenerating}
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </Button>

            {isViewer ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        {generateBtn}
                    </TooltipTrigger>
                    <TooltipContent>
                        You do not have permission to generate documents. Your role is Viewer.
                    </TooltipContent>
                </Tooltip>
            ) : (
                generateBtn
            )}

            {hasGeneratedDocuments && (
                <Button
                    onClick={onNext}
                    className="gap-2 w-full sm:w-auto"
                    disabled={isGenerating}
                >
                    {nextButtonText}
                    <ArrowRight className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
});

