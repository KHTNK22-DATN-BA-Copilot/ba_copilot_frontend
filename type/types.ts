export type ErrorType = {
    message: string;
    errorCode: number;
};

export type TokenResponse = {
    access_token: string;
    refresh_token: string;
};

export type UserProfile = {
    name: string;
    email: string;
    apiKey?: string;
};

export type RegisterUser = {
    user: {
        name: string;
        email: string;
        id: number;
        email_verified: boolean;
        email_verification_token: string;
        email_verification_expiration: string;
        created_at: string;
        updated_at: string;
    };
    message: string;
};

export type ActionResponse<T = any> = {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
    statusCode?: number;
};

export type ServiceResponse<T = any> = {
    success: true;
    data: T;
    statusCode: number;
} | {
    success: false;
    statusCode: number;
    message: string
}

export type AIProvider = "openai" | "anthropic" | "gemini";

export type APIKeyStatus = "active" | "needs_revalidation" | "invalid";

export type ProviderModelMap = Record<AIProvider, string[]>;

export type APIKeyItem = {
    id: string;
    provider: AIProvider;
    model: string;
    maskedKey: string;
    rawKey: string;
    status: APIKeyStatus;
    testedAt: string | null;
    updatedAt: string;
};

export type SaveAPIKeyPayload = {
    provider: AIProvider;
    model: string;
    apiKey: string;
    forceReplace?: boolean;
};

export type ChangeModelPayload = {
    model: string;
};

export type TestAPIKeyPayload = {
    provider: AIProvider;
    model: string;
    apiKey: string;
};

export type APIKeyTestResult = {
    valid: boolean;
    status: APIKeyStatus;
    message: string;
};

export type APIKeysResponse = {
    keys: APIKeyItem[];
    providers: ProviderModelMap;
};
