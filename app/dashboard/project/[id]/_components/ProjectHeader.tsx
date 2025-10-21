'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Project } from './types';
import EditProjectDialog from './EditProjectDialog';

interface ProjectHeaderProps {
    project: Project;
    onProjectUpdate?: (updatedProject: Partial<Project>) => void;
}

export default function ProjectHeader({ project, onProjectUpdate }: ProjectHeaderProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleProjectUpdated = (updatedProject: Partial<Project>) => {
        if (onProjectUpdate) {
            onProjectUpdate(updatedProject);
        }
    };

    return (
        <>
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
                    <Button
                        size="sm"
                        className="ml-4 cursor-pointer"
                        onClick={() => setIsEditDialogOpen(true)}
                    >
                        <Pencil />
                        Edit Project
                    </Button>
                </div>
            </div>

            <EditProjectDialog
                project={project}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onProjectUpdated={handleProjectUpdated}
            />
        </>
    );
}
