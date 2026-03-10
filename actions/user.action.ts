'use server'

import { cookies } from "next/headers"
import { UserService } from "@/services/UserService"
import { revalidatePath } from 'next/cache'

export async function getUserInfo() {
    const access_token = (await cookies()).get("access_token")?.value || ""
    const userInfo = await UserService.getUserInfo(access_token)
    return userInfo
}

export async function updateUserInfo(userInfo: { name?: string; email?: string }) {
    const access_token = (await cookies()).get("access_token")?.value || ""
    const data = await UserService.updateUserInfo(access_token, userInfo)

    revalidatePath("/dashboard/accountsetting")

    return data;

}

export async function deleteAccount() {
    const access_token = (await cookies()).get("access_token")?.value || ""
    const response = await UserService.deleteAccount(access_token)

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