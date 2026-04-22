import { UserProfileProps } from "./types";
import { updateUserInfo, deleteAccount } from "@/actions/user.action";
import {
    changeApiModelAction,
    deleteApiKeyAction,
    listApiKeysAction,
    saveApiKeyAction,
    testApiKeyAction,
} from "@/actions/api-key.action";
import {
    APIKeyItem,
    APIKeysResponse,
    APIKeyTestResult,
    AIProvider,
    ChangeModelPayload,
    SaveAPIKeyPayload,
    TestAPIKeyPayload,
} from "@/type/types";

// Validation utilities
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isEqual = (
    obj1: UserProfileProps,
    obj2: UserProfileProps
): boolean => {
    return obj1.fullName === obj2.fullName && obj1.email === obj2.email && obj1.apiKey === obj2.apiKey;
};

// API utilities
export const updateUserProfile = async (
    profile: UserProfileProps
): Promise<{ success: boolean; message?: string }> => {
    try {
        const res = await updateUserInfo({
            name: profile.fullName,
            email: profile.email,
        });

        if (res.status == 200) {
            return { success: true };
        } else {
            throw new Error(res.result || "Failed to update profile");
        }
    } catch (error) {
        console.error("Failed to update profile:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to update profile. Please try again.",
        };
    }
};

export const deleteUserAccount = async (): Promise<{
    success: boolean;
    message?: string;
}> => {
    try {
        const res = await deleteAccount();
        if (res.ok) {
            return { success: true };
        } else {
            const result = await res.json();
            throw new Error(result.message || "Failed to delete account");
        }
    } catch (error) {
        console.error("Failed to delete account:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to delete account. Please try again.",
        };
    }
};

export const providerMeta: Record<
    AIProvider,
    { label: string; logo: string; keyHelpUrl: string }
> = {
    openai: {
        label: "OpenAI",
        logo: "O",
        keyHelpUrl: "https://platform.openai.com/api-keys",
    },
    anthropic: {
        label: "Anthropic",
        logo: "A",
        keyHelpUrl: "https://console.anthropic.com/settings/keys",
    },
    gemini: {
        label: "Google Gemini",
        logo: "G",
        keyHelpUrl: "https://aistudio.google.com/app/apikey",
    },
    openrouter: {
        label: "OpenRouter",
        logo: "OR",
        keyHelpUrl: "https://openrouter.ai/account/api-keys",
    },
};

export const statusMeta: Record<
    APIKeyItem["status"],
    { label: string; className: string }
> = {
    active: {
        label: "active",
        className:
            "border-transparent bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    },
    needs_revalidation: {
        label: "Needs Re-validation",
        className:
            "border-transparent bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    },
    inactive: {
        label: "inactive",
        className:
            "border-transparent bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-200",
    },
};

export const providerList: AIProvider[] = ["openai", "anthropic", "gemini"];

export const getProviderDisplay = (provider: AIProvider): string => {
    return providerMeta[provider].label;
};

export const fetchAPIKeys = async (): Promise<{
    success: boolean;
    data?: APIKeysResponse;
    message?: string;
}> => {
    try {
        const response = await listApiKeysAction();
        if (!response.success) {
            return {
                success: false,
                message: response.message || "Failed to load API keys.",
            };
        }

        return {
            success: true,
            data: response.data,
        };
    } catch {
        return {
            success: false,
            message: "Failed to load API keys.",
        };
    }
};

export const testAPIConnection = async (
    payload: TestAPIKeyPayload,
): Promise<{ success: boolean; data?: APIKeyTestResult; message?: string }> => {
    try {
        const response = await testApiKeyAction(payload);
        if (!response.success) {
            return {
                success: false,
                message: response.message || "Connection test failed.",
            };
        }

        return {
            success: true,
            data: response.data,
        };
    } catch {
        return {
            success: false,
            message: "Connection test failed.",
        };
    }
};

export const saveAPIKey = async (
    payload: SaveAPIKeyPayload,
): Promise<{ success: boolean; data?: APIKeyItem; message?: string }> => {
    try {
        const response = await saveApiKeyAction(payload);
        if (!response.success) {
            return {
                success: false,
                message: response.message || "Failed to save API key.",
            };
        }

        return {
            success: true,
            data: response.data,
        };
    } catch {
        return {
            success: false,
            message: "Failed to save API key.",
        };
    }
};

export const changeAPIModel = async (
    provider: AIProvider,
    payload: ChangeModelPayload,
): Promise<{ success: boolean; data?: APIKeyItem; message?: string }> => {
    try {
        const response = await changeApiModelAction(provider, payload.model);
        if (!response.success) {
            return {
                success: false,
                message: response.message || "Failed to change model.",
            };
        }

        return {
            success: true,
            data: response.data,
        };
    } catch {
        return {
            success: false,
            message: "Failed to change model.",
        };
    }
};

export const deleteAPIKey = async (
    provider: AIProvider,
): Promise<{ success: boolean; message?: string }> => {
    try {
        const response = await deleteApiKeyAction(provider);
        if (!response.success) {
            return {
                success: false,
                message: response.message || "Failed to delete API key.",
            };
        }

        return { success: true };
    } catch {
        return {
            success: false,
            message: "Failed to delete API key.",
        };
    }
};
