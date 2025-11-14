'use client';

import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
}

interface ChatMessagesProps {
    messages: Message[];
    suggestions: string[];
    onSuggestionClick: (suggestion: string) => void;
}

export function ChatMessages({
    messages,
    suggestions,
    onSuggestionClick,
}: ChatMessagesProps) {
    return (
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent scrollbar-thumb-rounded-full">
            {messages.length === 1 && (
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-12 gap-4 sm:gap-6">

                        {/* Welcome Header */}
                        <div className="col-span-12 text-center space-y-3 mb-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-4 shadow-lg">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 dark:text-gray-100">
                                AI Business Analyst Assistant
                            </h2>
                            <p className="text-sm sm:text-base text-gray-400 dark:text-gray-400">
                                Get help with requirements, diagrams, wireframes, and more
                            </p>
                        </div>

                        {/* Suggestion Cards */}
                        <div className="col-span-12 max-w-11/12 mx-auto">
                            <div className="grid grid-cols-2 gap-3">
                                {suggestions.map((suggestion, i) => (
                                    <Card
                                        key={i}
                                        className="h-full p-4 cursor-pointer max-w-80 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 border border-gray-600 dark:border-gray-600"
                                        onClick={() => onSuggestionClick(suggestion)}
                                    >
                                        <p className="text-sm text-gray-200 dark:text-gray-200">
                                            {suggestion}
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}


            {/* Chat Messages */}
            <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${message.role === "user"
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "text-gray-100 dark:text-gray-100 rounded-bl-none"
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
