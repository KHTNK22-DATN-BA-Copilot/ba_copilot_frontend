'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Footer from '@/components/layout/Footer';

export default function AIConversationsPage() {
    const router = useRouter();
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            
            {/* Main Layout with Sidebar */}
            <div className="flex h-[calc(100vh-4rem)]">
                {/* Sidebar */}
                
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
                                            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 lg:hidden"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                        </button>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                🤖 AI Conversations
                                            </h1>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Chat with AI assistants for business analysis
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        New Conversation
                                    </button>
                                </div>
                            </div>

                            {/* Hero Section */}
                            <div className="col-span-12">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                                    <div className="text-center max-w-3xl mx-auto">
                                        <div className="text-4xl sm:text-5xl mb-4">🤖</div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                            AI-Powered Business Analysis
                                        </h2>
                                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                            Get instant help with requirements gathering, process analysis, and project planning. 
                                            Our AI assistants understand business context and provide actionable insights.
                                        </p>
                                        
                                        {/* Features Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                                            <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors duration-300">
                                                <div className="flex-shrink-0">
                                                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Interactive Conversations</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Real-time chat with specialized AI assistants</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors duration-300">
                                                <div className="flex-shrink-0">
                                                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Context-Aware Responses</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">AI understands your project context</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 sm:col-span-2 lg:col-span-1 transition-colors duration-300">
                                                <div className="flex-shrink-0">
                                                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Conversation History</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Save and revisit previous discussions</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}