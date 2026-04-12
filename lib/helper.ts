"use server";

import {
    DocumentListResponse,
    RegenerateDocumentResponse,
    StepName,
} from "@/app/dashboard/project/[id]/workflows/_components/steps/shared/types";
import { getAccessToken } from "./projects";
import { WorkFlowService } from "@/services/WorkflowService";
import { HttpError } from "./auth-session";

const API_CONFIG = {
    headers: {
        "Content-Type": "application/json",
    },
} as const;

/**
 * Get list of documents for a specific step and project
 * @param stepName - The workflow step name (planning, analysis, design)
 * @param projectId - The project ID
 * @returns Promise with list of documents
 */
export async function getDocumentsList(
    stepName: StepName,
    projectId: string,
): Promise<DocumentListResponse> {
    const cookies = await getAccessToken();
    try {
        const endpoint = `${process.env.BACKEND_DOMAIN}/api/v1/${stepName}/list/${projectId}`;

        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                ...API_CONFIG.headers,
                "Authorization": `Bearer ${cookies}`
            },
            credentials: "include", // Include cookies for authentication
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new HttpError(
                response.status,
                errorData.message ||
                    `Failed to fetch ${stepName} documents: ${response.status}`,
            );
        }

        const data = await response.json();
        return {
            status: "success",
            documents: data.documents || [],
        }
    } catch (error) {
        console.error(`getDocumentsList error (${stepName}):`, error);
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

/**
 * Get list of planning documents for a project
 * @param projectId - The project ID
 * @returns Promise with list of planning documents
 */
export async function getPlanningDocuments(
    projectId: string,
): Promise<DocumentListResponse> {
    return getDocumentsList("planning", projectId);
}

/**
 * Get list of analysis documents for a project
 * @param projectId - The project ID
 * @returns Promise with list of analysis documents
 */
export async function getAnalysisDocuments(
    projectId: string,
): Promise<DocumentListResponse> {
    return getDocumentsList("analysis", projectId);
}

/**
 * Get list of design documents for a project
 * @param projectId - The project ID
 * @returns Promise with list of design documents
 */
export async function getDesignDocuments(
    projectId: string,
): Promise<DocumentListResponse> {
    return getDocumentsList("design", projectId);
}

export const fetchAllDocument = async (
    projectId: string,
): Promise<string[]> => {
    const [planningDocuments, analysisDocuments, designDocuments] =
        await Promise.all([
            getPlanningDocuments(projectId),
            getAnalysisDocuments(projectId),
            getDesignDocuments(projectId),
        ]);

    let result: string[] = [];
    if (
        planningDocuments.documents &&
        analysisDocuments.documents &&
        designDocuments.documents
    ) {
        result = [
            ...planningDocuments.documents.map((doc) =>
                doc.doc_type ? doc.doc_type : doc.design_type,
            ),
            ...analysisDocuments.documents.map((doc) =>
                doc.doc_type ? doc.doc_type : doc.design_type,
            ),
            ...designDocuments.documents.map((doc) =>
                doc.doc_type ? doc.doc_type : doc.design_type,
            ),
        ];
        return result;
    } else {
        return [];
    }
};
