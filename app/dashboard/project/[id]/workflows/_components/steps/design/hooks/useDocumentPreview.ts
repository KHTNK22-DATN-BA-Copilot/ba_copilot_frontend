import { useState } from "react";
import { designDocuments, documentFiles } from "../documents";

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
    // Find document name from main items
    const mainDoc = designDocuments.find(doc => doc.id === docId);
    if (mainDoc) return mainDoc.name;

    // Find document name from sub-items
    for (const doc of designDocuments) {
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

function findDocumentName(docId: string): string {
  const mainDoc = designDocuments.find(doc => doc.id === docId);
  if (mainDoc) return mainDoc.name;

  for (const doc of designDocuments) {
    if (doc.subItems) {
      const subItem = doc.subItems.find(sub => sub.id === docId);
      if (subItem) return subItem.name;
    }
  }
  return "Document";
}
