'use client';

import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { SRSIcon, DiagramIcon, WireframeIcon, HomeIcon } from "@/components/icons/project-icons";
import WorkflowHeader from "./WorkflowHeader";
import WorkflowStepIndicator from "./WorkflowStepIndicator";
import RequirementsStep from "../steps/requirments/RequirementsStep";
import PlanningStep from "../steps/planning/PlaningStep";
import AnalysisStep from "../steps/analysis/AnalysisStep";
import DesignStep from "../steps/design/DesignStep";
import ReviewStep from "../steps/review/ReviewStep";
import { WorkflowStep } from "./types";
import { useProjectData } from "../../_components/useProjectData";

interface WorkflowsMainProps {
    projectId: string;
}

export default function WorkflowsMain({ projectId }: WorkflowsMainProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [requirements, setRequirements] = useState("");
    const [generatedSRS, setGeneratedSRS] = useState("");
    const [generatedDiagrams, setGeneratedDiagrams] = useState<string[]>([]);
    const [generatedWireframes, setGeneratedWireframes] = useState<string[]>([]);
    const { project } = useProjectData(projectId as string)

    const steps: WorkflowStep[] = [
        {
            id: 0,
            title: "Project Requirements Input",
            description: "Describe your project requirements and goals",
            icon: HomeIcon,
            status: currentStep > 0 ? "completed" : currentStep === 0 ? "current" : "pending"
        },

        {
            id: 1,
            title: "Planning",
            description: "Create visual diagrams for your project",
            icon: DiagramIcon,
            status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "pending"
        },
        {
            id: 2,
            title: "Analysis",
            description: "Generate Software Requirements Specification",
            icon: SRSIcon,
            status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "pending"
        },
        {
            id: 3,
            title: "Design",
            description: "Design user interface wireframes",
            icon: WireframeIcon,
            status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "pending"
        },
        {
            id: 4,
            title: "Final Review",
            description: "Review all generated artifacts",
            icon: CheckCircle2,
            status: currentStep === 4 ? "current" : "pending"
        },
    ];

    const handleNext = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    }, [currentStep, steps.length]);

    const handleBack = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }, [currentStep]);

    const handleGenerateDiagrams = useCallback(() => {
        // Simulate diagram generation
        setGeneratedDiagrams(["Usecase Diagram", "Class Diagram", "Activity Diagram"]);
    }, []);

    const handleGenerateSRS = useCallback(() => {
        // Simulate SRS generation
        setGeneratedSRS("Software Requirements Specification document has been generated based on your input.");
    }, []);

    const handleGenerateWireframes = () => {
        // Simulate wireframe generation
        setGeneratedWireframes(["Login Page", "Dashboard", "User Profile"]);
    };

    const completeWorkflow = useCallback(() => {
        // Handle workflow completion
        console.log("Workflow completed!");
    }, []);

    const restartWorkflow = useCallback(() => {
        setCurrentStep(0);
        setRequirements("");
        setGeneratedSRS("");
        setGeneratedDiagrams([]);
        setGeneratedWireframes([]);
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Page Header */}
            <WorkflowHeader />

            {/* Progress Bar */}
            {/* <WorkflowProgressBar currentStep={currentStep} totalSteps={steps.length} /> */}

            {/* Step Indicator */}
            <WorkflowStepIndicator steps={steps} />

            {/* Step Content */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4 sm:p-6">
                    {currentStep === 0 && (
                        <RequirementsStep
                            requirements={requirements}
                            onRequirementsChange={setRequirements}
                            onNext={handleNext}
                        />
                    )}

                    {currentStep === 1 && (
                        <PlanningStep
                            generatedDiagrams={generatedDiagrams}
                            onGenerate={handleGenerateDiagrams}
                            onNext={handleNext}
                            onBack={handleBack}
                            projectName={project.name}
                        />
                    )}

                    {currentStep === 2 && (
                        <AnalysisStep
                            generatedSRS={generatedSRS}
                            onGenerate={handleGenerateSRS}
                            onNext={handleNext}
                            onBack={handleBack}
                            projectName={project.name}
                        />
                    )}

                    {currentStep === 3 && (
                        <DesignStep
                            generatedWireframes={generatedWireframes}
                            onGenerate={handleGenerateWireframes}
                            onNext={handleNext}
                            onBack={handleBack}
                            projectName={project.name}
                        />
                    )}

                    {currentStep === 4 && (
                        <ReviewStep
                            requirements={requirements}
                            generatedSRS={generatedSRS}
                            generatedDiagrams={generatedDiagrams}
                            generatedWireframes={generatedWireframes}
                            onBack={handleBack}
                            onComplete={completeWorkflow}
                            onRestart={restartWorkflow}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
