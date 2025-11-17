'use client';

import { useState } from "react";
import { ConversationSidebar } from "./_components/ConversationSidebar";
import { ChatMessages, Message } from "./_components/ChatMessages";
import { ChatInput } from "./_components/ChatInput";

export default function ProjectAIConversationsPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: "assistant",
            content: "Hello! I'm your BA Copilot assistant. I can help you with creating SRS documents, generating diagrams, designing wireframes, and answering questions about business analysis. How can I assist you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const suggestions = [
        "Generate an SRS document for an e-commerce platform",
        "Create a user flow diagram for login",
        "Design a wireframe for a dashboard",
        "Explain the requirements gathering process",
    ];

    const handleSend = () => {
        if (!input.trim() || isProcessing) return;

        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsProcessing(true);

        // Simulate AI response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: "I understand your request. Let me help you with that. Could you provide more details about what you'd like to accomplish?",
                },
            ]);
            setIsProcessing(false);
        }, 1000);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
    };

    const handleNewConversation = () => {
        setMessages([
            {
                id: 1,
                role: "assistant",
                content: "Hello! I'm your BA Copilot assistant. I can help you with creating SRS documents, generating diagrams, designing wireframes, and answering questions about business analysis. How can I assist you today?",
            },
        ]);
        setInput("");
    };

    return (
        <div className="grid grid-cols-12 h-full w-full overflow-hidden">
            {/* Main Chat Area */}
            <div className="col-span-12 lg:col-span-9 xl:col-span-10 order-2 lg:order-1 flex flex-col h-full min-h-0 relative">
                {/* Chat Messages - scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <ChatMessages
                        messages={messages}
                        suggestions={suggestions}
                        onSuggestionClick={handleSuggestionClick}
                    />
                </div>

                {/* Input Area - fixed at bottom */}
                <ChatInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    disabled={isProcessing}
                />
            </div>

            {/* Sidebar - responsive columns */}
            <div className="hidden lg:flex lg:col-span-3 xl:col-span-2 order-1 lg:order-2 h-full flex-col overflow-hidden border-l">
                <ConversationSidebar
                    onNewConversation={handleNewConversation}
                />
            </div>
        </div>
    );
}
