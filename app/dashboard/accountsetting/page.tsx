import Link from "next/link";
import { Metadata } from "next";
import UserProfile from "./_component/UserProfile";
import DeleteAccountDialog from "./_component/DeleteAccountDialog";
import VisibilitySettings from "./_component/VisibilitySettings";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";

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
            {/* Main Layout */}
            <div className="flex h-[calc(100vh-4rem)]">
                {/* Main Content */}
                <main className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-12 gap-6">
                            {/* Page Header */}
                            <div className="col-span-12">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href="/dashboard"
                                            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                                />
                                            </svg>
                                        </Link>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                ⚙️ Account Settings
                                            </h1>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Manage your account preferences
                                                and settings
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Example Content Sections - Remove when implementing */}
                            <div className="col-span-12 md:col-span-6">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        Profile Settings
                                    </h3>
                                    <UserProfile
                                        name={userProfile.name}
                                        email={userProfile.email}
                                    />
                                </div>
                            </div>
                            {/* Add Visibility Settings Component */}
                            <div className="col-span-12 md:col-span-6">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        Who can see this information?
                                    </h3>
                                    <VisibilitySettings />
                                </div>
                            </div>{" "}
                            <div className="col-span-12">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 relative">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        Delete Personal Account
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-16">
                                        Permanently remove your Personal Account
                                        and all of its contents from the BA
                                        Copilot platform. This action is not
                                        reversible, so please continue with
                                        caution.
                                    </p>
                                    <DeleteAccountDialog
                                        userEmail={userProfile.email}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
