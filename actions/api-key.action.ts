'use server'

import { cookies } from "next/headers";
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

export async function listApiKeysAction(): Promise<ServiceResponse<APIKeysResponse>> {
    const accessToken = (await cookies()).get("access_token")?.value || "";
    return ApiKeyService.listApiKeys(accessToken);
}

export async function testApiKeyAction(
    payload: TestAPIKeyPayload,
): Promise<ServiceResponse<APIKeyTestResult>> {
    const accessToken = (await cookies()).get("access_token")?.value || "";
    return ApiKeyService.testApiKey(accessToken, payload);
}

export async function saveApiKeyAction(
    payload: SaveAPIKeyPayload,
): Promise<ServiceResponse<APIKeyItem>> {
    const accessToken = (await cookies()).get("access_token")?.value || "";
    const result = await ApiKeyService.saveApiKey(accessToken, payload);

    if (result.success) {
        revalidatePath("/dashboard/accountsetting");
    }

    return result;
}

export async function changeApiModelAction(
    provider: AIProvider,
    model: string,
): Promise<ServiceResponse<APIKeyItem>> {
    const accessToken = (await cookies()).get("access_token")?.value || "";
    const result = await ApiKeyService.changeModel(accessToken, provider, model);

    if (result.success) {
        revalidatePath("/dashboard/accountsetting");
    }

    return result;
}

export async function deleteApiKeyAction(
    provider: AIProvider,
): Promise<ServiceResponse<null>> {
    const accessToken = (await cookies()).get("access_token")?.value || "";
    const result = await ApiKeyService.deleteApiKey(accessToken, provider);

    if (result.success) {
        revalidatePath("/dashboard/accountsetting");
    }

    return result;
}
