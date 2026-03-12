export type DocumentStatus = "not-started" | "in-progress" | "available";

export type PhaseId = "planning" | "analysis" | "design";

export interface PhaseDocument {
  id: string;
  name: string;
  status: DocumentStatus;
  lastGenerated?: string;
}

export interface Phase {
  id: PhaseId;
  name: string;
  description: string;
  documents: PhaseDocument[];
}
