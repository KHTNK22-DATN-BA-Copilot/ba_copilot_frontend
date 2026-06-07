import { UserProfile } from "@/type/types";
import "server-only";

export class UserService {
    public static async getUserInfo(token: string) {
        const res = await fetch(
            `${process.env.BACKEND_DOMAIN}/api/v1/user/me`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const data: UserProfile = await res.json();
        return data;
    }

    public static async updateUserInfo(
        token: string,
        userInfo: Partial<UserProfile>,
    ) {
        const res = await fetch(
            `${process.env.BACKEND_DOMAIN}/api/v1/user/me`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userInfo),
            },
        );
        const result = await res.json();
        if (res.ok) {
            return {
                result: JSON.stringify(result),
                status: res.status,
            };
        } else {
            return {
                result: JSON.stringify({
                    message: result.message || "Failed to update profile",
                }),
                status: res.status,
            };
        }
    }

    public static async deleteAccount(token: string) {
        const res = await fetch(
            `${process.env.BACKEND_DOMAIN}/api/v1/user/me`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        const result = await res.json();
        if (res.status == 200) {
            return {
                result: result.message || "Account deleted successfully",
                status: res.status,
            };
        } else {
            return {
                result: JSON.stringify({
                    message: result.message || "Failed to delete account",
                }),
                status: res.status,
            };
        }
    }
}
