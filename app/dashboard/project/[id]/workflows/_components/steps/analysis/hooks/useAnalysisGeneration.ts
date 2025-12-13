import { useState } from "react";
import { generateAnalysisDocuments } from "../api";
import { GenerateAnalysisPayload } from "../types";

export function useAnalysisGeneration(onGenerate?: () => void) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const generateDocuments = async (payload: GenerateAnalysisPayload) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Sending generate request:", payload);
      const response = await generateAnalysisDocuments(payload);
      
      if (response.status === "error") {
        setError("Failed to generate documents. Please try again.");
        return false;
      }

      setJobId(response.jobId || null);
      
      // Call the external onGenerate callback if provided
      if (onGenerate) {
        onGenerate();
      }
      
      return true;
    } catch (err) {
      console.error("Error generating documents:", err);
      setError("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const resetGeneration = () => {
    setIsGenerating(false);
    setError(null);
    setJobId(null);
  };

  return {
    isGenerating,
    error,
    jobId,
    generateDocuments,
    resetGeneration,
  };
}
