"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isTokenExpired, isUnauthorizedError, refreshAccessToken } from "./auth-session";

type MaybeUnauthorized = {
    status?: number;
    statusCode?: number;
    success?: boolean;
    message?: string;
};

function isUnauthorizedResult(result: unknown): boolean {
    if (!result || typeof result !== "object") {
        return false;
    }

    const typedResult = result as MaybeUnauthorized;
    return typedResult.status === 401 || typedResult.statusCode === 401;
}

async function getFreshAccessToken(forceRefresh = false): Promise<string> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value || "";
    const refreshToken = cookieStore.get("refresh_token")?.value || "";

    if (!forceRefresh && accessToken && !isTokenExpired(accessToken)) {
        return accessToken;
    }

    const refreshedAccessToken = await refreshAccessToken(refreshToken);
    if (!refreshedAccessToken) {
        redirect("/login");
    }

    cookieStore.set("access_token", refreshedAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 30 * 60 * 1000),
    });

    return refreshedAccessToken;
}

export async function withAccessToken<T>(
    handler: (accessToken: string) => Promise<T>,
): Promise<T> {
    const accessToken = await getFreshAccessToken();

    try {
        const result = await handler(accessToken);
        if (!isUnauthorizedResult(result)) {
            return result;
        }
    } catch (error) {
        if (!isUnauthorizedError(error)) {
            throw error;
        }
    }

    const refreshedAccessToken = await getFreshAccessToken(true);

    try {
        const retriedResult = await handler(refreshedAccessToken);
        if (isUnauthorizedResult(retriedResult)) {
            redirect("/login");
        }

        return retriedResult;
    } catch (error) {
        if (isUnauthorizedError(error)) {
            redirect("/login");
        }

        throw error;
    }
}
