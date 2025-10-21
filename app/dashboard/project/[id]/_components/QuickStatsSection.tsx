import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuickStat } from './types';
import { projectIcons, IconType } from './icons';

interface QuickStatsSectionProps {
    stats: QuickStat[];
}

export default function QuickStatsSection({ stats }: QuickStatsSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => {
                        const Icon = projectIcons[stat.icon as IconType] || projectIcons.FileText;
                        return (
                            <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                    <Icon className="w-5 h-5" />
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
