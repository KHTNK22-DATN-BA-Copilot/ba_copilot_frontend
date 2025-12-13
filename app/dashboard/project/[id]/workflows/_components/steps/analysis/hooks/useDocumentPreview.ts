import { useState } from "react";
import { analysisDocuments, documentFiles } from "../documents";

export function useDocumentPreview() {
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePreviewDocument = async (docId: string) => {
    setPreviewDocument(docId);
    setIsLoading(true);

    const filePath = documentFiles[docId];
    if (filePath) {
      try {
        const response = await fetch(filePath);
        if (response.ok) {
          const content = await response.text();
          setPreviewContent(content);
        } else {
          const docName = findDocumentName(docId);
          setPreviewContent(`# ${docName}\n\nContent not available yet.`);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        const docName = findDocumentName(docId);
        setPreviewContent(`# ${docName}\n\nError loading content.`);
      }
    }
    setIsLoading(false);
  };

  const handleClosePreview = () => {
    setPreviewDocument(null);
    setPreviewContent("");
  };

  const getPreviewTitle = (docId: string): string => {
    const doc = analysisDocuments.find(d => d.id === docId);
    return doc?.name || "Document Preview";
  };

  return {
    previewDocument,
    previewContent,
    isLoading,
    handlePreviewDocument,
    handleClosePreview,
    getPreviewTitle,
  };
}

function findDocumentName(docId: string): string {
  const doc = analysisDocuments.find(d => d.id === docId);
  return doc?.name || "Document";
}
