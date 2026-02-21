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
    "project-charter": "/mock/planning/charter/charter_docs_template.md",
    "stakeholder-register":
        "/mock/planning/charter/stakeholder_register_template.md",
    "high-level-requirements":
        "/mock/planning/charter/high_level_requirements_template.md",
    "requirements-management-plan":
        "/mock/planning/charter/requirements_management_plan_template.md",
    "business-case": "/mock/planning/business_case_template.md",
    "scope-statement": "/mock/planning/scope_statement_template.md",
    "product-roadmap": "/mock/planning/product_roadmap_template.md",
};

export const getAllDocIds = (): string[] =>
    planningDocuments.flatMap((doc) =>
        doc.subItems ? doc.subItems.map((sub) => sub.id) : [doc.id],
    );
