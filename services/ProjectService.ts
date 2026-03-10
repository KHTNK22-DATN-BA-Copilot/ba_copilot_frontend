import { Project } from "@/app/dashboard/project/[id]/_components/types";
import {ErrorType, ServiceResponse} from "@/type/types";

export class ProjectService {
    public static async getAllProjects(token: string) {
        const res = await fetch(
            `${process.env.BACKEND_DOMAIN}/api/v1/projects/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!res.ok) {
            const errorData: ErrorType = await res.json();
            console.error("Failed to fetch projects:", errorData.message);
            throw new Error(errorData.message);
        }
        const data = await res.json();
        return data.projects;
    }

    public static async getProjectById(token: string, projectId: string) {
        const data = await fetch(
            `${process.env.BACKEND_DOMAIN}/api/v1/projects/${projectId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const project: Project = await data.json();
        return project;
    }

    public static async createProject(token: string, name: string, description: string, status: string): Promise<ServiceResponse<Project>> {
        const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/projects/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                description: description || null,
                status: status || "active",
            }),
        });

        if(res.ok) {
            const data: Project = await res.json()
            return {
                success: true,
                statusCode: 201,
                data: data
            }
        }

        return {
            success: false,
            statusCode: res.status,
            message: res.statusText
        }
    }
}
