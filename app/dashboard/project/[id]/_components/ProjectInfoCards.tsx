import { Calendar, Clock, Users, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Project } from './types';

interface ProjectInfoCardsProps {
    project: Project;
}

export default function ProjectInfoCards({ project }: ProjectInfoCardsProps) {
    const infoCards = [
        {
            label: 'Start Date',
            value: project.createdDate,
            icon: Calendar,
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
            iconColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            label: 'Updated At',
            value: project.dueDate,
            icon: Clock,
            bgColor: 'bg-orange-100 dark:bg-orange-900/20',
            iconColor: 'text-orange-600 dark:text-orange-400',
        },
        {
            label: 'Team Members',
            value: `${project.teamMembers} Members`,
            icon: Users,
            bgColor: 'bg-green-100 dark:bg-green-900/20',
            iconColor: 'text-green-600 dark:text-green-400',
        },
        {
            label: 'Status',
            value: `${project.progress}%`,
            icon: CheckCircle2,
            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
            iconColor: 'text-purple-600 dark:text-purple-400',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {infoCards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <div className={`p-2 ${card.bgColor} rounded-lg`}>
                                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {card.label}
                                    </p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        {card.value}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
