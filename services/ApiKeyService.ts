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
    ProviderModelResponse,
    ListApiKeysResponse,
    APIKeyStatus,
    ApiKeyResponse,
} from "@/type/types";
import { withAccessToken } from "@/lib/auth-action";
import { cookies } from "next/headers";

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
    public static async getAllProvidersAndModels() {
        return withAccessToken(async () => {
            const accessToken =
                (await cookies()).get("access_token")?.value || "";

            const res = await fetch(
                `${process.env.BACKEND_DOMAIN}/api/v1/ai-credentials/models`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            const responseData: ProviderModelResponse = await res.json();

            const providerModelMap: ProviderModelMap = {} as ProviderModelMap;
            responseData.items.forEach((item) => {
                providerModelMap[item.provider as AIProvider] = item.models;
            });

            return providerModelMap;
        });
    }

    public static async getAllApiKeys() {
        return withAccessToken(async () => {
            const accessToken =
                (await cookies()).get("access_token")?.value || "";

            const res = await fetch(
                `${process.env.BACKEND_DOMAIN}/api/v1/ai-credentials/api-keys`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            const responseData: ListApiKeysResponse = await res.json();

            const keys: APIKeyItem[] = responseData.items.map((item) => ({
                id: item.id as unknown as string,
                provider: item.provider as AIProvider,
                model: item.current_model,
                maskedKey: item.masked_api_key,
                rawKey: "",
                status: item.status as APIKeyStatus,
                testedAt: null,
                updatedAt: new Date().toISOString(),
            }));

            return keys;
        });
    }

    public static async listApiKeys(
        _token: string,
    ): Promise<ServiceResponse<APIKeysResponse>> {
        return {
            success: true,
            statusCode: 200,
            data: {
                keys: [...(await ApiKeyService.getAllApiKeys())].sort((a, b) =>
                    a.provider.localeCompare(b.provider),
                ),
                providers: await ApiKeyService.getAllProvidersAndModels(),
            },
        };
    }

    public static async saveApiKey(
        _token: string,
        payload: SaveAPIKeyPayload,
    ): Promise<ServiceResponse<APIKeyItem>> {

        if (!payload.apiKey?.trim()) {
            return {
                success: false,
                statusCode: 400,
                message: "API key is required.",
            };
        }


        const status = evaluateKeyStatus(payload.apiKey);
        const now = new Date().toISOString();
        const existing = keysDb.find(
            (item) => item.provider === payload.provider,
        );

        

        const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/ai-credentials/api-key`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${_token}`,
            },
            body: JSON.stringify({
                "provider": payload.provider,
                "api_key": payload.apiKey,
            })
        })

        if (!res.ok) {
            return {
                success: false,
                statusCode: res.status,
                message: "Failed to save API key to backend.",
            };
        }

        const data = (await res.json()).data as ApiKeyResponse;

        const keyItem: APIKeyItem = {
            id: data.id as unknown as string,
            provider: data.provider as AIProvider,
            model: data.current_model,
            maskedKey: data.masked_api_key,
            rawKey: "",
            status: data.status as APIKeyStatus,
            testedAt: status === "active" ? now : null,
            updatedAt: data.updated_at,
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

        const providerModels = await ApiKeyService.getAllProvidersAndModels();

        if (!providerModels[provider]?.includes(model)) {
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

        keysDb = keysDb.map((item) =>
            item.provider === provider ? updated : item,
        );

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

        const providerModels = await ApiKeyService.getAllProvidersAndModels();
        if (!providerModels[payload.provider]?.includes(payload.model)) {
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
                    message:
                        "Connection unstable. Please re-validate this key.",
                },
            };
        }

        return {
            success: true,
            statusCode: 200,
            data: {
                valid: false,
                status: status as APIKeyStatus,
                message: "Invalid API key. Please check your credentials.",
            },
        };
    }
}
