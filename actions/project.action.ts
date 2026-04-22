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

export async function createProject(name: string, description: string, status: string) {
    const response = await withAccessToken((accessToken) => ProjectService.createProject(accessToken, name, description, status))

    if(response.success) {
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

export async function getRecentUpdatedFiles(projectId: string, limit = 6) {
    try {
        return await withAccessToken((accessToken) => ProjectService.getRecentUpdatedFiles(accessToken, projectId, limit));
    }
    catch (error) {
        console.error(`Error fetching recent updated files for project ${projectId}:`, error);
        return [];
    }
}