import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, Workflow } from 'lucide-react';
import { Diagram } from '../../_lib/constants';
import { DiagramViewer } from './DiagramViewer';
import ChatBot from '@/components/chat-bot/ChatBot';

interface DiagramDetailProps {
    diagram: Diagram;
    projectId: string;
    onBack: () => void;
}

export function DiagramDetail({ diagram, projectId, onBack }: DiagramDetailProps) {
    return (
        <div className="space-y-6">

            {/* Diagram Tabs */}
            <DiagramViewer diagram={diagram} projectId={projectId} />
            <div className="flex sm:hidden">
                <ChatBot assisstanceName="Diagram AI Assistant" />

            </div>
        </div>
    );
}
