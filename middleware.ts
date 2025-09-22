import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("access_token")?.value;
    if (!accessToken) {
        return NextResponse.redirect(new URL(`/login`, req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
}