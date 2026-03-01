import { useState, useMemo, useCallback } from "react";
import { WorkflowDocument, ConstrainedDocument, ConstrainedSubItem } from "../types";
import {
  DOCUMENT_DEPENDENCIES,
  getRequiredDocs,
  getTransitiveDependents,
} from "../documentDependencies";

// ─── Helpers ─────────────────────────────────────────────────────────

/**
 * Extract all *leaf* document IDs from a WorkflowDocument list.
 * If a document has subItems, we use the sub-item IDs; otherwise the doc ID.
 */
function getLeafIds(documents: WorkflowDocument[]): string[] {
  return documents.flatMap((doc) =>
    doc.subItems ? doc.subItems.map((s) => s.id) : [doc.id],
  );
}

/**
 * Build a human-readable "disabled reason" string from missing required IDs.
 */
function buildDisabledReason(missingIds: string[]): string | undefined {
  if (missingIds.length === 0) return undefined;
  return `Missing: ${missingIds.join(", ")} in your database or checkbox`;
}

// ─── Hook ────────────────────────────────────────────────────────────

export interface UseDocumentConstraintsOptions {
  /** Static document definitions for the current step */
  documents: WorkflowDocument[];
  /**
   * IDs of documents that already exist from **previous** steps
   * (fetched from the API). These count as "available" when evaluating
   * required prerequisites that belong to other steps.
   */
  existingDocIds?: string[];
}

export interface UseDocumentConstraintsReturn {
  /** Documents enriched with computed isChecked / isDisabled / disabledReason */
  constrainedDocuments: ConstrainedDocument[];
  /** Flat list of currently-checked leaf doc IDs (for the generate payload) */
  checkedDocIds: string[];
  /** Toggle a single leaf document */
  toggleDocument: (docId: string) => void;
  /** Toggle a parent document (select/deselect all enabled sub-items) */
  toggleParent: (parentId: string) => void;
  /** Select all documents that can be selected (topological order) */
  selectAll: () => void;
  /** Deselect all documents */
  deselectAll: () => void;
  /** Whether every eligible document is currently checked */
  isAllSelected: boolean;
  /** Expanded parent IDs (for accordion UI) */
  expandedItems: string[];
  /** Toggle expand/collapse of a parent */
  toggleExpand: (docId: string) => void;
}

export function useDocumentConstraints({
  documents,
  existingDocIds = [],
}: UseDocumentConstraintsOptions): UseDocumentConstraintsReturn {
  // Set of leaf IDs that belong to the *current* step
  const stepLeafIds = useMemo(() => new Set(getLeafIds(documents)), [documents]);

  // Set of externally available IDs (from previous steps)
  const externalIds = useMemo(() => new Set(existingDocIds), [existingDocIds]);

  // ── Internal state ────────────────────────────────────────────────
  // Start with all leaf docs checked (matching the previous default behaviour)
  const [checkedSet, setCheckedSet] = useState<Set<string>>(
    () => new Set(getLeafIds(documents)),
  );
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // ── Core constraint computation ───────────────────────────────────

  /**
   * For a given leaf doc ID, determine whether its prerequisites are met.
   * A prerequisite is met if:
   *   - it belongs to the current step AND is in `checkedSet`, OR
   *   - it belongs to a previous step AND is in `externalIds`.
   *
   * Returns the list of **missing** required IDs.
   */
  const getMissing = useCallback(
    (docId: string): string[] => {
      const required = getRequiredDocs(docId);
      return required.filter((reqId) => {
        if(externalIds.has(reqId)) return false; // Available from previous steps
        if (stepLeafIds.has(reqId)) return !checkedSet.has(reqId);
        // External (cross-step) prerequisite
        return !externalIds.has(reqId);
      });
    },
    [checkedSet, stepLeafIds, externalIds],
  );

  // ── Constrained documents (derived / memoised) ────────────────────

  const constrainedDocuments: ConstrainedDocument[] = useMemo(() => {
    return documents.map((doc) => {
      if (doc.subItems && doc.subItems.length > 0) {
        // Parent with sub-items
        const constrainedSubs: ConstrainedSubItem[] = doc.subItems.map(
          (sub) => {
            const missing = getMissing(sub.id);
            const isDisabled = missing.length > 0;
            const isChecked = isDisabled ? false : checkedSet.has(sub.id);
            return {
              id: sub.id,
              name: sub.name,
              isChecked,
              isDisabled,
              disabledReason: buildDisabledReason(missing),
            };
          },
        );

        const anyChecked = constrainedSubs.some((s) => s.isChecked);
        const allDisabled = constrainedSubs.every((s) => s.isDisabled);

        return {
          id: doc.id,
          name: doc.name,
          description: doc.description,
          isChecked: anyChecked,
          isDisabled: allDisabled,
          disabledReason: allDisabled
            ? "All sub-items are disabled due to unmet prerequisites"
            : undefined,
          subItems: constrainedSubs,
        } satisfies ConstrainedDocument;
      }

      // Leaf document (no sub-items)
      const missing = getMissing(doc.id);
      const isDisabled = missing.length > 0;
      const isChecked = isDisabled ? false : checkedSet.has(doc.id);

      return {
        id: doc.id,
        name: doc.name,
        description: doc.description,
        isChecked,
        isDisabled,
        disabledReason: buildDisabledReason(missing),
      } satisfies ConstrainedDocument;
    });
  }, [documents, checkedSet, getMissing]);

  // ── Flat checked IDs for the generate payload ─────────────────────

  const checkedDocIds = useMemo(() => {
    const ids: string[] = [];
    for (const doc of constrainedDocuments) {
      if (doc.subItems) {
        for (const sub of doc.subItems) {
          if (sub.isChecked) ids.push(sub.id);
        }
      } else if (doc.isChecked) {
        ids.push(doc.id);
      }
    }
    return ids;
  }, [constrainedDocuments]);

  // ── Actions ───────────────────────────────────────────────────────

  const toggleDocument = useCallback(
    (docId: string) => {
      setCheckedSet((prev) => {
        const next = new Set(prev);

        if (next.has(docId)) {
          // UNCHECK — cascade: also uncheck all transitive dependents
          // that belong to this step.
          next.delete(docId);
          let transitive: string[] = []
          if(Array.from(externalIds).includes(docId)) {
            // do nothing
          }
          else {
            transitive = getTransitiveDependents(docId, Array.from(externalIds));
          }

          console.info("Transitive dependents of", docId, ":", transitive);
          for (const depId of transitive) {
            if (stepLeafIds.has(depId)) {
              next.delete(depId);
            }
          }
        } else {
          // CHECK — simply add. computeConstraints will auto-enable
          // dependents once their prerequisites are met.
          // But first verify the doc is not disabled (all required met).
          const required = getRequiredDocs(docId);
          const allMet = required.every((reqId) => {
            if (stepLeafIds.has(reqId) || externalIds.has(reqId)) return true;
            return false;
          });
          if (allMet) {
            next.add(docId);
          }
        }

        return next;
      });
    },
    [stepLeafIds, externalIds],
  );

  const toggleParent = useCallback(
    async (parentId: string) => {
      const parentDoc = documents.find((d) => d.id === parentId);
      const transitive = getTransitiveDependents(parentId, Array.from(externalIds));
      if (!parentDoc?.subItems) {
        // Treat as leaf toggle
        toggleDocument(parentId);
        return;
      }

      setCheckedSet((prev) => {
        const next = new Set(prev);

        // Determine which sub-items are currently enabled (prerequisites met)
        const enabledSubs = parentDoc.subItems!.filter((sub) => {
          const required = getRequiredDocs(sub.id);
          return required.every((reqId) => {
            if (stepLeafIds.has(reqId)) return next.has(reqId);
            return externalIds.has(reqId);
          });
        });

        const allEnabledChecked = enabledSubs.every((sub) => next.has(sub.id));

        if (allEnabledChecked && enabledSubs.length > 0) {
          // Deselect all — cascade only for sub-items NOT persisted in DB
          for (const sub of enabledSubs) {
            next.delete(sub.id);

            // Only cascade if this sub-item doesn't exist in DB
            if (!externalIds.has(sub.id)) {
              for (const depId of transitive) {
                if (stepLeafIds.has(depId)) {
                  next.delete(depId);
                }
              }
            }
          }
        } else {
          // Select all enabled sub-items
          for (const sub of enabledSubs) {
            next.add(sub.id);
          }
        }

        return next;
      });
    },
    [documents, toggleDocument, stepLeafIds, externalIds],
  );

  /**
   * Select all documents in topological order so that prerequisites
   * are checked before their dependents.
   */
  const selectAll = useCallback(() => {
    setCheckedSet(() => {
      const next = new Set<string>();

      // Topological ordering: repeatedly pick docs whose required are met
      const remaining = new Set(stepLeafIds);
      let changed = true;

      while (changed) {
        changed = false;
        for (const docId of remaining) {
          const required = getRequiredDocs(docId);
          const allMet = required.every((reqId) => {
            if (stepLeafIds.has(reqId)) return next.has(reqId);
            return externalIds.has(reqId);
          });
          if (allMet) {
            next.add(docId);
            remaining.delete(docId);
            changed = true;
          }
        }
      }
      // Any remaining docs have unmet cross-step prerequisites — leave unchecked

      return next;
    });
  }, [stepLeafIds, externalIds]);

  const deselectAll = useCallback(() => {
    setCheckedSet(new Set());
  }, []);

  const isAllSelected = useMemo(() => {
    // "All selected" means every doc that CAN be selected IS selected
    for (const doc of constrainedDocuments) {
      if (doc.subItems) {
        for (const sub of doc.subItems) {
          if (!sub.isDisabled && !sub.isChecked) return false;
        }
      } else {
        if (!doc.isDisabled && !doc.isChecked) return false;
      }
    }
    return true;
  }, [constrainedDocuments]);

  // ── Expand / collapse ─────────────────────────────────────────────

  const toggleExpand = useCallback((docId: string) => {
    setExpandedItems((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId],
    );
  }, []);

  return {
    constrainedDocuments,
    checkedDocIds,
    toggleDocument,
    toggleParent,
    selectAll,
    deselectAll,
    isAllSelected,
    expandedItems,
    toggleExpand,
  };
}
