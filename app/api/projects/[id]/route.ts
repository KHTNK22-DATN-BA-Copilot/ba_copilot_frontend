import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, description, status, due_date, project_priority, team_size, settings } = body;

        // Get access token from cookies
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token");

        if (!accessToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Build request body - include all fields as required by backend
        const updateData = {
            name,
            description,
            status,
            due_date,
            project_priority,
            team_size,
            settings,
        };

        // Call backend API to update project
        const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/projects/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken.value}`,
            },
            body: JSON.stringify(updateData),
        });

        const response = await res.json();

        if (res.ok) {
            return NextResponse.json(response, { status: 200 });
        } else {
            return NextResponse.json(
                { error: response.detail || "Failed to update project" },
                { status: res.status }
            );
        }
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get access token from cookies
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token");

        if (!accessToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Call backend API to soft delete project (sets status to "deleted")
        const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/projects/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken.value}`,
            },
        });

        if (res.ok) {
            const response = await res.json();
            return NextResponse.json(
                { message: response.message || "Project deleted successfully" },
                { status: 200 }
            );
        } else {
            const response = await res.json();
            return NextResponse.json(
                { error: response.detail || "Failed to delete project" },
                { status: res.status }
            );
        }
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get access token from cookies
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token");

        if (!accessToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Call backend API to get project details
        const backendUrl = `${process.env.BACKEND_DOMAIN}/api/v1/projects/${id}`;
        
        const res = await fetch(backendUrl, {
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
                { error: response.detail || "Failed to fetch project" },
                { status: res.status }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
