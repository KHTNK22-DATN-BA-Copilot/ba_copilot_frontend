import { GenerateWorkflowPayload, WorkflowApiResponse, JobStatusResponse } from "./types";

/**
 * Base configuration for workflow API endpoints
 */
const API_CONFIG = {
  baseUrl: "/api/workflow",
  endpoints: {
    generate: "/generate",
    status: "/status",
  },
  headers: {
    "Content-Type": "application/json",
  },
} as const;

/**
 * Generate workflow documents based on the provided payload
 * @param payload - The generation payload including prompt, files, and selected documents
 * @returns Promise with job ID and status
 */
export async function generateWorkflowDocuments(
  payload: GenerateWorkflowPayload
): Promise<WorkflowApiResponse> {
  try {
    const endpoint = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.generate}`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: API_CONFIG.headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to generate documents: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("generateWorkflowDocuments error:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Check the status of a workflow generation job
 * @param jobId - The job ID to check
 * @returns Promise with job status information
 */
export async function checkWorkflowJobStatus(
  jobId: string
): Promise<JobStatusResponse> {
  try {
    const endpoint = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.status}/${jobId}`;
    
    const response = await fetch(endpoint, {
      method: "GET",
      headers: API_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to check job status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("checkWorkflowJobStatus error:", error);
    return {
      jobId,
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Cancel a running workflow generation job
 * @param jobId - The job ID to cancel
 * @returns Promise indicating success or failure
 */
export async function cancelWorkflowJob(jobId: string): Promise<boolean> {
  try {
    const endpoint = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.status}/${jobId}/cancel`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: API_CONFIG.headers,
    });

    return response.ok;
  } catch (error) {
    console.error("cancelWorkflowJob error:", error);
    return false;
  }
}
