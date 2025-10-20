import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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

        console.log(`📡 [API Route] Fetching project with ID: ${id}`);

        // Get access token from cookies
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token");

        if (!accessToken) {
            console.log('❌ [API Route] Unauthorized - No access token');
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Call backend API to get project details
        const backendUrl = `${process.env.BACKEND_DOMAIN}/api/v1/projects/${id}`;
        console.log(`🔄 [API Route] Calling backend: ${backendUrl}`);
        
        const res = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken.value}`,
            },
        });

        const response = await res.json();

        if (res.ok) {
            console.log('✅ [API Route] Project data received from backend:');
            console.log(JSON.stringify(response, null, 2));
            console.log('-------------------');
            return NextResponse.json(response, { status: 200 });
        } else {
            console.log(`❌ [API Route] Failed to fetch project: ${response.detail}`);
            return NextResponse.json(
                { error: response.detail || "Failed to fetch project" },
                { status: res.status }
            );
        }
    } catch (error) {
        console.error("❌ [API Route] Error fetching project:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
