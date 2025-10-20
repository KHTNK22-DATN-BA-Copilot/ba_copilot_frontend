import { FileText, Layout, BarChart3, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuickStat } from './types';

interface QuickStatsSectionProps {
    stats: QuickStat[];
}

export default function QuickStatsSection({ stats }: QuickStatsSectionProps) {
    const getIcon = (iconName: string) => {
        const icons = {
            FileText,
            Layout,
            BarChart3,
            MessageSquare,
        };
        return icons[iconName as keyof typeof icons] || FileText;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => {
                        const Icon = getIcon(stat.icon);
                        return (
                            <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {stat.label}
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
