export interface WorkflowStep {
    id: number;
    title: string;
    description: string;
    icon: any;
    status: 'completed' | 'current' | 'pending';
}

export interface WorkflowState {
    currentStep: number;
    requirements: string;
    generatedSRS: string;
    generatedDiagrams: string[];
    generatedWireframes: string[];
}
