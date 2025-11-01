import { Button } from '@/components/ui/button';
import { Download, Share2, Workflow } from 'lucide-react';
import { Diagram } from '../_lib/constants';

interface RecentDiagramsListProps {
    diagrams: Diagram[];
    onSelectDiagram: (id: number) => void;
}

export function RecentDiagramsList({ diagrams, onSelectDiagram }: RecentDiagramsListProps) {
    return (
        <div className="col-span-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                <div className="space-y-4">
                    {diagrams.map((diagram) => (
                        <div
                            key={diagram.id}
                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-blue-600"
                            onClick={() => onSelectDiagram(diagram.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                    <Workflow className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{diagram.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{diagram.type} • {diagram.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <Share2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
