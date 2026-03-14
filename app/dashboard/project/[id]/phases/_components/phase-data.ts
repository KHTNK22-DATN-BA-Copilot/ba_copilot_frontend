import { Phase, PhaseId } from "./types";

export const PHASES: Phase[] = [
    {
        id: "planning",
        name: "Planning",
        description: "Define project scope, stakeholders, and initial requirements",
        documents: [
            {
                id: "stakeholder-register",
                name: "Stakeholder Register",
                status: "not-started",
                lastGenerated: "2026-03-10",
            },
            {
                id: "high-level-requirements",
                name: "High-level Requirements",
                status: "not-started",
            },
            {
                id: "requirements-management-plan",
                name: "Requirements Management Plan",
                status: "not-started",
            },
            {
                id: "business-case",
                name: "Business Case Document",
                status: "not-started",
            },
            {
                id: "scope-statement",
                name: "Scope Statement Document",
                status: "not-started",
            },
            {
                id: "product-roadmap",
                name: "Product Roadmap Document",
                status: "not-started",
            },
        ],
    },
    {
        id: "analysis",
        name: "Analysis",
        description: "Evaluate feasibility and perform cost-benefit analysis",
        documents: [
            {
                id: "feasibility-study",
                name: "Feasibility Study Report",
                status: "not-started",
            },
            {
                id: "cost-benefit-analysis",
                name: "Cost-Benefit Analysis Document",
                status: "not-started",
            },
            {
                id: "risk-register",
                name: "Risk Register Document",
                status: "not-started",
            },
            {
                id: "compliance",
                name: "Compliance Document",
                status: "not-started",
            }
        ],
    },
    {
        id: "design",
        name: "Design",
        description: "Create technical specifications and system architecture",
        documents: [
            {
                id: "srs",
                name: "Software Requirement Specification",
                status: "not-started",
            },
            {
                id: "hld-arch",
                name: "System Architecture Diagram",
                status: "not-started",
            },
            {
                id: "hld-cloud",
                name: "Cloud Infrastructure (AWS/Azure) Setup",
                status: "not-started"
            },
            {
                id: "hld-tech",
                name: "Tech Stack Selection",
                status: "not-started"
            },
            {
                id: "lld-arch",
                name: "Architecture Diagrams",
                status: "not-started"
            },
            {
                id: "lld-db",
                name: "Database Schemas",
                status: "not-started"
            },
            {
                id: "lld-api",
                name: "API Specifications",
                status: "not-started"
            },
            {
                id: "lld-pseudo",
                name: "Pseudocode",
                status: "not-started"
            },
            {
                id: "uiux-wireframe",
                name: "Wireframes",
                status: "not-started"
            },
            {
                id: "uiux-mockup",
                name: "Mockups",
                status: "not-started"
            },
            {
                id: "uiux-prototype",
                name: "Prototypes",
                status: "not-started"
            },
            {
                id: "rtm",
                name: "RTM (Requirements Traceability Matrix)",
                status: "not-started"
            }
        ],
    },
];

export function getPhases(phaseFilter?: PhaseId): Phase[] {
    if (!phaseFilter) {
        return PHASES;
    }

    return PHASES.filter((phase) => phase.id === phaseFilter);
}

export function findDocument(documentId: string) {
    return PHASES.flatMap((phase) =>
        phase.documents.map((document) => ({ phase, document }))
    ).find((entry) => entry.document.id === documentId);
}
