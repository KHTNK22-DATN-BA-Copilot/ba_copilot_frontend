import { ServiceResponse } from "@/type/types";
import "server-only";

export class WorkflowService {
    /**
     * Generate workflow documents (planning/analysis/design)
     */
    public static async generateDocument(
        token: string,
        prompt: string,
        selectedFiles: string[],
        selectedDocIds: string[],
        projectId: string,
    ): Promise<ServiceResponse<{ jobId: string }>> {
        try {
            const response = await fetch(
                `${process.env.BACKEND_DOMAIN}/api/v1/workflow/generate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: new URLSearchParams({
                        prompt: String(prompt),
                        selectedFiles: JSON.stringify(selectedFiles),
                        selectedDocIds: JSON.stringify(selectedDocIds),
                        projectId: String(projectId),
                    }).toString(),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    statusCode: response.status,
                    message: errorData.message || "Failed to generate document",
                };
            }

            const data = await response.json();
            return {
                success: true,
                statusCode: response.status,
                data: {
                    jobId: data.jobId,
                },
            };
        } catch (error) {
            console.error("Error generating document:", error);
            return {
                success: false,
                statusCode: 500,
                message: "An unexpected error occurred while generating document",
            };
        }
    }

    /**
     * Get the status of a workflow generation job
     */
    public static async getJobStatus(
        token: string,
        jobId: string,
    ): Promise<ServiceResponse<any>> {
        try {
            if (!jobId) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Job ID is required",
                };
            }

            const response = await fetch(
                `${process.env.BACKEND_DOMAIN}/api/v1/workflow/status/${jobId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    statusCode: response.status,
                    message: errorData.message || "Failed to get job status",
                };
            }

            const data = await response.json();
            return {
                success: true,
                statusCode: response.status,
                data,
            };
        } catch (error) {
            console.error("Error getting job status:", error);
            return {
                success: false,
                statusCode: 500,
                message: "An unexpected error occurred while checking job status",
            };
        }
    }

    /**
     * Get list of documents for a specific workflow step
     */
    public static async getDocumentsByStep(
        token: string,
        stepName: string,
        projectId: string,
    ): Promise<ServiceResponse<{ documents: any[] }>> {
        try {
            if (!stepName || !projectId) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Step name and project ID are required",
                };
            }

            const validSteps = ["planning", "analysis", "design"];
            if (!validSteps.includes(stepName)) {
                return {
                    success: false,
                    statusCode: 400,
                    message: `Invalid step name. Must be one of: ${validSteps.join(", ")}`,
                };
            }

            const response = await fetch(
                `${process.env.BACKEND_DOMAIN}/api/v1/${stepName}/list/${projectId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    statusCode: response.status,
                    message: errorData.message || `Failed to fetch ${stepName} documents`,
                };
            }

            const data = await response.json();
            return {
                success: true,
                statusCode: response.status,
                data: {
                    documents: data.documents || [],
                },
            };
        } catch (error) {
            console.error("Error fetching documents:", error);
            return {
                success: false,
                statusCode: 500,
                message: "An unexpected error occurred while fetching documents",
            };
        }
    }

    /**
     * Regenerate a specific document for a workflow step
     */
    public static async regenerateDocument(
        token: string,
        stepName: string,
        projectId: string,
        documentId: string,
        description?: string,
    ): Promise<ServiceResponse<any>> {
        try {
            console.log("WorkflowService.regenerateDocument called with description:", description);
            if (!stepName || !projectId || !documentId) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Step name, project ID, and document ID are required",
                };
            }

            const validSteps = ["planning", "analysis", "design"];
            if (!validSteps.includes(stepName)) {
                return {
                    success: false,
                    statusCode: 400,
                    message: `Invalid step name. Must be one of: ${validSteps.join(", ")}`,
                };
            }

            const response = await fetch(
                `${process.env.BACKEND_DOMAIN}/api/v1/${stepName}/regenerate/${projectId}/${documentId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: new URLSearchParams({ ...(description ? { description } : {}) }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    statusCode: response.status,
                    message: errorData.message || "Failed to regenerate document",
                };
            }

            const data = await response.json();
            return {
                success: true,
                statusCode: response.status,
                data,
            };
        } catch (error) {
            console.error("Error regenerating document:", error);
            return {
                success: false,
                statusCode: 500,
                message: "An unexpected error occurred while regenerating document",
            };
        }
    }

    /**
     * Update document content for a workflow step
     */
    public static async updateDocument(
        token: string,
        stepName: string,
        projectId: string,
        documentId: string,
        content: string,
    ): Promise<ServiceResponse<any>> {
        try {
            if (!stepName || !projectId || !documentId) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Step name, project ID, and document ID are required",
                };
            }

            if (!content?.trim()) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Document content is required",
                };
            }

            const validSteps = ["planning", "analysis", "design"];
            if (!validSteps.includes(stepName)) {
                return {
                    success: false,
                    statusCode: 400,
                    message: `Invalid step name. Must be one of: ${validSteps.join(", ")}`,
                };
            }

            const response = await fetch(
                `${process.env.BACKEND_DOMAIN}/api/v1/${stepName}/update/${projectId}/${documentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: new URLSearchParams({ content }).toString(),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    statusCode: response.status,
                    message: errorData.message || "Failed to update document",
                };
            }

            const data = await response.json();
            return {
                success: true,
                statusCode: response.status,
                data,
            };
        } catch (error) {
            console.error("Error updating document:", error);
            return {
                success: false,
                statusCode: 500,
                message: "An unexpected error occurred while updating document",
            };
        }
    }

    /**
     * Export a workflow document and return file metadata with base64 content
     */
    public static async exportDocument(
        token: string,
        documentId: string,
    ): Promise<ServiceResponse<{ filename: string; contentType: string; base64: string }>> {
        try {
            if (!documentId) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Document ID is required",
                };
            }

            const response = await fetch(
                `${process.env.BACKEND_DOMAIN}/api/v1/files/export/${documentId}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    statusCode: response.status,
                    message: errorData.message || "Failed to export document",
                };
            }

            const contentDisposition = response.headers.get("Content-Disposition") || "";
            const filenameMatch = contentDisposition.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
            const filename = filenameMatch?.[1]
                ? decodeURIComponent(filenameMatch[1].replace(/"/g, "").trim())
                : `${documentId}.md`;

            const contentType = response.headers.get("Content-Type") || "text/markdown";
            const arrayBuffer = await response.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString("base64");

            return {
                success: true,
                statusCode: response.status,
                data: {
                    filename,
                    contentType,
                    base64,
                },
            };
        } catch (error) {
            console.error("Error exporting document:", error);
            return {
                success: false,
                statusCode: 500,
                message: "An unexpected error occurred while exporting document",
            };
        }
    }

    /**
     * Get session chat history by content ID
     */
    public static async getSessionHistory(
        token: string,
        contentId: string,
    ): Promise<ServiceResponse<{ Sessions: Array<{ role: string; message: string; summary: string; create_at: string }> }>> {
        try {
            if (!contentId) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Content ID is required",
                };
            }

            const response = await fetch(
                `${process.env.BACKEND_DOMAIN}/api/v1/sessions/list/${contentId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    statusCode: response.status,
                    message: errorData.message || "Failed to fetch session history",
                };
            }

            const data = await response.json();
            const rawSessions = Array.isArray(data?.Sessions) ? data.Sessions : [];

            const Sessions = rawSessions.map((item: any) => ({
                role: String(item?.role || ""),
                message: String(item?.message || ""),
                summary: String(item?.summary || ""),
                create_at: String(item?.create_at || ""),
            }));

            return {
                success: true,
                statusCode: response.status,
                data: { Sessions },
            };
        } catch (error) {
            console.error("Error fetching session history:", error);
            return {
                success: false,
                statusCode: 500,
                message: "An unexpected error occurred while fetching session history",
            };
        }
    }
}
