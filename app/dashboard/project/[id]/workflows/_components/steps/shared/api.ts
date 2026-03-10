import { 
  GenerateWorkflowPayload, 
  WorkflowWSMessage, 
  DocumentListResponse, 
  RegenerateDocumentResponse, 
  StepName 
} from "./types";

/**
 * ============================================================================
 * CONFIGURATION
 * ============================================================================
 */

const WS_DOMAIN = process.env.NEXT_PUBLIC_WS_DOMAIN;
const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;

const API_CONFIG = {
  baseUrl: "/api/workflow",
  headers: {
    "Content-Type": "application/json",
  },
} as const;

const WS_CONFIG = {
  baseUrl: `${process.env.NEXT_PUBLIC_WS_DOMAIN}/api/v1/ws`,
  reconnectAttempts: 3,
  reconnectDelay: 2000,
} as const;

/**
 * ============================================================================
 * AUTHENTICATION
 * ============================================================================
 */

/**
 * Get JWT token from httpOnly cookie via API route
 * @returns Promise with JWT token string or null if not found
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/token', {
      method: 'GET',
      credentials: 'include',
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
 * ============================================================================
 * WEBSOCKET - WORKFLOW GENERATION
 * ============================================================================
 */

/**
 * Generate workflow documents using WebSocket connection
 * Establishes a WebSocket connection to stream workflow generation progress
 * 
 * @param payload - The generation payload with prompt and file references
 * @param projectId - The project ID
 * @param stepName - The workflow step (planning, analysis, or design)
 * @param token - JWT authentication token
 * @param onMessage - Callback for WebSocket messages
 * @returns WebSocket connection instance
 */
export function generateWorkflowDocumentsWS(
  payload: GenerateWorkflowPayload,
  projectId: string,
  stepName: 'planning' | 'analysis' | 'design',
  token: string,
  onMessage: (message: WorkflowWSMessage) => void
): WebSocket {
  const wsUrl = `${WS_CONFIG.baseUrl}/projects/${projectId}/${stepName}?token=${encodeURIComponent(token)}`;
  
  console.log(`[WebSocket] Connecting to ${stepName} step`, { projectId, stepName });
  
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log(`[WebSocket] Connected for ${stepName} step`);
    ws.send(JSON.stringify(payload));
    console.log(`[WebSocket] Payload sent:`, payload);
  };

  ws.onmessage = (event) => {
    try {
      const message: WorkflowWSMessage = JSON.parse(event.data);
      console.log(`[WebSocket] Message received:`, message);
      onMessage(message);
      
      if (message.status === "completed" || message.status === "error") {
        console.log(`[WebSocket] Closing - status: ${message.status}`);
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
    console.log(`[WebSocket] Closed for ${stepName} step`, { 
      code: event.code, 
      reason: event.reason 
    });
    onMessage({
      type: "socket_closed",
      message: "WebSocket connection closed",
      data: { 
        code: event.code, 
        reason: event.reason, 
        wasClean: event.wasClean 
      },
    });
  };

  return ws;
}

/**
 * ============================================================================
 * DOCUMENT MANAGEMENT
 * ============================================================================
 */

/**
 * Get list of documents for a specific workflow step
 * 
 * @param stepName - The workflow step (planning, analysis, or design)
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
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch ${stepName} documents: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`[API] getDocumentsList error (${stepName}):`, error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Regenerate a specific document
 * 
 * @param stepName - The workflow step (planning, analysis, or design)
 * Regenerate a specific document for a step and project
 * @param stepName - The workflow step name (planning, analysis, design)
 * @param projectId - The project ID
 * @param documentId - The document ID to regenerate
 * @param description - Optional prompt/instructions for regeneration
 * @returns Promise with regenerated document data
 */
export async function regenerateDocument(
  stepName: StepName,
  projectId: string,
  documentId: string,
  description?: string
): Promise<RegenerateDocumentResponse> {
  try {
    const endpoint = `${API_CONFIG.baseUrl}/${stepName}/regenerate/${projectId}/${documentId}`;
    const body = description ? JSON.stringify({ description }) : undefined;

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: API_CONFIG.headers,
      credentials: "include",
      ...(body && { body }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to regenerate document: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`[API] regenerateDocument error (${stepName}):`, error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get planning documents for a project
 */
export async function getPlanningDocuments(
  projectId: string
): Promise<DocumentListResponse> {
  return getDocumentsList("planning", projectId);
}

/**
 * Get analysis documents for a project
 */
export async function getAnalysisDocuments(
  projectId: string
): Promise<DocumentListResponse> {
  return getDocumentsList("analysis", projectId);
}

/**
 * Get design documents for a project
 */
export async function getDesignDocuments(
  projectId: string
): Promise<DocumentListResponse> {
  return getDocumentsList("design", projectId);
}

/**
 * Export a document as a markdown file
 * Downloads the document directly from backend API
 * 
 * @param stepName - The workflow step (not currently used but kept for consistency)
 * @param projectId - The project ID (not currently used but kept for consistency)
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
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    const endpoint = `${BACKEND_DOMAIN}/api/v1/files/export/${documentId}`;
    
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to export document: ${response.status}`
      );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    // Extract filename from Content-Disposition or use default
    const contentDisposition = response.headers.get("Content-Disposition");
    const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/i);
    const filename = filenameMatch?.[1] || `${documentId}.md`;
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(`[API] exportDocument error:`, error);
    throw error;
  }
}

/**
 * ============================================================================
 * CONVENIENCE METHODS - Step-specific document retrieval
 * ============================================================================
 */

