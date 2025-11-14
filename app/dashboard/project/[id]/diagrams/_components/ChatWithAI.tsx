import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatWithAI() {
    const [chatMessages, setChatMessages] = useState<
        { id: number; message: string; isUser: boolean }[]
    >([]);
    const [content, setContent] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSend = async () => {
        if (!content.trim() || isProcessing) return;
        const userMessage = {
            id: Date.now(),
            message: content,
            isUser: true,
        };
        setChatMessages((prev) => [...prev, userMessage]);
        setContent("");
        setIsProcessing(true);
        // Placeholder: simulate AI response (replace with real API call)
        setTimeout(() => {
            setChatMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    message: "AI response to: " + userMessage.message,
                    isUser: false,
                },
            ]);
            setIsProcessing(false);
        }, 1200);
    };

    return (
        <div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 h-[750px]">
            {/* Chat messages area */}
            <div className="flex-1 overflow-y-auto p-1 space-y-3 scrollbar-thin 
                                scrollbar-thumb-blue-500 
                                scrollbar-track-transparent 
                                scrollbar-thumb-rounded-full ">
                {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-xs px-2">
                        Ask me anything about your diagram!
                        <br />
                        Example: "Add a new section about security requirements"
                    </div>
                ) : (
                    chatMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] p-2 rounded-lg text-xs break-words whitespace-pre-line ${msg.isUser
                                    ? "bg-blue-600 text-white rounded-lg rounded-br-none"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg rounded-bl-none"
                                    }`}
                            >
                                {msg.message}
                            </div>
                        </div>
                    ))
                )}
                {isProcessing && (
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
                    placeholder="Enter your prompt here..."
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