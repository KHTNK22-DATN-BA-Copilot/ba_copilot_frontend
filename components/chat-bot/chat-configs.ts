import { ChatAPIConfig } from "./ChatWithAI";

/**
 * Pre-configured API configurations for different features
 * Use these to quickly integrate ChatWithAI into your pages
 */

// SRS Document Generator Configuration
export const srsDocumentChatConfig: ChatAPIConfig = {
    endpoint: "/api/srs-generate/doc",
    method: "PATCH",
    buildPayload: (userPrompt: string, additionalData?: Record<string, any>) => {
        const formData = new FormData();
        if (additionalData?.projectId) formData.append("project_id", additionalData.projectId);
        if (additionalData?.documentId) formData.append("document_id", additionalData.documentId);
        formData.append("description", userPrompt);
        return formData;
    },
    extractResponseContent: (data: any) => data.document || null,
    extractResponseMessage: () => "I've updated the document based on your request. The preview should now show the new content.",
};

// Diagram Generator Configuration
export const diagramChatConfig: ChatAPIConfig = {
    endpoint: "/api/diagram",
    method: "PATCH",
    buildPayload: (userPrompt: string, additionalData?: Record<string, any>) => {
        const formData = new FormData();
        if (additionalData?.projectId) formData.append("project_id", additionalData.projectId);
        if (additionalData?.diagramId) formData.append("diagram_id", additionalData.diagramId);
        formData.append("description", userPrompt);
        return formData;
    },
    extractResponseContent: (data: any) => data.diagram_code || data.content || null,
    extractResponseMessage: () => "I've updated the diagram based on your request.",
};

// Wireframe Generator Configuration
export const wireframeChatConfig: ChatAPIConfig = {
    endpoint: "/api/wireframe-generate",
    method: "PATCH",
    buildPayload: (userPrompt: string, additionalData?: Record<string, any>) => {
        const formData = new FormData();
        if (additionalData?.projectId) formData.append("project_id", additionalData.projectId);
        if (additionalData?.wireframeId) formData.append("wireframe_id", additionalData.wireframeId);
        formData.append("description", userPrompt);
        return formData;
    },
    extractResponseContent: (data: any) => data.wireframe_code || data.html || null,
    extractResponseMessage: () => "I've updated the wireframe based on your request.",
};

// Generic JSON API Configuration (for custom implementations)
export const createGenericChatConfig = (
    endpoint: string,
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "POST",
    contentKey?: string,
    messageKey?: string
): ChatAPIConfig => ({
    endpoint,
    method,
    buildPayload: (userPrompt: string, additionalData?: Record<string, any>) => ({
        prompt: userPrompt,
        ...additionalData,
    }),
    extractResponseContent: contentKey ? (data: any) => data[contentKey] || null : undefined,
    extractResponseMessage: messageKey
        ? (data: any) => data[messageKey] || "Request processed successfully."
        : () => "Request processed successfully.",
});

// Example: Custom FormData Configuration
export const createFormDataChatConfig = (
    endpoint: string,
    method: "POST" | "PATCH" | "PUT" = "POST",
    promptFieldName: string = "description",
    contentExtractor?: (data: any) => string | null
): ChatAPIConfig => ({
    endpoint,
    method,
    buildPayload: (userPrompt: string, additionalData?: Record<string, any>) => {
        const formData = new FormData();
        formData.append(promptFieldName, userPrompt);
        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, String(value));
            });
        }
        return formData;
    },
    extractResponseContent: contentExtractor,
    extractResponseMessage: () => "Request processed successfully.",
});
