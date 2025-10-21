// Types for account settings
export interface UserProfile {
    name: string;
    email: string;
}

export type VisibilityOption = "public" | "private" | "team";

export interface VisibilityOptionItem {
    value: VisibilityOption;
    label: string;
    description: string;
    icon: React.ReactNode;
}

export type ProfileState = "view" | "edit" | "pending" | "error" | "alert";

export interface StateProps {
    state: ProfileState;
    message?: string;
}

export interface UserProfileProps {
    fullName: string;
    email: string;
}
