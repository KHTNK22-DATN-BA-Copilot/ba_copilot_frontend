export type DocumentStatus = "not-started" | "in-progress" | "available";

export type PhaseId = "planning" | "analysis" | "design";

export interface PhaseSubDocument {
  id: string;
  name: string;
  status: DocumentStatus;
  lastGenerated?: string;
}

export interface PhaseDocument {
  id: string;
  name: string;
  description: string;
  status?: DocumentStatus;
  lastGenerated?: string;
  subItems?: PhaseSubDocument[];
}

export interface PhaseLeafDocument extends PhaseSubDocument {
  parentId?: string;
  parentName?: string;
}

export interface Phase {
  id: PhaseId;
  name: string;
  description: string;
  documents: PhaseDocument[];
}
