import { GeneratePlanningPayload, PlanningApiResponse, JobStatusResponse } from "./types";

/**
 * Base configuration for planning API endpoints
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
 * Generate planning documents based on the provided payload
 * @param payload - The generation payload including prompt, files, and selected documents
 * @returns Promise with job ID and status
 */
export async function generatePlanningDocuments(
  payload: GeneratePlanningPayload
): Promise<PlanningApiResponse> {
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
    console.error("generatePlanningDocuments error:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Check the status of a planning generation job
 * @param jobId - The job ID to check
 * @returns Promise with job status information
 */
export async function checkPlanningJobStatus(
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
    console.error("checkPlanningJobStatus error:", error);
    return {
      jobId,
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Cancel a running planning generation job
 * @param jobId - The job ID to cancel
 * @returns Promise indicating success or failure
 */
export async function cancelPlanningJob(jobId: string): Promise<boolean> {
  try {
    const endpoint = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.status}/${jobId}/cancel`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: API_CONFIG.headers,
    });

    return response.ok;
  } catch (error) {
    console.error("cancelPlanningJob error:", error);
    return false;
  }
}
