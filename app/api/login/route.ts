import { NextRequest, NextResponse } from "next/server";

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
    return NextResponse.json({message: "Login succesfully"}, { status: res.status });
}
