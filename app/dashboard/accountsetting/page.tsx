import { Metadata } from "next";
import {
    UserProfile,
    DeleteAccountDialog,
    VisibilitySettings,
    PageHeader,
    SettingSection,
} from "./_component";
import { getUserInfo } from "@/actions/user.action";

export const metadata: Metadata = {
    title: "Account Settings - BA Copilot",
    description: "Manage your account preferences and settings on BA Copilot.",
};

export default async function AccountSettingPage() {
    const userProfile = await getUserInfo();

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

                            {/* API Key Settings */}
                            <div className="col-span-1 md:col-span-12 lg:col-span-6">
                                <SettingSection
                                    title="Your Configured API Keys"
                                    description="Assign your own provider keys so each account can run AI features independently."
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
