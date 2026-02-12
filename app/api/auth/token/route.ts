import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * GET /api/auth/token
 * Get the current user's access token from httpOnly cookie
 */
export async function GET(request: NextRequest) {
    try {
        const access_token = (await cookies()).get("access_token")?.value;
        
        if (!access_token) {
            return NextResponse.json(
                { error: "No access token found" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            access_token,
            status: "success"
        });
    } catch (error) {
        console.error("Error getting access token:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
