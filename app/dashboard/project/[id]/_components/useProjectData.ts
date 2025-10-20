import { useState, useEffect, useCallback } from 'react';
import { Project } from './types';

// Format date to dd-mm-yyyy
function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString; // Return original if invalid
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    } catch {
        return dateString; // Return original if error
    }
}

export function useProjectData(projectId: string | string[]) {
    const [project, setProject] = useState<Project>({
        id: projectId,
        name: `Project ${projectId}`,
        description: "A comprehensive business analysis project...",
        status: "In Progress",
        progress: 65,
        createdDate: "01-10-2025",
        dueDate: "15-12-2025",
        teamMembers: 5,
        completedTasks: 24,
        totalTasks: 37,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!projectId) {
                setError('Project ID is required');
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/projects/${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const data = await response.json();

                if (!response.ok) {
                    // Handle error response from API
                    throw new Error(data.error || `Failed to fetch project: ${response.status}`);
                }

                // Update project state with fetched data
                setProject({
                    id: data.id || projectId,
                    name: data.name || `Project ${projectId}`,
                    description: data.description || "No description available",
                    status: data.status || "active",
                    progress: data.progress || 0,
                    createdDate: data.created_at ? formatDate(data.created_at) : formatDate(new Date().toISOString()),
                    dueDate: data.updated_at ? formatDate(data.updated_at) : formatDate(new Date().toISOString()),
                    teamMembers: data.team_members || 1,
                    completedTasks: data.completed_tasks || 0,
                    totalTasks: data.total_tasks || 0,
                });

            } catch (error) {
                console.error('Error fetching project:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch project';
                setError(errorMessage);

                // Keep the default mock data if fetch fails
                setProject(prev => ({
                    ...prev,
                    id: projectId,
                    name: `Project ${projectId}`,
                }));
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectData();
    }, [projectId]);

    // Function to update project locally without refetching
    const updateProject = useCallback((updatedFields: Partial<Project>) => {
        setProject(prev => ({
            ...prev,
            ...updatedFields,
        }));
    }, []);

    return { project, isLoading, error, updateProject };
}
