import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    let { code, email } = await req.json();
    const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/auth/verify-otp?email=${email}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code
        })
    });
    const response = await res.json()
    console.log("Response from OTP verification:", response);
    if(res.ok) {
        return new Response("PIN verification successful", { status: 200 });
    }
    return new Response("PIN verification failed", { status: 400 });
}