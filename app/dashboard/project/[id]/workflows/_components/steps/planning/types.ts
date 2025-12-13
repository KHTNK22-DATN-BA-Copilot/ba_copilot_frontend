export interface SubItem {
  id: string;
  name: string;
}

export interface PlanningDocument {
  id: string;
  name: string;
  description: string;
  subItems?: SubItem[];
}

export interface GeneratePlanningPayload {
  prompt: string;
  selectedFiles: string[];
  selectedDocIds: string[];
  projectId?: string;
}

export interface PlanningApiResponse {
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
