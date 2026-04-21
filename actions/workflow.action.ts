"use server";

import { WorkflowService } from "@/services/WorkflowService";
import { ActionResponse } from "@/type/types";
import { withAccessToken } from "@/lib/auth-action";

/**
 * Generate workflow documents (planning/analysis/design)
 */
export async function generateWorkflowDocument(
    prompt: string,
    selectedFiles: string[],
    selectedDocIds: string[],
    projectId: string,
): Promise<ActionResponse<{ jobId: string }>> {
    try {
        if (!selectedDocIds || selectedDocIds.length === 0) {
            return {
                success: false,
                message: "No documents selected for generation",
                statusCode: 400,
            };
        }

        return withAccessToken(async (accessToken) => {
            const response = await WorkflowService.generateDocument(
                accessToken,
                prompt,
                selectedFiles,
                selectedDocIds,
                projectId,
            );

            if (response.success) {
                return {
                    success: true,
                    message: "Document generation started successfully",
                    data: response.data,
                    statusCode: response.statusCode,
                };
            }

            return {
                success: false,
                message: response.message || "Failed to generate document",
                statusCode: response.statusCode,
            };
        });
    } catch (error) {
        console.error("Error generating document:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            statusCode: 500,
        };
    }
}

/**
 * Get the status of a workflow generation job
 */
export async function getWorkflowJobStatus(jobId: string): Promise<ActionResponse> {
    try {
        return withAccessToken(async (accessToken) => {
            const response = await WorkflowService.getJobStatus(accessToken, jobId);

            if (response.success) {
                return {
                    success: true,
                    message: "Job status retrieved successfully",
                    data: response.data,
                    statusCode: response.statusCode,
                };
            }

            return {
                success: false,
                message: response.message || "Failed to get job status",
                statusCode: response.statusCode,
            };
        });
    } catch (error) {
        console.error("Error getting job status:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            statusCode: 500,
        };
    }
}

/**
 * Get list of documents for a specific workflow step
 */
export async function getWorkflowDocumentsByStep(
    stepName: string,
    projectId: string,
): Promise<ActionResponse> {
    try {
        return withAccessToken(async (accessToken) => {
            const response = await WorkflowService.getDocumentsByStep(
                accessToken,
                stepName,
                projectId,
            );

            if (response.success) {
                return {
                    success: true,
                    message: "Documents retrieved successfully",
                    data: response.data,
                    statusCode: response.statusCode,
                };
            }

            return {
                success: false,
                message: response.message || "Failed to get documents",
                statusCode: response.statusCode,
            };
        });
    } catch (error) {
        console.error("Error getting workflow documents:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            statusCode: 500,
        };
    }
}

/**
 * Regenerate a specific document for a workflow step
 */
export async function regenerateWorkflowDocument(
    stepName: string,
    projectId: string,
    documentId: string,
    description?: string,
): Promise<ActionResponse> {
    try {
        return withAccessToken(async (accessToken) => {
            const response = await WorkflowService.regenerateDocument(
                accessToken,
                stepName,
                projectId,
                documentId,
                description,
            );

            if (response.success) {
                return {
                    success: true,
                    message: "Document regeneration started successfully",
                    data: response.data,
                    statusCode: response.statusCode,
                };
            }

            return {
                success: false,
                message: response.message || "Failed to regenerate document",
                statusCode: response.statusCode,
            };
        });
    } catch (error) {
        console.error("Error regenerating document:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            statusCode: 500,
        };
    }
}

/**
 * Update a specific document for a workflow step
 */
export async function updateWorkflowDocument(
    stepName: string,
    projectId: string,
    documentId: string,
    content: string,
): Promise<ActionResponse> {
    try {
        return withAccessToken(async (accessToken) => {
            const response = await WorkflowService.updateDocument(
                accessToken,
                stepName,
                projectId,
                documentId,
                content,
            );

            if (response.success) {
                return {
                    success: true,
                    message: "Document updated successfully",
                    data: response.data,
                    statusCode: response.statusCode,
                };
            }

            return {
                success: false,
                message: response.message || "Failed to update document",
                statusCode: response.statusCode,
            };
        });
    } catch (error) {
        console.error("Error updating document:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            statusCode: 500,
        };
    }
}

/**
 * Export a workflow document and return downloadable data
 */
export async function exportWorkflowDocument(
    documentId: string,
): Promise<ActionResponse<{ filename: string; contentType: string; base64: string }>> {
    try {
        return withAccessToken(async (accessToken) => {
            const response = await WorkflowService.exportDocument(accessToken, documentId);

            if (response.success) {
                return {
                    success: true,
                    message: "Document exported successfully",
                    data: response.data,
                    statusCode: response.statusCode,
                };
            }

            return {
                success: false,
                message: response.message || "Failed to export document",
                statusCode: response.statusCode,
            };
        });
    } catch (error) {
        console.error("Error exporting workflow document:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            statusCode: 500,
        };
    }
}

/**
 * Get session chat history by content ID
 */
export async function getWorkflowSessionHistory(
    contentId: string,
): Promise<ActionResponse<{ Sessions: Array<{ role: string; message: string; summary: string; create_at: string }> }>> {
    try {
        return withAccessToken(async (accessToken) => {
            const response = await WorkflowService.getSessionHistory(accessToken, contentId);

            if (response.success) {
                return {
                    success: true,
                    message: "Session history retrieved successfully",
                    data: response.data,
                    statusCode: response.statusCode,
                };
            }

            return {
                success: false,
                message: response.message || "Failed to fetch session history",
                statusCode: response.statusCode,
            };
        });
    } catch (error) {
        console.error("Error fetching workflow session history:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            statusCode: 500,
        };
    }
}
