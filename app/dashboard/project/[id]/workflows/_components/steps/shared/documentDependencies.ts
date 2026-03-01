/**
 * Centralized document dependency map — mirrors DOCUMENT_DEPENDENCIES
 * from ba_copilot_backend/app/services/docs_constraint.py
 *
 * `required`    – documents that MUST exist (generated or checked) before
 *                 the current document can be selected / generated.
 * `recommended` – nice-to-have predecessors (informational only, no hard
 *                 constraint in the UI).
 */

import { getPlanningDocuments, getDesignDocuments, getAnalysisDocuments } from "./api";
import { DocumentListResponse } from "./types";

export interface DocumentDependency {
  required: string[];
  recommended: string[];
}

export const DOCUMENT_DEPENDENCIES: Record<string, DocumentDependency> = {
  // ────────── Planning ──────────
  "stakeholder-register": {
    required: [],
    recommended: [],
  },
  "high-level-requirements": {
    required: [],
    recommended: ["stakeholder-register"],
  },
  "requirements-management-plan": {
    required: [],
    recommended: ["stakeholder-register", "high-level-requirements"],
  },
  "business-case": {
    required: [],
    recommended: ["stakeholder-register", "high-level-requirements"],
  },
  "scope-statement": {
    required: ["business-case", "high-level-requirements"],
    recommended: ["stakeholder-register"],
  },
  "product-roadmap": {
    required: ["scope-statement", "high-level-requirements"],
    recommended: ["business-case"],
  },

  // ────────── Analysis ──────────
  "feasibility-study": {
    required: ["business-case", "scope-statement", "high-level-requirements"],
    recommended: ["product-roadmap"],
  },
  "cost-benefit-analysis": {
    required: ["business-case", "feasibility-study", "scope-statement"],
    recommended: ["product-roadmap"],
  },
  "risk-register": {
    required: ["feasibility-study", "scope-statement"],
    recommended: ["cost-benefit-analysis", "stakeholder-register"],
  },
  "compliance": {
    required: ["scope-statement", "high-level-requirements"],
    recommended: ["risk-register"],
  },

  // ────────── Design ──────────
  "srs": {
    required: ["high-level-requirements", "scope-statement", "feasibility-study"],
    recommended: ["compliance", "stakeholder-register"],
  },
  "hld-arch": {
    required: ["srs", "feasibility-study", "high-level-requirements"],
    recommended: [],
  },
  "hld-cloud": {
    required: ["hld-arch", "srs"],
    recommended: ["cost-benefit-analysis"],
  },
  "hld-tech": {
    required: ["hld-arch", "srs"],
    recommended: ["feasibility-study"],
  },
  "lld-arch": {
    required: ["hld-arch", "srs", "hld-tech"],
    recommended: [],
  },
  "lld-db": {
    required: ["srs", "lld-arch"],
    recommended: ["hld-tech"],
  },
  "lld-api": {
    required: ["srs", "lld-arch", "lld-db"],
    recommended: ["hld-tech"],
  },
  "lld-pseudo": {
    required: ["srs"],
    recommended: ["lld-api", "lld-db"],
  },
  "uiux-wireframe": {
    required: ["srs", "high-level-requirements"],
    recommended: ["stakeholder-register"],
  },
  "uiux-mockup": {
    required: ["uiux-wireframe", "srs"],
    recommended: [],
  },
  "uiux-prototype": {
    required: ["uiux-mockup", "uiux-wireframe"],
    recommended: ["lld-api"],
  },
  "rtm": {
    required: ["srs", "high-level-requirements"],
    recommended: ["lld-arch", "lld-db", "lld-api", "uiux-wireframe"],
  },
};

// ─── Helper utilities ────────────────────────────────────────────────

/**
 * Get the list of required prerequisite doc IDs for a given document.
 */
export function getRequiredDocs(docId: string): string[] {
  return DOCUMENT_DEPENDENCIES[docId]?.required ?? [];
}

/**
 * Get the list of recommended (soft-dependency) doc IDs for a given document.
 */
export function getRecommendedDocs(docId: string): string[] {
  return DOCUMENT_DEPENDENCIES[docId]?.recommended ?? [];
}

/**
 * Reverse lookup — return all doc IDs that **directly** depend on `docId`
 * (i.e. have `docId` in their `required` list).
 */
export function getDirectDependents(docId: string, existingDocIds: string[]): string[] {
  const dependents: string[] = [];
  for (const [id, dep] of Object.entries(DOCUMENT_DEPENDENCIES)) {
    if (dep.required.includes(docId)) {
      dependents.push(id);
    }
  }
  
  const missingDependents = dependents.filter(d => !existingDocIds.includes(d));
  return missingDependents;
}

/**
 * Return all doc IDs that **transitively** depend on `docId` (BFS).
 * Includes direct and indirect dependents.
 */
export function getTransitiveDependents(docId: string, existingDocIds: string[]): string[] {
  const visited = new Set<string>();
  const queue = [docId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const directDeps = getDirectDependents(current, existingDocIds);
    console.log("Direct dependents of", current, ":", directDeps);

    if (directDeps.length === 0) break; // BFS: skip node, don't abort

    for (const dep of directDeps) {
      if (!visited.has(dep)) {
        visited.add(dep);
        queue.push(dep);
      }
    }
  }

  return Array.from(visited);
}

/**
 * Given a set of available/checked doc IDs, return the list of
 * **missing required** doc IDs for a given document.
 */
export function getMissingRequired(
  docId: string,
  availableIds: Set<string>,
): string[] {
  return getRequiredDocs(docId).filter((req) => !availableIds.has(req));
}

export async function isDocumentExistsInDatabase(
  docId: string,
  projectId: string
): Promise<boolean> {

  const [planningDocs, designDocs, analysisDocs] = await Promise.all([
    getPlanningDocuments(projectId),
    getDesignDocuments(projectId),
    getAnalysisDocuments(projectId),
  ]);

  const allDocs = [planningDocs, designDocs, analysisDocs];

  for (const doc of allDocs) {
    for (const d of doc.documents ?? []) {
      if(d.doc_type) {
        return d.doc_type === docId;
      }
      else {
        return d.design_type === docId
      }
    }
  }

  return false;
}
