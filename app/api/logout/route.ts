import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    const token = (await cookies()).get("access_token")?.value;
    const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    const response = await res.json();
    console.log("Logout response:", response);

    (await cookies()).delete("access_token");
    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
}
