import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(req: NextRequest) {
    const { fullName, email } = await req.json();
    const access_token = (await cookies()).get("access_token")?.value || "";
    const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/user/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify({ name: fullName, email })
    });
    const result = await res.json();
    if (res.ok) {
        return new Response(JSON.stringify(result), { status: 200 });
    } else {
        return new Response(JSON.stringify({ message: result.message || 'Failed to update profile' }), { status: res.status });
    }
}

export async function DELETE() {
    try {
        const access_token = (await cookies()).get("access_token")?.value || "";
        
        if (!access_token) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
        }

        const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/user/me`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
        });

        const result = await res.json();
        
        if (res.ok) {
            // Clear the access token cookie
            const response = new Response(JSON.stringify(result), { status: 200 });
            response.headers.set('Set-Cookie', 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax');
            return response;
        } else {
            return new Response(JSON.stringify({ message: result.detail || result.message || 'Failed to delete account' }), { status: res.status });
        }
    } catch (error) {
        console.error('Delete account error:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}