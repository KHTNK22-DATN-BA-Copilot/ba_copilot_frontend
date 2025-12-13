import { useState } from "react";
import { PlanningDocument } from "../types";
import { getAllDocIds } from "../documents";

export function useDocumentSelection() {
  const [selectedPlanningDocs, setSelectedPlanningDocs] = useState<string[]>(getAllDocIds());
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleDocumentToggle = (docId: string) => {
    setSelectedPlanningDocs(prev =>
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

  const isDocumentSelected = (doc: PlanningDocument): boolean => {
    if (selectedPlanningDocs.includes(doc.id)) return true;
    if (doc.subItems) {
      return doc.subItems.some(sub => selectedPlanningDocs.includes(sub.id));
    }
    return false;
  };

  const isDocumentIndeterminate = (doc: PlanningDocument): boolean => {
    if (!doc.subItems) return false;
    const selectedSubItems = doc.subItems.filter(sub => 
      selectedPlanningDocs.includes(sub.id)
    );
    return selectedSubItems.length > 0 && selectedSubItems.length < doc.subItems.length;
  };

  const handleParentToggle = (doc: PlanningDocument) => {
    if (!doc.subItems) {
      handleDocumentToggle(doc.id);
      return;
    }

    const allSelected = doc.subItems.every(sub => 
      selectedPlanningDocs.includes(sub.id)
    );
    
    if (allSelected) {
      // Deselect all sub-items
      setSelectedPlanningDocs(prev =>
        prev.filter(id => !doc.subItems!.some(sub => sub.id === id))
      );
    } else {
      // Select all sub-items
      const subItemIds = doc.subItems.map(sub => sub.id);
      setSelectedPlanningDocs(prev => [
        ...prev.filter(id => !doc.subItems!.some(sub => sub.id === id)),
        ...subItemIds
      ]);
    }
  };

  const getSelectedSubItems = (doc: PlanningDocument) => {
    return doc.subItems?.filter(sub =>
      selectedPlanningDocs.includes(sub.id)
    ) || [];
  };

  return {
    selectedPlanningDocs,
    expandedItems,
    handleDocumentToggle,
    handleToggleExpand,
    isDocumentSelected,
    isDocumentIndeterminate,
    handleParentToggle,
    getSelectedSubItems,
  };
}
