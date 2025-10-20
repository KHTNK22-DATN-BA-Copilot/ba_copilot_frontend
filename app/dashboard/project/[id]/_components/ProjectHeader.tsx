import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from './types';

interface ProjectHeaderProps {
    project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {project.name}
                        </h1>
                        <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                            {project.status}
                        </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
                </div>
                <Button variant="outline" className="ml-4">
                    Edit Project
                </Button>
            </div>
        </div>
    );
}
