export interface SubItem {
  id: string;
  name: string;
}

export interface DesignDocument {
  id: string;
  name: string;
  description: string;
  subItems?: SubItem[];
}

export interface GenerateDesignPayload {
  prompt: string;
  selectedFiles: string[];
  selectedDocIds: string[];
  projectId?: string;
}

export interface DesignApiResponse {
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
