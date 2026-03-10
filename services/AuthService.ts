import { TokenResponse, RegisterUser, ServiceResponse } from "@/type/types";

export class AuthService {
    public static async signUp(name: string, email: string, password: string): Promise<ServiceResponse<RegisterUser>> {
        const response = await fetch(
            `${process.env.BACKEND_DOMAIN}/api/v1/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, passwordhash: password }),
            },
        );



        if(response.ok) {
            const data: RegisterUser = await response.json();
            return {
                data: data,
                statusCode: response.status,
                success: true,
            }
        }
        const data = await response.json();
        return {
            success: false,
            data: null,
            statusCode: response.status,
            message: data.message
        }

    }

    public static async verifyEmail(email: string, code: string) {
        try {
            const respond = await fetch(
                `${
                    process.env.NEXT_PUBLIC_BACKEND_DOMAIN
                }/api/v1/auth/verify-email?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            const data = await respond.json();
            return data;
        } catch (error) {
            console.error("Email verification error:", error);
            throw new Error(
                "An unexpected error occurred while verifying the email. Please try again.",
            );
        }
    }

    public static async signIn(email: string, password: string): Promise<ServiceResponse<TokenResponse>> {
        try {
            const response = await fetch(
                `${process.env.BACKEND_DOMAIN}/api/v1/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        email: email,
                        password: password,
                    }),
                },
            );

            if(response.status === 401) {
                return {
                    success: false,
                    data: null,
                    statusCode: 401,
                }
            }

            const data: TokenResponse = await response.json();
            return {
                success: true,
                data: data,
                statusCode: response.status,
            }
        } catch (error) {
            console.error("Sign-in error:", error);
            throw new Error(
                "An unexpected error occurred during sign-in. Please try again.",
            );
        }
    }
}
