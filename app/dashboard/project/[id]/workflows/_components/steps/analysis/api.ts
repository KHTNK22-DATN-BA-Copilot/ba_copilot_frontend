import { GenerateAnalysisPayload, AnalysisApiResponse, JobStatusResponse } from "./types";

/**
 * Base configuration for analysis API endpoints
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
 * Generate analysis documents based on the provided payload
 * @param payload - The generation payload including prompt, files, and selected documents
 * @returns Promise with job ID and status
 */
export async function generateAnalysisDocuments(
  payload: GenerateAnalysisPayload
): Promise<AnalysisApiResponse> {
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
    console.error("generateAnalysisDocuments error:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Check the status of an analysis generation job
 * @param jobId - The job ID to check
 * @returns Promise with job status information
 */
export async function checkAnalysisJobStatus(
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
    console.error("checkAnalysisJobStatus error:", error);
    return {
      jobId,
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Cancel a running analysis generation job
 * @param jobId - The job ID to cancel
 * @returns Promise indicating success or failure
 */
export async function cancelAnalysisJob(jobId: string): Promise<boolean> {
  try {
    const endpoint = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.status}/${jobId}/cancel`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: API_CONFIG.headers,
    });

    return response.ok;
  } catch (error) {
    console.error("cancelAnalysisJob error:", error);
    return false;
  }
}
