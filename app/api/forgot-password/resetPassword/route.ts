import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { new_password, email } = await req.json();
    const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/auth/reset-password?email=${email}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            new_password
        })
    });
    if(res.ok) {
        return new Response("Password reset successful", { status: 200 });
    }
    return new Response("Password reset failed", { status: 400 });
}