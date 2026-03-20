"use server";

import { AuthService } from "@/services/AuthService";
import {ActionResponse, RegisterUser} from "@/type/types";
import { cookies } from "next/headers";

export async function SignUp(name: string, email: string, password: string): Promise<ActionResponse<RegisterUser>> {
    const response = await AuthService.signUp(name, email, password);
    if(response.success) {
        return {
            data: response.data,
            statusCode: response.statusCode,
            success: true,
            message: "Success"
        }
    }
    else {
        return {
            success: false,
            message: response.message ? response.message : "Error from backend"
        }
    }
}

export async function verifyEmail(email: string, code: string): Promise<ActionResponse> {
    const data = await AuthService.verifyEmail(email, code);
    return {
        success: true,
        message: "Email verified successfully",
        data,
    };
}

export async function SignIn(email: string, password: string): Promise<ActionResponse> {
    try {
        const tokenResponse = await AuthService.signIn(email, password);

        if(tokenResponse.success === false) {
            return {
                success: false,
                message: "Invalid email or password",
                statusCode: tokenResponse.statusCode,
            }
        }

        (await cookies()).set("access_token", tokenResponse.data.access_token, {
            httpOnly: true,
            expires: new Date(Date.now() + 30 * 60 * 1000),
        });
        (await cookies()).set("refresh_token", tokenResponse.data.refresh_token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        return {
            success: true,
            message: "Login successfully",
            statusCode: tokenResponse.statusCode,
        };
    } catch (error) {
        console.error("Sign-in error:", error);
        throw new Error(
            "An unexpected error occurred during sign-in. Please try again.",
        );
    }
}
