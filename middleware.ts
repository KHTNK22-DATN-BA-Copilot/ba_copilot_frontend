import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired, refreshAccessToken } from "@/lib/auth-session";

export async function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("access_token")?.value;
    const refreshToken = req.cookies.get("refresh_token")?.value;
    const shouldRefresh = !accessToken || isTokenExpired(accessToken);

    if (!shouldRefresh) {
        return NextResponse.next();
    }

    if (!refreshToken) {
        return NextResponse.redirect(new URL(`/login`, req.url));
    }

    const refreshedAccessToken = await refreshAccessToken(refreshToken);
    if (!refreshedAccessToken) {
        return NextResponse.redirect(new URL(`/login`, req.url));
    }

    const nextRes = NextResponse.next();
    nextRes.cookies.set("access_token", refreshedAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 30 * 60 * 1000),
    });
    return nextRes;
}

export const config = {
    matcher: ["/dashboard/:path*"],
}