import { 
  GenerateWorkflowPayload, 
  WorkflowWSMessage, 
  DocumentListResponse, 
  RegenerateDocumentResponse, 
  StepName 
} from "./types";
import {
  getWorkflowDocumentsByStep,
  regenerateWorkflowDocument,
  exportWorkflowDocument,
} from "@/actions/workflow.action";

/**
 * ============================================================================
 * CONFIGURATION
 * ============================================================================
 */

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
 * Get JWT token from server route that reads httpOnly cookie.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[Auth] Failed to get token:", response.status);
      return null;
    }

    const data = await response.json();

    if (!data?.access_token) {
      console.error("[Auth] Missing token in response");
      return null;
    }

    return data.access_token as string;
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
    const response = await getWorkflowDocumentsByStep(stepName, projectId);

    if (!response.success) {
      return {
        status: "error",
        message: response.message || `Failed to fetch ${stepName} documents`,
      };
    }

    return {
      status: "success",
      documents: response.data?.documents || [],
    };
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
    const response = await regenerateWorkflowDocument(
      stepName,
      projectId,
      documentId,
      description,
    );

    if (!response.success) {
      return {
        status: "error",
        message: response.message || "Failed to regenerate document",
      };
    }

    return {
      status: "success",
      result: response.data,
    };
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
    const response = await exportWorkflowDocument(documentId);
    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to export document");
    }

    const byteCharacters = atob(response.data.base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i += 1) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: response.data.contentType || "text/markdown",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    link.download = response.data.filename || `${documentId}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(`[API] exportDocument error:`, error);
    throw error;
  }
}

export async function fetchAllDocument(projectId: string): Promise<string[]> {
  const [planningDocuments, analysisDocuments, designDocuments] = await Promise.all([
    getPlanningDocuments(projectId),
    getAnalysisDocuments(projectId),
    getDesignDocuments(projectId),
  ]);

  if (
    planningDocuments.documents &&
    analysisDocuments.documents &&
    designDocuments.documents
  ) {
    return [
      ...planningDocuments.documents.map((doc) =>
        doc.doc_type ? doc.doc_type : doc.design_type
      ),
      ...analysisDocuments.documents.map((doc) =>
        doc.doc_type ? doc.doc_type : doc.design_type
      ),
      ...designDocuments.documents.map((doc) =>
        doc.doc_type ? doc.doc_type : doc.design_type
      ),
    ];
  }

  return [];
}

/**
 * ============================================================================
 * CONVENIENCE METHODS - Step-specific document retrieval
 * ============================================================================
 */

