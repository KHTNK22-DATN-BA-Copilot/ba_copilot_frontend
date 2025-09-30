'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Headers from '../../../components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '../../../components/layout/Sidebar';
import { Metadata } from "next";

export default function WireframeGeneratorPage() {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const newMode = !prev;
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            if (newMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return newMode;
        });
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <Headers
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
            />
            
            {/* Main Layout with Sidebar */}
            <div className="flex h-[calc(100vh-4rem)]">
                {/* Desktop Sidebar - visible on extra large screens */}
                <div className="hidden xl:block">
                    <Sidebar 
                        isDarkMode={isDarkMode}
                        isOpen={false}
                        isMobile={false}
                    />
                </div>
                
                {/* Mobile/Tablet/iPad Sidebar - overlay on smaller screens */}
                <div className="xl:hidden">
                    <Sidebar 
                        isDarkMode={isDarkMode}
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                        isMobile={true}
                    />
                </div>
                
                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-12 gap-6">
                            {/* Page Header */}
                            <div className="col-span-12">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => router.push('/dashboard')}
                                            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 xl:hidden"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                        </button>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                🎨 Wireframe Generator
                                            </h1>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Create professional wireframes and mockups
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create Wireframe
                                    </button>
                                </div>
                            </div>

                            {/* Hero Section */}
                            <div className="col-span-12">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                                    <div className="text-center max-w-3xl mx-auto">
                                        <div className="text-4xl sm:text-5xl mb-4">🎨</div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                            AI-Powered Wireframe Creation
                                        </h2>
                                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                            Create professional wireframes and mockups for your applications and websites using AI-powered generation and intuitive design tools.
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
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">AI-Powered Creation</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Intelligent wireframe generation</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors duration-300">
                                                <div className="flex-shrink-0">
                                                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Drag & Drop Interface</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Intuitive design tools and editor</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 sm:col-span-2 lg:col-span-1 transition-colors duration-300">
                                                <div className="flex-shrink-0">
                                                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Responsive Design Templates</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Mobile-first design patterns</p>
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
            {/* Footer */}
            <Footer />
        </div>
    );
}