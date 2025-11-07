import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, Workflow } from 'lucide-react';
import { Diagram } from '../_lib/constants';
import { DiagramTabs } from './DiagramTabs';
import ChatBot from '@/components/chat-bot/ChatBot';

interface DiagramDetailProps {
    diagram: Diagram;
    onBack: () => void;
}

export function DiagramDetail({ diagram, onBack }: DiagramDetailProps) {
    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button
                variant="ghost"
                className="gap-2"
                onClick={onBack}
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Recent Diagrams
            </Button>

            {/* Diagram Header */}
            <div className="col-span-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                    <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Workflow className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{diagram.name}</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {diagram.type} • Created {diagram.date}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Share2 className="w-4 h-4" />
                                Share
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="w-4 h-4" />
                                Download
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Diagram Tabs */}
            <DiagramTabs diagram={diagram} />
            <ChatBot assisstanceName="Diagram AI Assistant"/>
        </div>
    );
}
