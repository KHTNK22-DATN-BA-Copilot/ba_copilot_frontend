import { WorkflowDocument } from "../shared/types";

export const planningDocuments: WorkflowDocument[] = [
    {
        id: "project-charter",
        name: "Project Charter Document",
        description:
            "Core project initiation documents including objectives, scope, and stakeholders",
        subItems: [
            {
                id: "stakeholder-register",
                name: "Stakeholder Register",
            },
            {
                id: "high-level-requirements",
                name: "High-level Requirements",
            },
            {
                id: "requirements-management-plan",
                name: "Requirements Management Plan",
            },
        ],
    },
    {
        id: "business-case",
        name: "Business Case Document",
        description:
            "Justification for the project with cost-benefit analysis and strategic alignment",
    },
    {
        id: "scope-statement",
        name: "Scope Statement Document",
        description:
            "Detailed project scope, deliverables, and boundaries definition",
    },
    {
        id: "product-roadmap",
        name: "Product Roadmap Document",
        description:
            "High-level timeline and milestones for project delivery phases",
    },
];

export const documentFiles: Record<string, string> = {
    "project-charter": "/api/workflows/template?file=charter-docs-template.md",
    "stakeholder-register":
        "/api/workflows/template?file=Stakeholder-Register-Template.md",
    "high-level-requirements":
        "/api/workflows/template?file=High-Level-Requirements-Document-Template.md",
    "requirements-management-plan":
        "/api/workflows/template?file=Requirements-Management-Plan-Template.md",
    "business-case": "/api/workflows/template?file=Business-Case-Template.md",
    "scope-statement": "/api/workflows/template?file=Scope-Statement-Template.md",
    "product-roadmap": "/api/workflows/template?file=Product-Roadmap-Template.md",
};

export const getAllDocIds = (): string[] =>
    planningDocuments.flatMap((doc) =>
        doc.subItems ? doc.subItems.map((sub) => sub.id) : [doc.id],
    );
