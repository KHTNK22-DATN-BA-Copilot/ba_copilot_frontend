'use client';

import { useCallback, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeedbackDialog from "./FeedbackDialog";

interface FloatingFeedbackButtonProps {
    feedbackFormUrl: string;
    storageKey: string;
    title?: string;
    description?: string;
}

export default function FloatingFeedbackButton({
    feedbackFormUrl,
    storageKey,
    title = "Feedback & Suggestions",
    description = "Help us improve by sharing your experience"
}: FloatingFeedbackButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleFeedbackSubmit = useCallback(() => {
        window.open(feedbackFormUrl, "_blank", "noopener,noreferrer");
        localStorage.setItem(storageKey, "true");
        setIsDialogOpen(false);
    }, [feedbackFormUrl, storageKey]);

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all 
bg-black hover:bg-gray-800 
dark:bg-white dark:hover:bg-gray-300"
                    title="Send feedback"
                >
                    <Send className="w-6 h-6" />
                </Button>
            </div>

            {/* Feedback Dialog */}
            <FeedbackDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onFeedbackSubmit={handleFeedbackSubmit}
                title={title}
                description={description}
                buttonText="Share Feedback"
            />
        </>
    );
}
