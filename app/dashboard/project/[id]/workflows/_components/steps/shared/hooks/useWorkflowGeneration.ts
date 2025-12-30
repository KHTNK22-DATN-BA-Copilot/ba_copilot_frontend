import { useState, useRef, useCallback } from "react";
import { generateWorkflowDocumentsWS, getAuthToken } from "../api";
import { GenerateWorkflowPayload, WorkflowWSMessage, GeneratedDocument } from "../types";

export function useWorkflowGeneration(onGenerate?: () => void) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentDocument, setCurrentDocument] = useState<string>("");
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);

  const handleWSMessage = useCallback((message: WorkflowWSMessage) => {
    console.log("[useWorkflowGeneration] WebSocket message:", message);

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
      //setGeneratedDocuments(message.result.documents);
      setIsGenerating(false);
      setProgress(100);
      
      if (onGenerate) {
        onGenerate();
      }
    }

    // Handle error
    if (message.status === "error") {
      setError(message.message || "Generation failed");
      setIsGenerating(false);
    }
  }, [onGenerate]);

  const generateDocuments = useCallback(async (
    payload: GenerateWorkflowPayload,
    projectId: string,
    stepName: 'planning' | 'analysis' | 'design'
  ) => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setCurrentDocument("");
    setGeneratedDocuments([]);
    
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
    generatedDocuments,
    generateDocuments,
    cancelGeneration,
    resetGeneration,
  };
}
