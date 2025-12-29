import { GenerateWorkflowPayload, LegacyGenerateWorkflowPayload, WorkflowApiResponse, JobStatusResponse, WorkflowWSMessage } from "./types";

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
  };

  return ws;
}
