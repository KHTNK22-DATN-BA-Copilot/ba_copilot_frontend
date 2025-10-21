import { UserProfileProps } from "./types";

// Validation utilities
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isEqual = (
    obj1: UserProfileProps,
    obj2: UserProfileProps
): boolean => {
    return obj1.fullName === obj2.fullName && obj1.email === obj2.email;
};

// API utilities
export const updateUserProfile = async (
    profile: UserProfileProps
): Promise<{ success: boolean; message?: string }> => {
    try {
        const res = await fetch("/api/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profile),
        });
        const result = await res.json();

        if (res.ok) {
            return { success: true };
        } else {
            throw new Error(result.message || "Failed to update profile");
        }
    } catch (error) {
        console.error("Failed to update profile:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to update profile. Please try again.",
        };
    }
};

export const deleteUserAccount = async (): Promise<{
    success: boolean;
    message?: string;
}> => {
    try {
        const res = await fetch("/api/me", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            return { success: true };
        } else {
            const result = await res.json();
            throw new Error(result.message || "Failed to delete account");
        }
    } catch (error) {
        console.error("Failed to delete account:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to delete account. Please try again.",
        };
    }
};
