import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ChatMessage {
    id: number;
    message: string;
    isUser: boolean;
}

export interface ChatAPIConfig {
    endpoint: string;
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    buildPayload: (userPrompt: string, additionalData?: Record<string, any>) => FormData | Record<string, any>;
    extractResponseContent?: (data: any) => string | null;
    extractResponseMessage?: (data: any) => string;
}

export interface ChatWithAIProps {
    // API configuration
    apiConfig: ChatAPIConfig;

    // Additional data to pass to API (e.g., projectId, documentId, diagramId, etc.)
    additionalData?: Record<string, any>;

    // Callback when content is updated
    onContentUpdate?: (newContent: string, fullResponse?: any) => void;

    // Optional callback for custom success handling
    onSuccess?: (data: any) => void;

    // Optional callback for custom error handling
    onError?: (error: any) => void;

    // UI customization
    placeholder?: string;
    emptyStateMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    height?: string;

    // Feature-specific settings
    showProcessingIndicator?: boolean;
    enableMarkdown?: boolean;
}

export function ChatWithAI({
    apiConfig,
    additionalData,
    onContentUpdate,
    onSuccess,
    onError,
    placeholder = "Enter your prompt here...",
    emptyStateMessage = "Ask me anything about your project!",
    successMessage,
    errorMessage = "Sorry, there was an error processing your request. Please try again.",
    height = "calc(100vh-250px)",
    showProcessingIndicator = true,
    enableMarkdown = false,
}: ChatWithAIProps) {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [content, setContent] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSend = async () => {
        if (!content.trim() || isProcessing) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            message: content,
            isUser: true,
        };
        setChatMessages((prev) => [...prev, userMessage]);
        const userPrompt = content;
        setContent("");
        setIsProcessing(true);

        try {
            // Build payload using the provided configuration
            const payload = apiConfig.buildPayload(userPrompt, additionalData);
            const isFormData = payload instanceof FormData;

            // Call API with configuration
            const res = await fetch(apiConfig.endpoint, {
                method: apiConfig.method || "POST",
                body: isFormData ? payload : JSON.stringify(payload),
                ...(!isFormData && { headers: { "Content-Type": "application/json" } }),
            });

            const data = await res.json();
            //console.log("API response:", data, "Status:", res.status);

            if (!res.ok) {
                throw new Error(data.message || data.error || `API error: ${res.status}`);
            }

            // Extract AI response message
            const aiResponseText = successMessage ||
                (apiConfig.extractResponseMessage
                    ? apiConfig.extractResponseMessage(data)
                    : "I've processed your request successfully.");

            setChatMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    message: aiResponseText,
                    isUser: false,
                },
            ]);

            // Extract and update content if applicable
            const extractedContent = apiConfig.extractResponseContent?.(data);
            if (onContentUpdate && extractedContent) {
                onContentUpdate(extractedContent, data);
            }

            // Call custom success handler if provided
            if (onSuccess) {
                onSuccess(data);
            }

            setIsProcessing(false);
        } catch (error) {
            console.error("Error processing request:", error);

            // Show error message in chat
            setChatMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    message: errorMessage,
                    isUser: false,
                },
            ]);

            // Call custom error handler if provided
            if (onError) {
                onError(error);
            }

            setIsProcessing(false);
        }
    };

    return (
        <div className={`h-[${height}] flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900`}>
            {/* Chat messages area */}
            <div className="flex-1 overflow-y-auto p-1 space-y-3 scrollbar-thin 
                                scrollbar-thumb-blue-500 
                                scrollbar-track-transparent 
                                scrollbar-thumb-rounded-full ">
                {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-xs px-2">
                        {emptyStateMessage}
                    </div>
                ) : (
                    chatMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] p-2 rounded-lg text-xs break-words ${enableMarkdown ? "whitespace-pre-wrap" : "whitespace-pre-line"
                                    } ${msg.isUser
                                        ? "bg-blue-600 text-white rounded-lg rounded-br-none"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg rounded-bl-none"
                                    }`}
                            >
                                {msg.message}
                            </div>
                        </div>
                    ))
                )}
                {isProcessing && showProcessingIndicator && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-xs">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                                <span>Processing...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input + Send button */}
            <div className="mt-4 flex items-end gap-2">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 w-full text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] max-h-[120px]"
                    placeholder={placeholder}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />

                <Button
                    onClick={handleSend}
                    className="p-3 rounded-full shadow-md flex items-center justify-center h-10"
                    disabled={!content.trim() || isProcessing}
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}