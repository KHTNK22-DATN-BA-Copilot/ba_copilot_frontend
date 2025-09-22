import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    const res = await fetch("http://localhost:8010/api/v1/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            email: email,
            password: password,
        }),
    });

    const response = await res.json();
    const accessToken = response.access_token;
    (await cookies()).set("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    return NextResponse.json({message: "Login successfully"}, { status: res.status });
}
