"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Joyride,
    ACTIONS,
    EventData,
    EVENTS,
    STATUS,
    Step,
} from "react-joyride";
import { ShadcnTooltip } from "@/components/onboarding/OnboardingButton";

interface WorkflowOnboardingTourProps {
    currentStep: number;
    selectedDocumentsCount: number;
    prompt: string;
    isGenerating: boolean;
    generationComplete: boolean;
    generatedDocumentCount: number;
}

const WORKFLOW_ONBOARDING_KEY = "hasCompletedOnboarding_workflow";

type WorkflowTourStepId =
    | "intro"
    | "requirements-continue"
    | "planning-docs"
    | "planning-prompt"
    | "planning-generate"
    | "planning-results";

const workflowSteps: Array<Step & { id: WorkflowTourStepId }> = [
    {
        id: "intro",
        target: "body",
        content: (
            <div className="text-center">
                <div className="text-3xl mb-3">🔄</div>
                <h2 className="text-lg font-bold mb-2">Workflow Onboarding</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    We will guide you through Requirements and Planning only.
                    Later phases follow the same pattern, so the tour will stop
                    once Planning returns its generated results.
                </p>
            </div>
        ),
        placement: "center",
        skipBeacon: true,
    },
    {
        id: "requirements-continue",
        target: '[data-tour="workflow-requirements-continue"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">Continue to Planning</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Review the requirements summary, then click the button to
                    enter Planning.
                </p>
            </div>
        ),
        placement: "top",
        skipBeacon: true,
        data: { hideFooter: true },
    },
    {
        id: "planning-docs",
        target: '[data-tour="workflow-planning-doc-selector"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">Choose Documents</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Pick the Planning documents you want to generate.
                </p>
            </div>
        ),
        placement: "top",
        skipBeacon: true,
    },
    {
        id: "planning-prompt",
        target: '[data-tour="workflow-planning-prompt"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">Enter Prompt</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Type the prompt for Planning. When the field has content,
                    the tour continues automatically.
                </p>
            </div>
        ),
        placement: "top",
        skipBeacon: true,
    },
    {
        id: "planning-generate",
        target: '[data-tour="workflow-planning-generate"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">Generate button</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Click on the generate button to start the workflow.
                </p>
            </div>
        ),
        placement: "top",
        skipBeacon: true,
    },

    {
        id: "planning-results",
        target: '[data-tour="workflow-planning-results"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">Planning Results</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Your Planning documents are ready. The onboarding stops
                    here, and later phases are ready to use without guidance.
                </p>
            </div>
        ),
        placement: "top",
        skipBeacon: true,
    },
];

export default function WorkflowOnboardingTour({
    currentStep,
    selectedDocumentsCount,
    prompt,
    isGenerating,
    generationComplete,
    generatedDocumentCount,
}: WorkflowOnboardingTourProps) {
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const prevStepIdRef = useRef<string | undefined>(undefined);
    const prevConditionsRef = useRef({ currentStep: -1, selectedCount: 0, promptLength: 0, isGenerating: false, complete: false });

    const completeTour = useCallback(() => {
        localStorage.setItem(WORKFLOW_ONBOARDING_KEY, "true");
        setRun(false);
    }, []);

    const advanceStep = useCallback(() => {
        setStepIndex((previous) => Math.min(previous + 1, workflowSteps.length - 1));
    }, []);

    const currentTourStepId = workflowSteps[stepIndex]?.id;

    useEffect(() => {
        const timer = window.setTimeout(() => {
            if (localStorage.getItem(WORKFLOW_ONBOARDING_KEY) !== "true") {
                setStepIndex(0);
                setRun(true);
            }
        }, 400);

        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!run) return;

        const currentConditions = {
            currentStep,
            selectedCount: selectedDocumentsCount,
            promptLength: prompt.trim().length,
            isGenerating,
            complete: generationComplete,
        };

        // If step ID hasn't changed, don't re-evaluate
        if (
            prevStepIdRef.current === currentTourStepId &&
            JSON.stringify(prevConditionsRef.current) === JSON.stringify(currentConditions)
        ) {
            return;
        }

        prevStepIdRef.current = currentTourStepId;
        prevConditionsRef.current = currentConditions;

        if (currentStep > 1) {
            completeTour();
            return;
        }

        if (currentTourStepId === "requirements-continue" && currentStep >= 1) {
            advanceStep();
            return;
        }

        // planning-docs step: just show, don't auto-advance. User clicks Next button.

        // if (currentTourStepId === "planning-prompt" && prompt.trim().length > 0) {
        //     advanceStep();
        //     return;
        // }

        // Move to the next step when generation starts.
        // Joyride will be hidden during generation via the `run` prop.
        if (
            currentTourStepId === "planning-generate" &&
            isGenerating
        ) {
            advanceStep();
            return;
        }

        // if (
        //     currentTourStepId === "planning-results" &&
        //     generationComplete &&
        //     generatedDocumentCount > 0
        // ) {
        //     completeTour();
        // }
    }, [
        advanceStep,
        completeTour,
        currentStep,
        currentTourStepId,
        generatedDocumentCount,
        generationComplete,
        isGenerating,
        prompt,
        run,
        selectedDocumentsCount,
    ]);

    const handleJoyrideCallback = useCallback(
        (data: EventData) => {
            const { status, action, index, type } = data;
            const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

            if (finishedStatuses.includes(status)) {
                completeTour();
                return;
            }

            // If the target is not found for the planning-generate step,
            // keep the tooltip visible (centered) instead of advancing or
            // letting Joyride try to attach to a now-missing element which
            // causes mispositioned UI. This allows the user to click the
            // Generate button (which may be outside the tour target) and
            // the tour will advance once `generationComplete` is true.
            if (type === EVENTS.TARGET_NOT_FOUND) {
                const stepId = workflowSteps[index]?.id;
                if (stepId === "planning-generate") {
                    setStepIndex(index); // keep showing the generate step tooltip
                    return;
                }
            }

            if (type === EVENTS.STEP_AFTER) {
                setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
            }
        },
        [completeTour],
    );

    if (!run) return null;

    return (
        <Joyride
            steps={workflowSteps}
            run={run && !isGenerating}
            stepIndex={stepIndex}
            continuous
            tooltipComponent={ShadcnTooltip}
            onEvent={handleJoyrideCallback}
            options={{
                primaryColor: "#2563eb",
                zIndex: 10000,
                arrowColor: "#fff",
                backgroundColor: "#fff",
                textColor: "#1f2937",
                overlayColor: "rgba(0, 0, 0, 0.5)",
                overlayClickAction: false,
                spotlightRadius: 12,
                showProgress: true,
                buttons: ["back", "close", "primary", "skip"],
            }}
            styles={{
                tooltip: {
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                },
                tooltipContent: {
                    padding: "8px 0",
                },
                buttonPrimary: {
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: 600,
                },
                buttonBack: {
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    color: "#6b7280",
                },
                buttonSkip: {
                    fontSize: "13px",
                    color: "#9ca3af",
                },
            }}
        />
    );
}
