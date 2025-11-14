'use client';

import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";

interface Conversation {
    id: number;
    title: string;
    timestamp: Date;
}

interface ConversationSidebarProps {
    conversations?: Conversation[];
    onNewConversation: () => void;
    onSelectConversation?: (id: number) => void;
}

export function ConversationSidebar({
    conversations = [],
    onNewConversation,
    onSelectConversation,
}: ConversationSidebarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const sidebarContent = (
        <div className="h-full flex flex-col border-r border-gray-700 dark:border-gray-700">
            <div className="p-4 border-b border-gray-700 dark:border-gray-700">
                <Button
                    onClick={onNewConversation}
                    className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-lg py-2.5"
                >
                    <Plus className="w-4 h-4" />
                    New Conversation
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent scrollbar-thumb-rounded-full">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 px-3 py-2 mb-1">
                    Recent Chats
                </p>
                {conversations.length === 0 ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <button
                            key={i}
                            className="w-full text-left px-3 py-3 rounded-lg text-sm flex items-center gap-3 transition-all duration-200 group"
                            onClick={() => onSelectConversation?.(i + 1)}
                        >
                            <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-500 group-hover:text-blue-400 transition-colors" />
                            <span className="truncate text-gray-300 dark:text-gray-300 group-hover:text-white">
                                Conversation {i + 1}
                            </span>
                        </button>
                    ))
                ) : (
                    conversations.map((conv) => (
                        <button
                            key={conv.id}
                            className="w-full text-left px-3 py-3 rounded-lg text-sm flex items-center gap-3 transition-all duration-200 group"
                            onClick={() => onSelectConversation?.(conv.id)}
                        >
                            <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-500 group-hover:text-blue-400 transition-colors" />
                            <span className="truncate text-gray-300 dark:text-gray-300 group-hover:text-white">
                                {conv.title}
                            </span>
                        </button>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white shadow-lg"
            >
                {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                ) : (
                    <Menu className="w-5 h-5" />
                )}
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar for Mobile */}
            <div
                className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {sidebarContent}
            </div>

            {/* Sidebar for Desktop */}
            <div className="hidden lg:block lg:col-span-3 xl:col-span-2 h-full">
                {sidebarContent}
            </div>
        </>
    );
}
