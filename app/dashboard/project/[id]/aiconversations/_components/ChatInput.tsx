'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
    return (
        <div className="flex-shrink-0 border-t border-gray-700 dark:border-gray-700 p-4 sticky bottom-0 left-0 w-full z-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-3">
                    <div className="flex-1">
                        <Textarea
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    onSend();
                                }
                            }}
                            placeholder="Ask me anything about business analysis..."
                            className="w-full min-h-[56px] max-h-[120px] resize-none text-sm border-gray-600 dark:border-gray-600 rounded-xl bg-gray-700 dark:bg-gray-700 text-gray-100 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 px-4 py-3"
                            disabled={disabled}
                        />
                    </div>
                    <Button
                        onClick={onSend}
                        disabled={!value.trim() || disabled}
                        className="h-12 w-12 flex-shrink-0 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center p-0"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-400 mt-2 text-center">
                    Press Enter to send, Shift + Enter for new line
                </p>
            </div>
        </div>
    );
}
