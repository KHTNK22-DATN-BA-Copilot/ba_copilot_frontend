import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/auth/login`, {
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
    if (res.ok) {
        const accessToken = response.access_token;
        const refreshToken = response.refresh_token;
        (await cookies()).set("access_token", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        });
        (await cookies()).set("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });


        return NextResponse.json(
            { message: "Login successfully" },
            { status: res.status }
        );
    } else {
        return NextResponse.json(
            { error: response.detail || "Login failed" },
            { status: res.status }
        );
    }
}
