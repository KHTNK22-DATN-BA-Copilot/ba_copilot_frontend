import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";

interface ChatBotProps {
    assisstanceName: string;
    projectId?: string;
    documentId?: string;
    onContentUpdate?: (newContent: string) => void;
}

export default function ChatBot({ assisstanceName, projectId, documentId, onContentUpdate }: ChatBotProps) {
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatMessages, setChatMessages] = useState<
        { id: number; message: string; isUser: boolean }[]
    >([]);
    const [currentPrompt, setCurrentPrompt] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSendPrompt = async () => {
        if (!currentPrompt.trim() || isProcessing) return;

        const userMessage = {
            id: Date.now(),
            message: currentPrompt,
            isUser: true,
        };
        setChatMessages((prev) => [...prev, userMessage]);
        const userPrompt = currentPrompt;
        setCurrentPrompt("");
        setIsProcessing(true);

        try {
            // Prepare FormData with project_id, document_id and description
            const formData = new FormData();
            if (projectId) formData.append("project_id", projectId);
            if (documentId) formData.append("document_id", documentId);
            formData.append("description", userPrompt);

            // Call API to regenerate document
            const res = await fetch(`/api/srs-generate/doc`, {
                method: "PATCH",
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`API error: ${res.status}`);
            }

            const data = await res.json();

            // Show AI response message
            const aiResponseText = "I've updated the document based on your request. The preview should now show the new content.";
            setChatMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    message: aiResponseText,
                    isUser: false,
                },
            ]);

            // Update the document content via callback with the 'document' field from response
            if (onContentUpdate && data.document) {
                onContentUpdate(data.document);
            }

            setIsProcessing(false);
            console.log("Document regenerated:", data);
        } catch (error) {
            console.error("Error regenerating document:", error);

            // Show error message in chat
            setChatMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    message: "Sorry, there was an error processing your request. Please try again.",
                    isUser: false,
                },
            ]);

            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
            {!showChatbot ? (
                <div className="relative group" onClick={() => setShowChatbot(true)}>
                    <Button
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer"
                        size="icon"
                    >
                        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </Button>


                    {/* Tooltip */}
                    <div className="absolute bottom-14 sm:bottom-16 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        AI Assistant
                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            ) : (
                <div className="w-screen h-screen sm:w-80 sm:h-96 bg-white dark:bg-gray-800 sm:rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:fixed sm:bottom-6 sm:right-6 fixed inset-0 sm:inset-auto">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                            {assisstanceName}
                        </h3>
                        <Button
                            onClick={() => setShowChatbot(false)}
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                        {chatMessages.length === 0 ? (
                            <div className="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm px-2">
                                Ask me to edit your document!
                                <br />
                                Example: "Add a new section about security
                                requirements"
                            </div>
                        ) : (
                            chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.isUser
                                            ? "justify-end"
                                            : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[80%] sm:max-w-xs p-2 sm:p-3 rounded-lg text-xs sm:text-sm ${msg.isUser
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                            }`}
                                    >
                                        {msg.message}
                                    </div>
                                </div>
                            ))
                        )}
                        {isProcessing && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-3 rounded-lg text-xs sm:text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-gray-600"></div>
                                        <span>Processing...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex space-x-2">
                            <Textarea
                                value={currentPrompt}
                                onChange={(e) =>
                                    setCurrentPrompt(e.target.value)
                                }
                                placeholder="Describe what you want to change..."
                                className="flex-1 min-h-0 resize-none text-xs sm:text-sm"
                                rows={2}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendPrompt();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleSendPrompt}
                                disabled={!currentPrompt.trim() || isProcessing}
                                size="icon"
                                className="self-end h-8 w-8 sm:h-10 sm:w-10"
                            >
                                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
