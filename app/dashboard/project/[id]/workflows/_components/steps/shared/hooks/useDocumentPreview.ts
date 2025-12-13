import { useState } from "react";
import { WorkflowDocument } from "../types";

export function useDocumentPreview(
  documents: WorkflowDocument[],
  documentFiles: Record<string, string>
) {
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
          const docName = findDocumentName(docId, documents);
          setPreviewContent(`# ${docName}\n\nContent not available yet.`);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        const docName = findDocumentName(docId, documents);
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
    // Find document name from main items
    const mainDoc = documents.find(doc => doc.id === docId);
    if (mainDoc) return mainDoc.name;

    // Find document name from sub-items
    for (const doc of documents) {
      if (doc.subItems) {
        const subItem = doc.subItems.find(sub => sub.id === docId);
        if (subItem) return `${doc.name} - ${subItem.name}`;
      }
    }
    return "Document Preview";
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

function findDocumentName(docId: string, documents: WorkflowDocument[]): string {
  const mainDoc = documents.find(doc => doc.id === docId);
  if (mainDoc) return mainDoc.name;

  for (const doc of documents) {
    if (doc.subItems) {
      const subItem = doc.subItems.find(sub => sub.id === docId);
      if (subItem) return subItem.name;
    }
  }
  return "Document";
}
