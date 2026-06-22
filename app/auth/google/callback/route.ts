import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { HandleGoogleCallback } from "@/actions/auth.action";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
    }

    try {
        
        const response = await HandleGoogleCallback(code);

        if (!response.success) {
            return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
        }

        return NextResponse.redirect(new URL("/dashboard", request.url));
        
    } catch (error) {
        console.error("Lỗi xác thực Google:", error);
        return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
    }
}