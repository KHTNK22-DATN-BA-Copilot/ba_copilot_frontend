import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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

        // Call backend API to get current user project membership via v2
        const backendUrl = `${process.env.BACKEND_DOMAIN}/api/v2/projects/${id}/members/me`;
        
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
                { error: response.detail || "Failed to fetch project membership" },
                { status: res.status }
            );
        }
    } catch (error) {
        console.error("Error fetching project membership:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
