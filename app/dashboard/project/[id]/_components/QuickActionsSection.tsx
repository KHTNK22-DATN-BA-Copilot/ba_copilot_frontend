import { MessageSquare, FileText, Layout, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickActionsSectionProps {
    projectId: string | string[];
}

export default function QuickActionsSection({ projectId }: QuickActionsSectionProps) {
    const quickActions = [
        {
            icon: MessageSquare,
            label: 'Start AI Conversation',
            description: 'Get AI assistance for your project',
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
            onClick: () => console.log('Start AI Conversation'),
        },
        {
            icon: FileText,
            label: 'Generate SRS',
            description: 'Create a Software Requirements Specification',
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
            onClick: () => console.log('Generate SRS'),
        },
        {
            icon: Layout,
            label: 'Create Wireframe',
            description: 'Design a new wireframe',
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
            onClick: () => console.log('Create Wireframe'),
        },
        {
            icon: BarChart3,
            label: 'Design Diagram',
            description: 'Create a new diagram',
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-100 dark:bg-orange-900/20',
            onClick: () => console.log('Design Diagram'),
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Button
                                key={index}
                                variant="outline"
                                className="h-auto p-3 justify-start hover:shadow-md transition-all"
                                onClick={action.onClick}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <div className={`p-2 rounded-lg ${action.bgColor} flex-shrink-0`}>
                                        <Icon className={`w-4 h-4 ${action.color}`} />
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                                            {action.label}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                            {action.description}
                                        </p>
                                    </div>
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
