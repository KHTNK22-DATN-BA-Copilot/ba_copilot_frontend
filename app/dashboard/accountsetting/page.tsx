'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Headers from '../../../components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AccountSettingPage() {
    const router = useRouter();

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
                                        <button
                                            onClick={() => router.push('/dashboard')}
                                            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                        </button>
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
                                    <div className="text-center py-12">
                                        <div className="text-4xl sm:text-5xl mb-4">⚙️</div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            Account Settings
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            This page is ready for implementation. Add your settings components here.
                                        </p>
                                        <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                            Ready for development
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
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Content area ready for profile settings implementation.
                                    </p>
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
