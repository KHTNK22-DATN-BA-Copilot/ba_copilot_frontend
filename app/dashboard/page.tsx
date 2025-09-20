'use client';

import { useState } from 'react';
import Header from './_components/Header';
import MainContent from './_components/MainContent';
import Footer from './_components/Footer';

export default function DashboardPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <MainContent />
            </main>
            <Footer />
        </div>
    );
}