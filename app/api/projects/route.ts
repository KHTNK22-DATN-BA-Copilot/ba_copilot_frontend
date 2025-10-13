import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, status } = body;

        // Get access token from cookies
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token");

        if (!accessToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Call backend API to create project
        const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/projects/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken.value}`,
            },
            body: JSON.stringify({
                name,
                description: description || null,
                status: status || "active",
            }),
        });

        const response = await res.json();

        if (res.ok) {
            return NextResponse.json(response, { status: 201 });
        } else {
            return NextResponse.json(
                { error: response.detail || "Failed to create project" },
                { status: res.status }
            );
        }
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        // Get access token from cookies
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token");

        if (!accessToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Call backend API to get projects
        const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/projects/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken.value}`,
            },
        });

        const response = await res.json();

        if (res.ok) {
            return NextResponse.json(response, { status: 200 });
        } else {
            return NextResponse.json(
                { error: response.detail || "Failed to fetch projects" },
                { status: res.status }
            );
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
