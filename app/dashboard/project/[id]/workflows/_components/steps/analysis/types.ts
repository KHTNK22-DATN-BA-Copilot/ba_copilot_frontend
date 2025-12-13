export interface AnalysisDocument {
  id: string;
  name: string;
  description: string;
}

export interface GenerateAnalysisPayload {
  prompt: string;
  selectedFiles: string[];
  selectedDocIds: string[];
  projectId?: string;
}

export interface AnalysisApiResponse {
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
