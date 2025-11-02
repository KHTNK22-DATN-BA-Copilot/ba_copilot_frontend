import { Workflow, Database, GitBranch, LucideIcon } from "lucide-react";

export interface DiagramType {
    id: string;
    name: string;
    icon: LucideIcon;
}

export interface Diagram {
    id: number;
    name: string;
    type: string;
    date: string;
    preview: string;
    markdown: string;
}

export type OverviewType = {
    title: string;
    description: string;
}

export const DIAGRAM_TYPES: DiagramType[] = [
    { id: "usecase", name: "Usecase Diagram", icon: Workflow },
    { id: "class", name: "Class Diagram", icon: Database },
    { id: "activity", name: "Activity Diagram", icon: GitBranch },
];

export const SAMPLE_DIAGRAMS: Diagram[] = [
    {
        id: 1,
        name: "User Authentication Flow",
        type: "Usecase Diagram",
        date: "2 days ago",
        preview: "diagram-preview-url",
        markdown: "# User Authentication Flow\n\n## Actors\n- User\n- System\n- Email Service\n\n## Use Cases\n1. Login\n2. Register\n3. Reset Password"
    },
    {
        id: 2,
        name: "Database Schema",
        type: "Class Diagram",
        date: "3 days ago",
        preview: "diagram-preview-url",
        markdown: "# Database Schema\n\n## Classes\n\n### User\n- id: integer\n- username: string\n- email: string\n\n### Project\n- id: integer\n- name: string\n- description: text"
    },
    {
        id: 3,
        name: "API Sequence",
        type: "Activity Diagram",
        date: "1 week ago",
        preview: "diagram-preview-url",
        markdown: "# API Activity Diagram\n\n## Activities\n1. User initiates request\n2. System validates input\n3. Process data\n4. Return response"
    },
];

export const COMPLEXITY_OPTIONS = [
    { value: "simple", label: "Simple" },
    { value: "medium", label: "Medium" },
    { value: "complex", label: "Complex" },
] as const;

export const STYLE_OPTIONS = [
    { value: "modern", label: "Modern" },
    { value: "classic", label: "Classic" },
    { value: "minimal", label: "Minimal" },
] as const;
