import { useState } from "react";
import { DesignDocument } from "../types";
import { getAllDocIds } from "../documents";

export function useDocumentSelection() {
  const [selectedDesignDocs, setSelectedDesignDocs] = useState<string[]>(getAllDocIds());
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleDocumentToggle = (docId: string) => {
    setSelectedDesignDocs(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleToggleExpand = (docId: string) => {
    setExpandedItems(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const isDocumentSelected = (doc: DesignDocument): boolean => {
    if (selectedDesignDocs.includes(doc.id)) return true;
    if (doc.subItems) {
      return doc.subItems.some(sub => selectedDesignDocs.includes(sub.id));
    }
    return false;
  };

  const isDocumentIndeterminate = (doc: DesignDocument): boolean => {
    if (!doc.subItems) return false;
    const selectedSubItems = doc.subItems.filter(sub => 
      selectedDesignDocs.includes(sub.id)
    );
    return selectedSubItems.length > 0 && selectedSubItems.length < doc.subItems.length;
  };

  const handleParentToggle = (doc: DesignDocument) => {
    if (!doc.subItems) {
      handleDocumentToggle(doc.id);
      return;
    }

    const allSelected = doc.subItems.every(sub => 
      selectedDesignDocs.includes(sub.id)
    );
    
    if (allSelected) {
      // Deselect all sub-items
      setSelectedDesignDocs(prev =>
        prev.filter(id => !doc.subItems!.some(sub => sub.id === id))
      );
    } else {
      // Select all sub-items
      const subItemIds = doc.subItems.map(sub => sub.id);
      setSelectedDesignDocs(prev => [
        ...prev.filter(id => !doc.subItems!.some(sub => sub.id === id)),
        ...subItemIds
      ]);
    }
  };

  const getSelectedSubItems = (doc: DesignDocument) => {
    return doc.subItems?.filter(sub =>
      selectedDesignDocs.includes(sub.id)
    ) || [];
  };

  return {
    selectedDesignDocs,
    expandedItems,
    handleDocumentToggle,
    handleToggleExpand,
    isDocumentSelected,
    isDocumentIndeterminate,
    handleParentToggle,
    getSelectedSubItems,
  };
}
