import { analysisDocuments } from "../../workflows/_components/steps/analysis/documents";
import { designDocuments } from "../../workflows/_components/steps/design/documents";
import { planningDocuments } from "../../workflows/_components/steps/planning/documents";
import { WorkflowDocument } from "../../workflows/_components/steps/shared/types";
import {
    DocumentStatus,
    Phase,
    PhaseDocument,
    PhaseId,
    PhaseLeafDocument,
} from "./types";

const DEFAULT_DOCUMENT_STATUS: DocumentStatus = "not-started";

function mapWorkflowDocuments(documents: WorkflowDocument[]): PhaseDocument[] {
    return documents.map((document) => ({
        id: document.id,
        name: document.name,
        description: document.description,
        status: document.subItems ? undefined : DEFAULT_DOCUMENT_STATUS,
        subItems: document.subItems?.map((subItem) => ({
            id: subItem.id,
            name: subItem.name,
            status: DEFAULT_DOCUMENT_STATUS,
        })),
    }));
}

export const PHASES: Phase[] = [
    {
        id: "planning",
        name: "Planning",
        description: "Define project scope, stakeholders, and initial requirements",
        documents: mapWorkflowDocuments(planningDocuments),
    },
    {
        id: "analysis",
        name: "Analysis",
        description: "Evaluate feasibility and perform cost-benefit analysis",
        documents: mapWorkflowDocuments(analysisDocuments),
    },
    {
        id: "design",
        name: "Design",
        description: "Create technical specifications and system architecture",
        documents: mapWorkflowDocuments(designDocuments),
    },
];

export function getPhases(phaseFilter?: PhaseId): Phase[] {
    if (!phaseFilter) {
        return PHASES;
    }

    return PHASES.filter((phase) => phase.id === phaseFilter);
}

export function getPhaseLeafDocuments(phase: Phase): PhaseLeafDocument[] {
    return phase.documents.reduce<PhaseLeafDocument[]>((items, document) => {
        if (document.subItems && document.subItems.length > 0) {
            items.push(
                ...document.subItems.map((subItem) => ({
                    ...subItem,
                    parentId: document.id,
                    parentName: document.name,
                }))
            );

            return items;
        }

        items.push({
            id: document.id,
            name: document.name,
            status: document.status ?? DEFAULT_DOCUMENT_STATUS,
            lastGenerated: document.lastGenerated,
            parentId: undefined,
            parentName: undefined,
        });

        return items;
    }, []);
}

export function getPhaseDocumentCount(phase: Phase): number {
    return getPhaseLeafDocuments(phase).length;
}

export function findDocument(documentId: string) {
    for (const phase of PHASES) {
        for (const document of phase.documents) {
            if (document.subItems && document.subItems.length > 0) {
                const subDocument = document.subItems.find((subItem) => subItem.id === documentId);

                if (subDocument) {
                    return {
                        phase,
                        document: subDocument,
                        parentDocument: document,
                    };
                }
            }

            if (document.id === documentId) {
                return {
                    phase,
                    document: {
                        id: document.id,
                        name: document.name,
                        status: document.status ?? DEFAULT_DOCUMENT_STATUS,
                        lastGenerated: document.lastGenerated,
                    },
                };
            }
        }
    }

    return undefined;
}
