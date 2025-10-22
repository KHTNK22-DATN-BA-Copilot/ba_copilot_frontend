import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("access_token")?.value;
    const refreshToken = req.cookies.get("refresh_token")?.value;
    if (!accessToken) {
        if (refreshToken) {
            // co refresh token
            const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });
            if (res.ok) {
                const response = await res.json();
                const nextRes = NextResponse.next();

                nextRes.cookies.set('access_token', response.accessToken, {
                    httpOnly: true,
                    sameSite: 'lax',
                    expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
                })
                return nextRes;
            }
            else {
                const errorResponse = await res.json();
                console.error('Error refreshing token:', errorResponse);
            }
        } else {
            //Khong co refresh token
            return NextResponse.redirect(new URL(`/login`, req.url));
        }
    } else {
        return NextResponse.next();
    }
    
}

export const config = {
    matcher: ["/dashboard/:path*"],
}