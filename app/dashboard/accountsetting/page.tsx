import Link from "next/link";
import { Metadata } from "next";
import UserProfile from "./_component/UserProfile";

export const metadata: Metadata = {
    title: "Account Settings - BA Copilot",
    description: "Manage your account preferences and settings on BA Copilot.",
}

export default function AccountSettingPage() {

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
                                        <Link href="/dashboard" className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                        </Link>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                ⚙️ Account Settings
                                            </h1>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Manage your account preferences and settings
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Area - Ready for Implementation */}
                            <div className="col-span-12">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                                    
                                </div>
                            </div>

                            {/* Example Content Sections - Remove when implementing */}
                            <div className="col-span-12 md:col-span-6">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        Profile Settings
                                    </h3>
                                    <UserProfile />
                                </div>
                            </div>

                            <div className="col-span-12 md:col-span-6">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        Security Settings
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Content area ready for security settings implementation.
                                    </p>
                                </div>
                            </div>

                            <div className="col-span-12">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        Preferences
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Full-width content area ready for preferences implementation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
