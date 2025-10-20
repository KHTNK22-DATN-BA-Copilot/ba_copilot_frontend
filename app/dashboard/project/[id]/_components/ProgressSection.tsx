import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Project } from './types';

interface ProgressSectionProps {
    project: Project;
}

export default function ProgressSection({ project }: ProgressSectionProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                Overall Progress
                            </span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {project.progress}%
                        </span>
                    </div>
                    <Progress value={project.progress} className="h-3" />
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{project.completedTasks} of {project.totalTasks} tasks completed</span>
                        <span>{project.totalTasks - project.completedTasks} remaining</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
