import { FileText, Layout, BarChart3, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity } from './types';

interface RecentActivitySectionProps {
    activities: Activity[];
}

export default function RecentActivitySection({ activities }: RecentActivitySectionProps) {
    const getIcon = (type: Activity['type']) => {
        const icons = {
            srs: FileText,
            wireframe: Layout,
            diagram: BarChart3,
            conversation: MessageSquare,
        };
        return icons[type] || FileText;
    };

    const getIconStyles = (type: Activity['type']) => {
        const styles = {
            srs: {
                bgColor: 'bg-blue-100 dark:bg-blue-900/20',
                iconColor: 'text-blue-600 dark:text-blue-400',
            },
            wireframe: {
                bgColor: 'bg-purple-100 dark:bg-purple-900/20',
                iconColor: 'text-purple-600 dark:text-purple-400',
            },
            diagram: {
                bgColor: 'bg-orange-100 dark:bg-orange-900/20',
                iconColor: 'text-orange-600 dark:text-orange-400',
            },
            conversation: {
                bgColor: 'bg-green-100 dark:bg-green-900/20',
                iconColor: 'text-green-600 dark:text-green-400',
            },
        };
        return styles[type] || styles.srs;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity) => {
                        const Icon = getIcon(activity.type);
                        const styles = getIconStyles(activity.type);
                        return (
                            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className={`p-2 rounded-lg ${styles.bgColor}`}>
                                    <Icon className={`w-4 h-4 ${styles.iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {activity.title}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {activity.user} • {activity.time}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
