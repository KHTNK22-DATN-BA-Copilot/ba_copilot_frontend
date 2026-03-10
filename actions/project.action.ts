'use server'

import { cookies } from "next/headers";
import { ProjectService } from "@/services/ProjectService";

export async function getAllProjects() {
    const accessToken = (await cookies()).get("access_token")?.value as string
    try {
        return await ProjectService.getAllProjects(accessToken);
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
}

export async function getProjectById(projectId: string) {
    const accessToken = (await cookies()).get("access_token")?.value as string
    try {
        return await ProjectService.getProjectById(accessToken, projectId);
    }
    catch (error) {
        console.error(`Error fetching project with ID ${projectId}:`, error);
        throw error;
    }
}

export async function createProject(name: string, description: string, status: string) {
    const accessToken = (await cookies()).get("access_token")?.value as string
    const response = await ProjectService.createProject(accessToken, name, description, status)

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