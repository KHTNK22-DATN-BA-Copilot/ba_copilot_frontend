import { useState, useEffect } from 'react';
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
            if (!projectId) return;

            setIsLoading(true);
            try {
                console.log(`🔄 Fetching project data for ID: ${projectId}`);

                const response = await fetch(`/api/projects/${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProject(prev => ({
                    ...prev,
                    name: data.name,
                    description: data.description,
                    status: data.status,
                    createdDate: formatDate(data.created_at),
                    dueDate: formatDate(data.updated_at),
                }));

                // Print the response in terminal (console)
                console.log('✅ Project data received:');
                console.log(JSON.stringify(data, null, 2));
                console.log('-------------------');
                console.log('Project Details:');
                console.log(`- ID: ${data.id}`);
                console.log(`- Name: ${data.name}`);
                console.log(`- Description: ${data.description}`);
                console.log(`- Status: ${data.status}`);
                console.log(`- Created At: ${data.created_at}`);
                console.log(`- Updated At: ${data.updated_at}`);
                console.log('-------------------');

            } catch (error) {
                console.error('❌ Error fetching project data:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch project');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectData();
    }, [projectId]);

    return { project, isLoading, error };
}
