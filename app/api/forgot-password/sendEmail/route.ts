import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { email } = await request.json();
    const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });
    const response = await res.json();
    console.log(response);
    if(res.ok) {
        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
    }
    else {
        return NextResponse.json({ message: response.detail }, { status: res.status });
    }
}