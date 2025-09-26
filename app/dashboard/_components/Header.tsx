'use client';

import { useState, useEffect } from 'react';
import Search from './Search';
import UserActions from './UserActions';
import MobileMenu from './MobileMenu';

interface HeaderProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export default function Header({ isMenuOpen, setIsMenuOpen, isDarkMode, toggleDarkMode}: HeaderProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Handle Ctrl+K shortcut for search
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Header Row */}
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <button 
                            onClick={() => window.location.reload()}
                            className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 cursor-pointer"
                        >
                            🤖 BA Copilot
                        </button>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:block flex-1 max-w-2xl mx-4 lg:mx-8">
                        <div className="relative">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="w-full flex items-center px-4 py-2 text-left bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 group"
                            >
                                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="flex-1 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 text-sm">
                                    Search projects, documents, users...
                                </span>
                                <div className="hidden lg:flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
                                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded">
                                        ⌘
                                    </kbd>
                                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded">
                                        K
                                    </kbd>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* User actions */}
                    <div className="flex items-center space-x-2">
                        <UserActions
                            isDarkMode={isDarkMode}
                            toggleDarkMode={toggleDarkMode}
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                        />
                    </div>
                </div>

                {/* Mobile Search Bar - New Line */}
                <div className="md:hidden pb-3">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="w-full flex items-center px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 group"
                    >
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="flex-1 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                            Search projects, documents, users...
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded">
                                ⌘K
                            </kbd>
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && <MobileMenu />}
            </div>

            {/* Search Modal */}
            <Search isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
        </header>
    );
}
