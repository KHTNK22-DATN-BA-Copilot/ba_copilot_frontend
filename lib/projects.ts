"use server";
import { cookies } from "next/headers";
import { Diagram } from "@/app/dashboard/project/[id]/diagrams/_lib/constants";
import { date } from "zod";
import { Project } from "@/app/dashboard/project/[id]/_components/types"
import { withAccessToken } from "@/lib/auth-action";
import { HttpError } from "@/lib/auth-session";

export async function getAllProjects() {
    return withAccessToken(async (access_token) => {
        const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/projects/`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!res.ok) {
            console.error("Failed to fetch projects:", res.statusText);
            throw new HttpError(res.status, "Failed to fetch projects");
        }
        const data = await res.json();

        return data.projects;
    });
}

export async function getAllDiagrams(projectId: any): Promise<Diagram[]> {
    return withAccessToken(async (access_token) => {
        const res = await fetch(
            `${process.env.BACKEND_DOMAIN}/api/v1/diagram/list/${projectId}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        if (!res.ok) {
            console.error("Failed to fetch diagrams:", res.statusText);
            throw new HttpError(res.status, "Failed to fetch diagrams");
        }
        const data = await res.json();

        const diagrams: Diagram[] = data.diagrams.map((diagram: any) => ({
            id: diagram.diagram_id,
            name: diagram.title,
            type: diagram.diagram_type,
            date: diagram.update_at,
            preview: diagram.description,
            markdown: diagram.content_md,
        }));

        return diagrams;
    });
}

export async function getAccessToken() {
    return withAccessToken(async (access_token) => access_token);
}

export async function getProjectData(projectId: string) {
    return withAccessToken(async (acces_token) => {
        const data = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/projects/${projectId}`, {
            headers: {
                Authorization: `Bearer ${acces_token}`,
            }
        })

        if (!data.ok) {
            throw new HttpError(data.status, "Failed to fetch project");
        }

        const project: Project = await data.json();
        return project;
    });
}