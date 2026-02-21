// Common interfaces shared across all workflow steps

/** @deprecated Use ConstrainedDocument instead for constraint-aware components */
type Dependency = {
  requiredDocumentIds?: string[];
  affectedDocumentIds?: string[];
}

export type SubItem = {
  id: string;
  name: string;
  /** @deprecated Dependency data now lives in documentDependencies.ts */
  dependency?: {
    requiredDocuments?: string[];
    affectedDocuments?: string[];
  };
  isChecked?: boolean;
  isDisabled?: boolean;
};

export type WorkflowDocument = {
  id: string;
  name: string;
  description: string;

  /** @deprecated Dependency data now lives in documentDependencies.ts */
  dependency?: Dependency;

  subItems?: SubItem[];
  isChecked?: boolean;
  isDisabled?: boolean;
}

// ─── Constrained document types (used by useDocumentConstraints) ─────

export type ConstrainedSubItem = {
  id: string;
  name: string;
  isChecked: boolean;
  isDisabled: boolean;
  /** Human-readable reason why this document is disabled */
  disabledReason?: string;
};

export type ConstrainedDocument = {
  id: string;
  name: string;
  description: string;
  isChecked: boolean;
  isDisabled: boolean;
  /** Human-readable reason why this document is disabled */
  disabledReason?: string;
  subItems?: ConstrainedSubItem[];
}

// New payload structure for WebSocket API
export interface WorkflowDocumentRequest {
  type: string;
}

export interface GenerateWorkflowPayload {
  project_name: string;
  description: string;
  documents: WorkflowDocumentRequest[];
}

// Legacy payload structure (keep for backward compatibility)
export interface LegacyGenerateWorkflowPayload {
  prompt: string;
  selectedFiles: string[];
  selectedDocIds: string[];
  projectId?: string;
  stepType?: string; // 'planning' | 'analysis' | 'design'
}

export interface WorkflowApiResponse {
  jobId?: string;
  status: "success" | "error" | "pending";
  message?: string;
  data?: any;
}

export interface JobStatusResponse {
  jobId: string;
  status: "pending" | "processing" | "completed" | "error";
  progress?: number;
  message?: string;
  result?: any;
}

export type DocumentGenerationStatus = "pending" | "processing" | "completed" | "error";

export interface GenerationDocumentItem {
  id: string; // document type/id (e.g., "stakeholder-register")
  name: string; // display name
}

// WebSocket message types
export interface WorkflowWSMessage {
  // Some backend events use `type` only (e.g. doc_start/doc_completed)
  // so keep `status` optional.
  status?: "processing" | "completed" | "error";
  progress?: number;
  message?: string;
  currentDocument?: string;
  // Backend-specific fields (seen in WS events)
  doc_type?: string;
  index?: number;
  step?: string;
  data?: any;
  result?: {
    documents: GeneratedDocument[];
  };
  type?: string;
  error?: {
    message: string;
  }
}

export interface GeneratedDocument {
  type: string;
  content: string;
  url?: string;
}

// Document list response types
export interface DocumentListItem {
  document_id: string;
  project_name: string;
  content: string;
  design_type: string;
  status: string;
  updated_at: string;
  doc_type?: string;
}

export interface DocumentListResponse {
  status: "success" | "error";
  documents?: DocumentListItem[];
  message?: string;
}

export type StepName = "planning" | "analysis" | "design";

// Regenerate response (proxied by /api/workflow/:stepName/regenerate/:projectId/:documentId)
export interface RegenerateDocumentResponse {
  status: "success" | "error";
  message?: string;
  result?: any; // Backend response data
}
