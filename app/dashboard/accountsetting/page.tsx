import { Metadata } from "next";
import { cookies } from "next/headers";
import {
    UserProfile,
    DeleteAccountDialog,
    VisibilitySettings,
    PageHeader,
    SettingSection,
} from "./_component";

export const metadata: Metadata = {
    title: "Account Settings - BA Copilot",
    description: "Manage your account preferences and settings on BA Copilot.",
};

export default async function AccountSettingPage() {
    const access_token = (await cookies()).get("access_token")?.value || "";
    const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/user/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
    });
    const userProfile = await res.json();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="flex min-h-screen">
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
                            {/* Page Header */}
                            <PageHeader
                                title="Account Settings"
                                description="Manage your account preferences and settings"
                            />

                            {/* Profile Settings */}
                            <div className="col-span-1 md:col-span-12 lg:col-span-6">
                                <SettingSection title="Profile Settings">
                                    <UserProfile
                                        name={userProfile.name}
                                        email={userProfile.email}
                                    />
                                </SettingSection>
                            </div>

                            {/* Visibility Settings */}
                            <div className="col-span-1 md:col-span-12 lg:col-span-6">
                                <SettingSection
                                    title="Who can see this information?"
                                    description="Control who can see your profile information and activity."
                                >
                                    <VisibilitySettings />
                                </SettingSection>
                            </div>

                            {/* Delete Account Section */}
                            <div className="col-span-1 md:col-span-12">
                                <DeleteAccountDialog
                                    userEmail={userProfile.email}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
