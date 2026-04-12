import "server-only";

import {
    APIKeyItem,
    APIKeysResponse,
    APIKeyTestResult,
    AIProvider,
    ProviderModelMap,
    SaveAPIKeyPayload,
    ServiceResponse,
    TestAPIKeyPayload,
} from "@/type/types";

const PROVIDER_MODELS: ProviderModelMap = {
    openai: ["gpt-4o", "gpt-4.1-mini", "gpt-3.5-turbo"],
    anthropic: ["claude-3-5-sonnet", "claude-3-opus", "claude-3-haiku"],
    gemini: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
};

let keysDb: APIKeyItem[] = [
    {
        id: "key-openai",
        provider: "openai",
        model: "gpt-4o",
        maskedKey: "sk-proj-********a1b2",
        rawKey: "sk-proj-valid-openai-a1b2",
        status: "active",
        testedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "key-anthropic",
        provider: "anthropic",
        model: "claude-3-opus",
        maskedKey: "sk-ant-********c3d4",
        rawKey: "sk-ant-stale-anthropic-c3d4",
        status: "needs_revalidation",
        testedAt: null,
        updatedAt: new Date().toISOString(),
    },
];

function isProvider(value: string): value is AIProvider {
    return value === "openai" || value === "anthropic" || value === "gemini";
}

function maskApiKey(key: string): string {
    const trimmed = key.trim();
    if (!trimmed) {
        return "********";
    }

    const head = trimmed.slice(0, Math.min(8, trimmed.length));
    const tail = trimmed.length > 4 ? trimmed.slice(-4) : "";
    return `${head}${"*".repeat(8)}${tail}`;
}

function evaluateKeyStatus(key: string): APIKeyItem["status"] {
    const normalized = key.toLowerCase();
    if (normalized.includes("invalid") || key.length < 12) {
        return "invalid";
    }
    if (normalized.includes("stale") || normalized.includes("retry")) {
        return "needs_revalidation";
    }
    return "active";
}

export class ApiKeyService {
    public static async listApiKeys(_token: string): Promise<ServiceResponse<APIKeysResponse>> {
        return {
            success: true,
            statusCode: 200,
            data: {
                keys: [...keysDb].sort((a, b) => a.provider.localeCompare(b.provider)),
                providers: PROVIDER_MODELS,
            },
        };
    }

    public static async saveApiKey(
        _token: string,
        payload: SaveAPIKeyPayload,
    ): Promise<ServiceResponse<APIKeyItem>> {
        if (!isProvider(payload.provider)) {
            return {
                success: false,
                statusCode: 400,
                message: "Provider is not supported.",
            };
        }

        if (!payload.apiKey?.trim()) {
            return {
                success: false,
                statusCode: 400,
                message: "API key is required.",
            };
        }

        if (!PROVIDER_MODELS[payload.provider]?.includes(payload.model)) {
            return {
                success: false,
                statusCode: 400,
                message: "Model is not supported for selected provider.",
            };
        }

        const status = evaluateKeyStatus(payload.apiKey);
        const now = new Date().toISOString();
        const existing = keysDb.find((item) => item.provider === payload.provider);

        const keyItem: APIKeyItem = {
            id: existing?.id ?? `key-${payload.provider}`,
            provider: payload.provider,
            model: payload.model,
            maskedKey: maskApiKey(payload.apiKey),
            rawKey: payload.apiKey,
            status,
            testedAt: status === "active" ? now : null,
            updatedAt: now,
        };

        keysDb = keysDb.filter((item) => item.provider !== payload.provider);
        keysDb.push(keyItem);

        return {
            success: true,
            statusCode: 200,
            data: keyItem,
        };
    }

    public static async changeModel(
        _token: string,
        provider: AIProvider,
        model: string,
    ): Promise<ServiceResponse<APIKeyItem>> {
        if (!isProvider(provider)) {
            return {
                success: false,
                statusCode: 400,
                message: "Provider is not supported.",
            };
        }

        if (!PROVIDER_MODELS[provider]?.includes(model)) {
            return {
                success: false,
                statusCode: 400,
                message: "Model is not supported for selected provider.",
            };
        }

        const existing = keysDb.find((item) => item.provider === provider);
        if (!existing) {
            return {
                success: false,
                statusCode: 404,
                message: "No key found for this provider.",
            };
        }

        const updated: APIKeyItem = {
            ...existing,
            model,
            status: "needs_revalidation",
            updatedAt: new Date().toISOString(),
        };

        keysDb = keysDb.map((item) => (item.provider === provider ? updated : item));

        return {
            success: true,
            statusCode: 200,
            data: updated,
        };
    }

    public static async deleteApiKey(
        _token: string,
        provider: AIProvider,
    ): Promise<ServiceResponse<null>> {
        if (!isProvider(provider)) {
            return {
                success: false,
                statusCode: 400,
                message: "Provider is not supported.",
            };
        }

        const before = keysDb.length;
        keysDb = keysDb.filter((item) => item.provider !== provider);

        if (keysDb.length === before) {
            return {
                success: false,
                statusCode: 404,
                message: "No key found for this provider.",
            };
        }

        return {
            success: true,
            statusCode: 200,
            data: null,
        };
    }

    public static async testApiKey(
        _token: string,
        payload: TestAPIKeyPayload,
    ): Promise<ServiceResponse<APIKeyTestResult>> {
        if (!isProvider(payload.provider)) {
            return {
                success: false,
                statusCode: 400,
                message: "Provider is not supported.",
            };
        }

        if (!payload.apiKey?.trim()) {
            return {
                success: true,
                statusCode: 200,
                data: {
                    valid: false,
                    status: "invalid",
                    message: "API key is required.",
                },
            };
        }

        if (!PROVIDER_MODELS[payload.provider]?.includes(payload.model)) {
            return {
                success: true,
                statusCode: 200,
                data: {
                    valid: false,
                    status: "invalid",
                    message: "Model is not supported for selected provider.",
                },
            };
        }

        const status = evaluateKeyStatus(payload.apiKey);
        if (status === "active") {
            return {
                success: true,
                statusCode: 200,
                data: {
                    valid: true,
                    status,
                    message: "Connection successful. API key is valid.",
                },
            };
        }

        if (status === "needs_revalidation") {
            return {
                success: true,
                statusCode: 200,
                data: {
                    valid: false,
                    status,
                    message: "Connection unstable. Please re-validate this key.",
                },
            };
        }

        return {
            success: true,
            statusCode: 200,
            data: {
                valid: false,
                status,
                message: "Invalid API key. Please check your credentials.",
            },
        };
    }
}
