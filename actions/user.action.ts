'use server'

import { UserService } from "@/services/UserService"
import { revalidatePath } from 'next/cache'
import { withAccessToken } from "@/lib/auth-action"

export async function getUserInfo() {
    return withAccessToken((access_token) => UserService.getUserInfo(access_token))
}

export async function updateUserInfo(userInfo: { name?: string; email?: string, apiKey?: string }) {
    const data = await withAccessToken((access_token) => UserService.updateUserInfo(access_token, userInfo))

    revalidatePath("/dashboard/accountsetting")

    return data;

}

export async function deleteAccount() {
    const response = await withAccessToken((access_token) => UserService.deleteAccount(access_token))

    if (response.status === 200) {
        // Clear the access token and refresh token cookies
        const res = new Response(response.result, { status: 200 })
        res.headers.set('Set-Cookie', 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax')
        res.headers.set('Set-Cookie', 'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax')
        return res
    }
    else {
        return new Response(response.result, { status: response.status })
    }

}