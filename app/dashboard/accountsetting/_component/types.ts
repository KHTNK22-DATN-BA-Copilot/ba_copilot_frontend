// Types for account settings
export interface UserProfile {
    name: string;
    email: string;
}

export type APIKeyProvider = "openai" | "anthropic" | "gemini";

export type APIKeyStatus = "active" | "needs_revalidation" | "invalid";

export interface ProviderOptionItem {
    value: APIKeyProvider;
    label: string;
    logo: string;
    keyHelpUrl: string;
}

export interface APIKeyRecord {
    id: string;
    provider: APIKeyProvider;
    model: string;
    maskedKey: string;
    rawKey: string;
    status: APIKeyStatus;
    testedAt: string | null;
    updatedAt: string;
}

export type ProviderModelMap = Record<APIKeyProvider, string[]>;

export interface APIKeysPayload {
    keys: APIKeyRecord[];
    providers: ProviderModelMap;
}

export interface APIKeyFormState {
    provider: APIKeyProvider;
    model: string;
    apiKey: string;
}

export type ProfileState = "view" | "edit" | "pending" | "error" | "alert";

export interface StateProps {
    state: ProfileState;
    message?: string;
}

export interface UserProfileProps {
    fullName: string;
    email: string;
    apiKey?: string;
}
