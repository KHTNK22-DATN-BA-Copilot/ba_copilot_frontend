import {
    StepName,
    DocumentListResponse,
} from "@/app/dashboard/project/[id]/workflows/_components/steps/shared";

export class WorkFlowService {
    private static async getDocumentsList(
        stepName: StepName,
        projectId: string,
        token: string,
    ): Promise<DocumentListResponse> {
        try {
            const endpoint = `${process.env.BACKEND_DOMAIN}/api/v1/${stepName}/list/${projectId}`;

            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include", // Include cookies for authentication
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `Failed to fetch ${stepName} documents: ${response.status}`,
                );
            }

            const data = await response.json();
            return {
                status: "success",
                documents: data.documents || [],
            };
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

    public static async getPlanningDocuments(projectId: string, token: string) {
        return this.getDocumentsList('planning', projectId, token);
    }

    public static async getAnalysisDocuments(projectId: string, token: string) {
        return this.getDocumentsList('analysis', projectId, token);
    }

    public static async getDesignDocuments(projectId: string, token: string) {
        return this.getDocumentsList('design', projectId, token);
    }
}
