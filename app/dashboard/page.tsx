'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import MainContent from './_components/MainContent';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';

export default function DashboardPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load theme from localStorage on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Use saved theme, or fall back to system preference
        const shouldUseDarkMode = savedTheme === 'dark' || (savedTheme === null && prefersDark);
        
        setIsDarkMode(shouldUseDarkMode);
        
        // Apply theme to document
        if (shouldUseDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        
        // Save to localStorage
        localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
        
        // Apply to document
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <Header
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
            />
            <div className="flex h-[calc(100vh-4rem)]">
                {/* Sidebar - hidden on mobile, visible on desktop */}
                <div className="hidden lg:block">
                    <Sidebar isDarkMode={isDarkMode} />
                </div>
                
                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <MainContent />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}