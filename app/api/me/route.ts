import { NextRequest } from "next/server";
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