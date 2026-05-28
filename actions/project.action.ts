'use server'

import { ProjectService } from "@/services/ProjectService";
import { withAccessToken } from "@/lib/auth-action"

export async function getAllProjects() {
    try {
        return await withAccessToken((accessToken) => ProjectService.getAllProjects(accessToken));
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
}

export async function getProjectById(projectId: string) {
    try {
        return await withAccessToken((accessToken) => ProjectService.getProjectById(accessToken, projectId));
    }
    catch (error) {
        console.error(`Error fetching project with ID ${projectId}:`, error);
        throw error;
    }
}

export async function createProject(
    name: string,
    description: string,
    status: string,
    teamSize: number = 1,
    dueDate?: string,
    priority?: string
) {
    const response = await withAccessToken((accessToken) =>
        ProjectService.createProject(accessToken, name, description, status, teamSize, dueDate, priority)
    );

    if (response.success) {
        return {
            status: response.statusCode,
            data: response.data,
        }
    }

    return {
        status: response.statusCode,
        message: response.message
    }
}

export async function getMyProjectMembership(projectId: string) {
    try {
        return await withAccessToken((accessToken) =>
            ProjectService.getMyProjectMembership(accessToken, projectId)
        );
    } catch (error) {
        console.error(`Error fetching membership for project ${projectId}:`, error);
        throw error;
    }
}

export async function getRecentUpdatedFiles(projectId: string, limit = 6) {
    try {
        return await withAccessToken((accessToken) => ProjectService.getRecentUpdatedFiles(accessToken, projectId, limit));
    }
    catch (error) {
        console.error(`Error fetching recent updated files for project ${projectId}:`, error);
        return [];
    }
}

export async function getProjectMembers(projectId: string) {
    try {
        return await withAccessToken((accessToken) =>
            ProjectService.getProjectMembers(accessToken, projectId)
        );
    } catch (error) {
        console.error(`Error fetching members for project ${projectId}:`, error);
        throw error;
    }
}

export async function inviteProjectMember(projectId: string, email: string, role: string) {
    try {
        const data = await withAccessToken((accessToken) =>
            ProjectService.inviteProjectMember(accessToken, projectId, email, role)
        );
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to invite member" };
    }
}

export async function updateProjectMemberRole(projectId: string, userId: string | number, role: string) {
    try {
        const data = await withAccessToken((accessToken) =>
            ProjectService.updateProjectMemberRole(accessToken, projectId, userId, role)
        );
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to update member role" };
    }
}

export async function removeProjectMember(projectId: string, userId: string | number) {
    try {
        const data = await withAccessToken((accessToken) =>
            ProjectService.removeProjectMember(accessToken, projectId, userId)
        );
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to remove member" };
    }
}