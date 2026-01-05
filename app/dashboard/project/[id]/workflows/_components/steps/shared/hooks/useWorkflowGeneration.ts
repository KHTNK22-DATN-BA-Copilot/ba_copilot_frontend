import { useState, useRef, useCallback } from "react";
import { generateWorkflowDocumentsWS, getAuthToken } from "../api";
import { DocumentGenerationStatus, GenerateWorkflowPayload, WorkflowWSMessage, GeneratedDocument } from "../types";

export function useWorkflowGeneration(
  onGenerate?: () => void,
  onGenerationComplete?: () => void
) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentDocument, setCurrentDocument] = useState<string>("");
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [documentStatuses, setDocumentStatuses] = useState<Record<string, DocumentGenerationStatus>>({});
  const docTypesRef = useRef<string[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const isCancelingRef = useRef(false);
  const isFinishedRef = useRef(false);

  const recomputeProgress = useCallback((nextStatuses: Record<string, DocumentGenerationStatus>) => {
    const total = docTypesRef.current.length;
    if (total === 0) return;
    const completed = docTypesRef.current.reduce((acc, t) => acc + (nextStatuses[t] === "completed" ? 1 : 0), 0);
    const pct = Math.round((completed / total) * 100);
    setProgress(pct);
  }, []);

  const setDocStatus = useCallback((docType: string, status: DocumentGenerationStatus) => {
    setDocumentStatuses((prev) => {
      const next = { ...prev, [docType]: status };
      recomputeProgress(next);
      return next;
    });
  }, [recomputeProgress]);

  const handleWSMessage = useCallback((message: WorkflowWSMessage) => {
    console.log("[useWorkflowGeneration] WebSocket message:", message);

    // Handle socket close separately (to avoid treating user cancel as success)
    if (message.type === "socket_closed") {
      if (isCancelingRef.current || isFinishedRef.current) {
        return;
      }
      setError(message.message || "WebSocket connection closed unexpectedly");
      setIsGenerating(false);
      return;
    }

    const docType = message.doc_type ?? message.currentDocument;

    // Map backend events to per-document status
    if (message.type === "doc_start" && docType) {
      setDocStatus(docType, "processing");
      setCurrentDocument(docType);
    }

    if (message.type === "doc_completed" && docType) {
      setDocStatus(docType, "completed");
    }

    // Update progress
    if (message.progress !== undefined) {
      setProgress(message.progress);
    }

    // Update current document
    if (message.currentDocument) {
      setCurrentDocument(message.currentDocument);
    }

    // Handle completion
    if (message.type === "step_finished" || message.status === "completed") {
      isFinishedRef.current = true;
      //setGeneratedDocuments(message.result.documents);
      // Mark any remaining docs as completed to avoid hanging spinners
      setDocumentStatuses((prev) => {
        const next: Record<string, DocumentGenerationStatus> = { ...prev };
        for (const t of docTypesRef.current) {
          if (!next[t] || next[t] === "pending" || next[t] === "processing") {
            next[t] = "completed";
          }
        }
        recomputeProgress(next);
        return next;
      });
      setIsGenerating(false);
      setProgress(100);
      
      if (onGenerate) {
        onGenerate();
      }

      // Call the completion callback to fetch documents list
      if (onGenerationComplete) {
        onGenerationComplete();
      }
    }

    // Handle error
    if (message.status === "error") {
      isFinishedRef.current = true;
      setError(message.message || "Generation failed");
      if (docType) {
        setDocStatus(docType, "error");
      }
      setIsGenerating(false);
    }
  }, [onGenerate, onGenerationComplete, recomputeProgress, setDocStatus]);

  const generateDocuments = useCallback(async (
    payload: GenerateWorkflowPayload,
    projectId: string,
    stepName: 'planning' | 'analysis' | 'design'
  ) => {
    isCancelingRef.current = false;
    isFinishedRef.current = false;
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setCurrentDocument("");
    setGeneratedDocuments([]);
    // Initialize per-document statuses from payload
    docTypesRef.current = payload.documents?.map((d) => d.type) ?? [];
    const initialStatuses: Record<string, DocumentGenerationStatus> = {};
    for (const t of docTypesRef.current) {
      initialStatuses[t] = "pending";
    }
    setDocumentStatuses(initialStatuses);
    
    try {
      console.log("[useWorkflowGeneration] Getting authentication token...");
      const token = await getAuthToken();
      
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      console.log("[useWorkflowGeneration] Token retrieved successfully");
      console.log("[useWorkflowGeneration] Starting generation:", { payload, projectId, stepName });

      // Create WebSocket connection with token as query parameter
      wsRef.current = generateWorkflowDocumentsWS(
        payload,
        projectId,
        stepName,
        token,
        handleWSMessage
      );

      return true;
    } catch (err) {
      console.error("[useWorkflowGeneration] Error generating documents:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setIsGenerating(false);
      return false;
    }
  }, [handleWSMessage]);

  const cancelGeneration = useCallback(() => {
    console.log("[useWorkflowGeneration] Canceling generation");
    isCancelingRef.current = true;
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsGenerating(false);
    setProgress(0);
    setCurrentDocument("");
  }, []);

  const resetGeneration = useCallback(() => {
    console.log("[useWorkflowGeneration] Resetting generation state");
    isCancelingRef.current = false;
    isFinishedRef.current = false;
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsGenerating(false);
    setError(null);
    setProgress(0);
    setCurrentDocument("");
    setGeneratedDocuments([]);
  }, []);

  return {
    isGenerating,
    error,
    progress,
    currentDocument,
    documentStatuses,
    generatedDocuments,
    generateDocuments,
    cancelGeneration,
    resetGeneration,
  };
}
