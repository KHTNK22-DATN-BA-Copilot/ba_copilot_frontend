import { NextResponse } from "next/server";
import { HandleGoogleCallback } from "@/actions/auth.action";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(
            new URL("/login?error=missing_code", APP_URL)
        );
    }

    try {
        const response = await HandleGoogleCallback(code);

        if (!response.success) {
            return NextResponse.redirect(
                new URL("/login?error=auth_failed", APP_URL)
            );
        }

        return NextResponse.redirect(
            new URL("/dashboard", APP_URL)
        );

    } catch (error) {
        console.error("Lỗi xác thực Google:", error);

        return NextResponse.redirect(
            new URL("/login?error=auth_failed", APP_URL)
        );
    }
}