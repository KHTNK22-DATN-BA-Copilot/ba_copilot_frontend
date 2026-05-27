import { Project, ProjectMembership } from "@/app/dashboard/project/[id]/_components/types";
import {ErrorType, ServiceResponse} from "@/type/types";
import { HttpError } from "@/lib/auth-session";

export interface RecentUpdatedFile {
    id: string;
    folder_id: number;
    name: string;
    extension?: string;
    updated_at?: string;
    created_at?: string;
}

export class ProjectService {
    public static async getAllProjects(token: string) {
        const res = await fetch(
            `${process.env.BACKEND_DOMAIN}/api/v2/projects/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!res.ok) {
            const errorData: ErrorType = await res.json();
            console.error("Failed to fetch projects:", errorData.message);
            throw new HttpError(res.status, errorData.message || "Failed to fetch projects");
        }
        const data = await res.json();
        return data.projects || [];
    }

    public static async getProjectById(token: string, projectId: string) {
        const res = await fetch(
            `${process.env.BACKEND_DOMAIN}/api/v2/projects/${projectId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!res.ok) {
            const errorData: ErrorType = await res.json().catch(() => ({ message: "Failed to fetch project" }));
            console.error("Failed to fetch project details:", errorData.message || res.statusText);
            throw new HttpError(res.status, errorData.message || "Failed to fetch project");
        }

        const project: Project = await res.json();
        return project;
    }

    public static async createProject(
        token: string,
        name: string,
        description: string,
        status: string,
        team_size: number = 1,
        due_date?: string,
        project_priority?: string
    ): Promise<ServiceResponse<Project>> {
        const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v2/projects/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                description: description || null,
                status: status || "active",
                team_size,
                due_date: due_date || null,
                project_priority: project_priority || "low",
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

    public static async getMyProjectMembership(token: string, projectId: string): Promise<ProjectMembership> {
        const res = await fetch(
            `${process.env.BACKEND_DOMAIN}/api/v2/projects/${projectId}/members/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ detail: "Failed to fetch project membership" }));
            throw new HttpError(res.status, errorData.detail || "Failed to fetch project membership");
        }

        const data: ProjectMembership = await res.json();
        return data;
    }

    public static async getRecentUpdatedFiles(token: string, projectId: string, limit = 6): Promise<RecentUpdatedFile[]> {
        const treeRes = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/projects/${projectId}/tree`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!treeRes.ok) {
            const errorData: ErrorType = await treeRes.json();
            console.error("Failed to fetch project tree:", errorData.message);
            throw new HttpError(treeRes.status, errorData.message || "Failed to fetch project tree");
        }

        const treeData = await treeRes.json();
        // The tree endpoint returns { tree: { folders: [...nested...], files: [...] } }
        const tree = treeData?.tree ?? treeData;

        const files: RecentUpdatedFile[] = [];

        function collectFiles(node: { folders?: Array<any>; files?: Array<RecentUpdatedFile> }) {
            for (const file of node.files ?? []) {
                files.push(file);
            }
            for (const folder of node.folders ?? []) {
                collectFiles(folder);
            }
        }

        collectFiles(tree);

        return files
            .sort((a, b) => {
                const dateA = new Date(a.updated_at ?? a.created_at ?? 0).getTime();
                const dateB = new Date(b.updated_at ?? b.created_at ?? 0).getTime();
                return dateB - dateA;
            })
            .slice(0, limit);
    }
}
