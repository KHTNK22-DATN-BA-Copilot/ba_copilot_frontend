type RefreshResponse = {
    accessToken?: string;
    access_token?: string;
};

export class HttpError extends Error {
    public readonly statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.name = "HttpError";
        this.statusCode = statusCode;
    }
}

function base64UrlDecode(input: string): string {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

    if (typeof atob === "function") {
        const binary = atob(padded);
        const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
        return new TextDecoder().decode(bytes);
    }

    if (typeof Buffer !== "undefined") {
        return Buffer.from(padded, "base64").toString("utf8");
    }

    return "";
}

export function getTokenExpiry(token: string): number | null {
    const parts = token.split(".");
    if (parts.length !== 3) {
        return null;
    }

    try {
        const payload = JSON.parse(base64UrlDecode(parts[1])) as { exp?: number };
        return typeof payload.exp === "number" ? payload.exp : null;
    } catch {
        return null;
    }
}

export function isTokenExpired(token: string, skewSeconds = 30): boolean {
    const expiry = getTokenExpiry(token);
    if (!expiry) {
        return false;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return expiry <= nowInSeconds + skewSeconds;
}

export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
    if (!refreshToken) {
        return null;
    }

    try {
        const response = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
            return null;
        }

        const payload = (await response.json()) as RefreshResponse;
        return payload.accessToken ?? payload.access_token ?? null;
    } catch (error) {
        console.error("Refresh access token error:", error);
        return null;
    }
}

export function isUnauthorizedError(error: unknown): boolean {
    if (!error || typeof error !== "object") {
        return false;
    }

    const typedError = error as { statusCode?: number; status?: number; message?: string };
    if (typedError.statusCode === 401 || typedError.status === 401) {
        return true;
    }

    const message = typedError.message?.toLowerCase() || "";
    return message.includes("unauthorized") || message.includes("401");
}
