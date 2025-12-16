// Common interfaces shared across all workflow steps

export interface SubItem {
  id: string;
  name: string;
}

export interface WorkflowDocument {
  id: string;
  name: string;
  description: string;
  subItems?: SubItem[];
}

export interface GenerateWorkflowPayload {
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
