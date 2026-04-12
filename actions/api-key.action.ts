'use server'

import { revalidatePath } from "next/cache";
import {
    AIProvider,
    APIKeysResponse,
    APIKeyItem,
    APIKeyTestResult,
    SaveAPIKeyPayload,
    ServiceResponse,
    TestAPIKeyPayload,
} from "@/type/types";
import { ApiKeyService } from "@/services/ApiKeyService";
import { withAccessToken } from "@/lib/auth-action";

export async function listApiKeysAction(): Promise<ServiceResponse<APIKeysResponse>> {
    return withAccessToken((accessToken) => ApiKeyService.listApiKeys(accessToken));
}

export async function testApiKeyAction(
    payload: TestAPIKeyPayload,
): Promise<ServiceResponse<APIKeyTestResult>> {
    return withAccessToken((accessToken) => ApiKeyService.testApiKey(accessToken, payload));
}

export async function saveApiKeyAction(
    payload: SaveAPIKeyPayload,
): Promise<ServiceResponse<APIKeyItem>> {
    const result = await withAccessToken((accessToken) => ApiKeyService.saveApiKey(accessToken, payload));

    if (result.success) {
        revalidatePath("/dashboard/accountsetting");
    }

    return result;
}

export async function changeApiModelAction(
    provider: AIProvider,
    model: string,
): Promise<ServiceResponse<APIKeyItem>> {
    const result = await withAccessToken((accessToken) => ApiKeyService.changeModel(accessToken, provider, model));

    if (result.success) {
        revalidatePath("/dashboard/accountsetting");
    }

    return result;
}

export async function deleteApiKeyAction(
    provider: AIProvider,
): Promise<ServiceResponse<null>> {
    const result = await withAccessToken((accessToken) => ApiKeyService.deleteApiKey(accessToken, provider));

    if (result.success) {
        revalidatePath("/dashboard/accountsetting");
    }

    return result;
}
