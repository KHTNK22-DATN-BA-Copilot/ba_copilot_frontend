"use server";
import { cookies } from "next/headers";

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


