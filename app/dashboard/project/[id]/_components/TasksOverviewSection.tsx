import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskOverview } from './types';

interface TasksOverviewSectionProps {
    tasks: TaskOverview;
}

export default function TasksOverviewSection({ tasks }: TasksOverviewSectionProps) {
    const taskStats = [
        {
            label: 'Completed',
            value: tasks.completed,
            icon: CheckCircle2,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
        },
        {
            label: 'In Progress',
            value: tasks.inProgress,
            icon: Clock,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        },
        {
            label: 'Pending',
            value: tasks.pending,
            icon: AlertCircle,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-100 dark:bg-orange-900/20',
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tasks Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {taskStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                        <Icon className={`w-4 h-4 ${stat.color}`} />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {stat.label}
                                    </p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {stat.value}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
