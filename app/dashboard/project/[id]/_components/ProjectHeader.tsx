'use client';

import { useEffect, useState } from 'react';
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
    const [prj, setProject] = useState<Project>({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        progress: project.progress,
        created_at: "01-10-2025",
        dueDate: "15-12-2025",
        teamMembers: 5,
        completedTasks: 24,
        totalTasks: 37,
    });

    useEffect(() => {
        localStorage.setItem('projectId', prj.id as string);
    }, [])

    const updateProject = (updatedFields: Partial<Project>) => {
        setProject(prev => ({
            ...prev,
            ...updatedFields,
        }));
    }; 
    

    const handleProjectUpdated = (updatedProject: Partial<Project>) => {
        if (onProjectUpdate) {
            onProjectUpdate(updatedProject);
        }
        else {
            updateProject(updatedProject);
        }
    };

    return (
        <>
            <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 break-words">
                                {prj.name}
                            </h1>
                            <Badge
                                variant={prj.status === "In Progress" ? "default" : "secondary"}
                                className="w-fit"
                            >
                                {prj.status}
                            </Badge>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-words">
                            {prj.description}
                        </p>
                    </div>
                    <Button
                        size="sm"
                        className="cursor-pointer shrink-0 w-full sm:w-auto"
                        onClick={() => setIsEditDialogOpen(true)}
                    >
                        <Pencil />
                        Edit Project
                    </Button>
                </div>
            </div>

            <EditProjectDialog
                project={prj}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onProjectUpdated={handleProjectUpdated}
            />
        </>
    );
}
