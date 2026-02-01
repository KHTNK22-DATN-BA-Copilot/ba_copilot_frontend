import { GenerateWorkflowPayload, LegacyGenerateWorkflowPayload, WorkflowApiResponse, JobStatusResponse, WorkflowWSMessage, DocumentListResponse, RegenerateDocumentResponse, StepName } from "./types";

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
 * WebSocket configuration for workflow API
 */
const WS_CONFIG = {
  baseUrl: "ws://localhost:8010/api/v1/ws",
  reconnectAttempts: 3,
  reconnectDelay: 2000,
} as const;

const BaseAPIURL = process.env.NEXT_PUBLIC_BASE_API_URL || "";

/**
 * Generate workflow documents based on the provided payload (Legacy)
 * @param payload - The generation payload including prompt, files, and selected documents
 * @returns Promise with job ID and status
 * @deprecated Use generateWorkflowDocumentsWS for WebSocket connection
 */
export async function generateWorkflowDocuments(
  payload: LegacyGenerateWorkflowPayload
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
 * Get JWT token from httpOnly cookie via API route
 * @returns Promise with JWT token string or null if not found
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/token', {
      method: 'GET',
      credentials: 'include', // Important: include cookies
    });

    if (!response.ok) {
      console.error('[Auth] Failed to get token:', response.status);
      return null;
    }

    const data = await response.json();
    return data.access_token || null;
  } catch (error) {
    console.error('[Auth] Error getting auth token:', error);
    return null;
  }
}

/**
 * Generate workflow documents using WebSocket connection
 * @param payload - The generation payload
 * @param projectId - The project ID
 * @param stepName - The workflow step name (planning, analysis, design)
 * @param token - JWT authentication token (passed as query parameter)
 * @param onMessage - Callback for WebSocket messages
 * @returns WebSocket connection
 */
export function generateWorkflowDocumentsWS(
  payload: GenerateWorkflowPayload,
  projectId: string,
  stepName: 'planning' | 'analysis' | 'design',
  token: string,
  onMessage: (message: WorkflowWSMessage) => void
): WebSocket {
  // Token must be passed as query parameter as required by backend
  const wsUrl = `${WS_CONFIG.baseUrl}/projects/${projectId}/${stepName}?token=${encodeURIComponent(token)}`;
  
  console.log(`[WebSocket] Connecting to: ${stepName} step`, { projectId, stepName });
  console.log(`[WebSocket] URL: ${wsUrl.replace(/token=.+/, 'token=***')}`); // Hide token in logs
  
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log(`[WebSocket] Connected for ${stepName} step`);
    // Send the payload once connected
    const payloadStr = JSON.stringify(payload);
    console.log(`[WebSocket] Sending payload:`, payload);
    ws.send(payloadStr);
  };

  ws.onmessage = (event) => {
    try {
      const message: WorkflowWSMessage = JSON.parse(event.data);
      console.log(`[WebSocket] Message received:`, message);
      onMessage(message);
      
      // Auto-close on completion or error
      if (message.status === "completed" || message.status === "error") {
        console.log(`[WebSocket] Closing connection - status: ${message.status}`);
        ws.close();
      }
    } catch (error) {
      console.error("[WebSocket] Error parsing message:", error);
    }
  };

  ws.onerror = (error) => {
    console.error("[WebSocket] Connection error:", error);
    onMessage({
      status: "error",
      message: "WebSocket connection error",
    });
  };

  ws.onclose = (event) => {
    console.log(`[WebSocket] Closed for ${stepName} step`, { code: event.code, reason: event.reason });
    // Do not treat a socket close as a successful completion.
    // The backend should explicitly send completion events (e.g., step_finished).
    onMessage({
      type: "socket_closed",
      message: "WebSocket connection closed",
      data: { code: event.code, reason: event.reason, wasClean: event.wasClean },
    });
  };

  return ws;
}

/**
 * Get list of documents for a specific step and project
 * @param stepName - The workflow step name (planning, analysis, design)
 * @param projectId - The project ID
 * @returns Promise with list of documents
 */
export async function getDocumentsList(
  stepName: StepName,
  projectId: string
): Promise<DocumentListResponse> {
  try {
    const endpoint = `${API_CONFIG.baseUrl}/${stepName}/list/${projectId}`;
    
    const response = await fetch(endpoint, {
      method: "GET",
      headers: API_CONFIG.headers,
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch ${stepName} documents: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`getDocumentsList error (${stepName}):`, error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Regenerate a specific document for a step and project
 * @param stepName - The workflow step name (planning, analysis, design)
 * @param projectId - The project ID
 * @param documentId - The document ID
 */
export async function regenerateDocument(
  stepName: StepName,
  projectId: string,
  documentId: string
): Promise<RegenerateDocumentResponse> {
  try {
    const endpoint = `${API_CONFIG.baseUrl}/${stepName}/regenerate/${projectId}/${documentId}`;

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: API_CONFIG.headers,
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to regenerate document: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`regenerateDocument error (${stepName}):`, error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get list of planning documents for a project
 * @param projectId - The project ID
 * @returns Promise with list of planning documents
 */
export async function getPlanningDocuments(
  projectId: string
): Promise<DocumentListResponse> {
  return getDocumentsList("planning", projectId);
}

/**
 * Get list of analysis documents for a project
 * @param projectId - The project ID
 * @returns Promise with list of analysis documents
 */
export async function getAnalysisDocuments(
  projectId: string
): Promise<DocumentListResponse> {
  return getDocumentsList("analysis", projectId);
}

/**
 * Get list of design documents for a project
 * @param projectId - The project ID
 * @returns Promise with list of design documents
 */
export async function getDesignDocuments(
  projectId: string
): Promise<DocumentListResponse> {
  return getDocumentsList("design", projectId);
}

/**
 * Export a document as markdown file
 * @param stepName - The workflow step name (planning, analysis, design)
 * @param projectId - The project ID
 * @param documentId - The document ID to export
 * @returns Promise that resolves when download starts
 */
export async function exportDocument(
  stepName: StepName,
  projectId: string,
  documentId: string
): Promise<void> {
  try {
    // Call backend API endpoint directly
    const endpoint = `/api/v1/files/export/${documentId}`;
    
    const response = await fetch(endpoint, {
      method: "GET",
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to export document: ${response.status}`
      );
    }

    // Get the blob from response
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    // Extract filename from Content-Disposition header or use default
    const contentDisposition = response.headers.get("Content-Disposition");
    const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/i);
    const filename = filenameMatch?.[1] || `${documentId}.md`;
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(`exportDocument error (${stepName}):`, error);
    throw error;
  }
}

