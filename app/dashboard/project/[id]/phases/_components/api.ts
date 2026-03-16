import { getWorkflowDocumentsByStep } from "@/actions/workflow.action";

import { PhaseId } from "./types";

export interface GeneratedPhaseDocument {
  document_id: string;
  project_name?: string;
  content?: string;
  design_type?: string;
  doc_type?: string;
  status?: string;
  updated_at?: string;
}

export function resolveGeneratedDocumentTypeId(
  document: GeneratedPhaseDocument
): string {
  const rawId = document.doc_type || document.design_type || document.document_id || "";
  return String(rawId).trim().toLowerCase();
}

export async function getGeneratedDocumentsByPhase(
  phase: PhaseId,
  projectId: string
): Promise<GeneratedPhaseDocument[]> {
  const response = await getWorkflowDocumentsByStep(phase, projectId);

  if (!response.success || !response.data?.documents) {
    return [];
  }

  return response.data.documents as GeneratedPhaseDocument[];
}
