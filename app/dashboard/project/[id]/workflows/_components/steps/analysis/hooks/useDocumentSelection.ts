import { useState } from "react";
import { getAllDocIds } from "../documents";

export function useDocumentSelection() {
  const [selectedAnalysisDocs, setSelectedAnalysisDocs] = useState<string[]>(getAllDocIds());

  const handleDocumentToggle = (docId: string) => {
    setSelectedAnalysisDocs(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const isDocumentSelected = (docId: string): boolean => {
    return selectedAnalysisDocs.includes(docId);
  };

  const selectAllDocuments = () => {
    setSelectedAnalysisDocs(getAllDocIds());
  };

  const deselectAllDocuments = () => {
    setSelectedAnalysisDocs([]);
  };

  return {
    selectedAnalysisDocs,
    handleDocumentToggle,
    isDocumentSelected,
    selectAllDocuments,
    deselectAllDocuments,
  };
}
