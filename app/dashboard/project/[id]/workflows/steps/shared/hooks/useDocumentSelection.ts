import { useState } from "react";
import { WorkflowDocument } from "../types";

export function useDocumentSelection(initialDocIds: string[]) {
  const [selectedDocs, setSelectedDocs] = useState<string[]>(initialDocIds);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleDocumentToggle = (docId: string) => {
    setSelectedDocs(prev =>
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

  const isDocumentSelected = (doc: WorkflowDocument): boolean => {
    if (selectedDocs.includes(doc.id)) return true;
    if (doc.subItems) {
      return doc.subItems.some(sub => selectedDocs.includes(sub.id));
    }
    return false;
  };

  const isDocumentIndeterminate = (doc: WorkflowDocument): boolean => {
    if (!doc.subItems) return false;
    const selectedSubItems = doc.subItems.filter(sub => 
      selectedDocs.includes(sub.id)
    );
    return selectedSubItems.length > 0 && selectedSubItems.length < doc.subItems.length;
  };

  const handleParentToggle = (doc: WorkflowDocument) => {
    if (!doc.subItems) {
      handleDocumentToggle(doc.id);
      return;
    }

    const allSelected = doc.subItems.every(sub => 
      selectedDocs.includes(sub.id)
    );
    
    if (allSelected) {
      // Deselect all sub-items
      setSelectedDocs(prev =>
        prev.filter(id => !doc.subItems!.some(sub => sub.id === id))
      );
    } else {
      // Select all sub-items
      const subItemIds = doc.subItems.map(sub => sub.id);
      setSelectedDocs(prev => [
        ...prev.filter(id => !doc.subItems!.some(sub => sub.id === id)),
        ...subItemIds
      ]);
    }
  };

  const getSelectedSubItems = (doc: WorkflowDocument) => {
    return doc.subItems?.filter(sub =>
      selectedDocs.includes(sub.id)
    ) || [];
  };

  const handleSelectAll = (documents: WorkflowDocument[]) => {
    const allDocIds: string[] = [];
    documents.forEach(doc => {
      if (doc.subItems) {
        allDocIds.push(...doc.subItems.map(sub => sub.id));
      } else {
        allDocIds.push(doc.id);
      }
    });
    setSelectedDocs(allDocIds);
  };

  const handleDeselectAll = () => {
    setSelectedDocs([]);
  };

  const isAllSelected = (documents: WorkflowDocument[]): boolean => {
    if (documents.length === 0) return false;
    return documents.every(doc => {
      if (doc.subItems) {
        return doc.subItems.every(sub => selectedDocs.includes(sub.id));
      }
      return selectedDocs.includes(doc.id);
    });
  };

  return {
    selectedDocs,
    expandedItems,
    handleDocumentToggle,
    handleToggleExpand,
    isDocumentSelected,
    isDocumentIndeterminate,
    handleParentToggle,
    getSelectedSubItems,
    handleSelectAll,
    handleDeselectAll,
    isAllSelected,
  };
}
