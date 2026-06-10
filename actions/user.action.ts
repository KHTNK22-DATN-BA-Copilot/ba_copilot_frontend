'use server'

import { UserService } from "@/services/UserService"
import { revalidatePath } from 'next/cache'
import { withAccessToken } from "@/lib/auth-action"
import { cookies } from "next/headers"

export async function getUserInfo() {
    return withAccessToken((access_token) => UserService.getUserInfo(access_token))
}

export async function updateUserInfo(userInfo: { name?: string; email?: string; apiKey?: string; onboard_dashboard?: boolean; onboard_project?: boolean; onboard_file?: boolean; onboard_workflow?: boolean; }) {
    const data = await withAccessToken((access_token) => UserService.updateUserInfo(access_token, userInfo))

    revalidatePath("/dashboard/accountsetting")

    return data;

}

export async function deleteAccount() {
    const response = await withAccessToken((access_token) => UserService.deleteAccount(access_token))

    if (response.status === 200) {
        // Clear the access token and refresh token cookies
        (await cookies()).set('access_token', '', { path: '/', expires: new Date(0) });
        (await cookies()).set('refresh_token', '', { path: '/', expires: new Date(0) });
        return {
            status: 200,
            result: response.result,
        }
    }
    else {
        return {
            status: response.status,
            result: response.result,
        }
    }

}