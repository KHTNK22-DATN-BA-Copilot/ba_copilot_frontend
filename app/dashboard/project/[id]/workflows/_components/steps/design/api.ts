import { GenerateDesignPayload, DesignApiResponse, JobStatusResponse } from "./types";

/**
 * Base configuration for design API endpoints
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
 * Generate design documents based on the provided payload
 * @param payload - The generation payload including prompt, files, and selected documents
 * @returns Promise with job ID and status
 */
export async function generateDesignDocuments(
  payload: GenerateDesignPayload
): Promise<DesignApiResponse> {
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
    console.error("generateDesignDocuments error:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Check the status of a design generation job
 * @param jobId - The job ID to check
 * @returns Promise with job status information
 */
export async function checkDesignJobStatus(
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
    console.error("checkDesignJobStatus error:", error);
    return {
      jobId,
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Cancel a running design generation job
 * @param jobId - The job ID to cancel
 * @returns Promise indicating success or failure
 */
export async function cancelDesignJob(jobId: string): Promise<boolean> {
  try {
    const endpoint = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.status}/${jobId}/cancel`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: API_CONFIG.headers,
    });

    return response.ok;
  } catch (error) {
    console.error("cancelDesignJob error:", error);
    return false;
  }
}
