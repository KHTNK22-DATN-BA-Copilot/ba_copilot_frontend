"use server";
import { cookies } from "next/headers";
import { Diagram } from "@/app/dashboard/project/[id]/diagrams/_lib/constants";
import { date } from "zod";

export async function getAllProjects() {
    const access_token = (await cookies()).get("access_token")?.value;
    const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/projects/`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res.ok) {
        console.error("Failed to fetch projects:", res.statusText);
        throw new Error("Failed to fetch projects");
    }
    const data = await res.json();

    return data.projects;
}

export async function getAllDiagrams(projectId: any): Promise<Diagram[]> {
    const access_token = (await cookies()).get("access_token")?.value;
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
        throw new Error("Failed to fetch diagrams");
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
}

export async function getAccessToken() {
    const access_token = (await cookies()).get("access_token")?.value;
    return access_token;
}