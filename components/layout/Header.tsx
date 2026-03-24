'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Search from '../../app/dashboard/_components/Search';
import UserActions from '../../app/dashboard/_components/UserActions';

interface HeaderProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export default function Header({ isMenuOpen, setIsMenuOpen, isDarkMode, toggleDarkMode }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const desktopSearchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);
    const desktopInputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    // Check if we're inside a project (to show/hide mobile menu button)
    const isInsideProject = pathname?.startsWith('/dashboard/project/');

    const handleLogoClick = () => {
        if (pathname === '/dashboard') {
            // If on dashboard, just reload
            window.location.reload();
        } else {
            // If on other pages, navigate to dashboard
            router.push('/dashboard');
        }
    };

    // Handle Ctrl+K shortcut for search
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                setIsSearchOpen(true);

                if (window.matchMedia('(min-width: 768px)').matches) {
                    desktopInputRef.current?.focus();
                } else {
                    mobileInputRef.current?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close dropdown when clicking outside search area
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const inDesktopSearch = desktopSearchRef.current?.contains(target);
            const inMobileSearch = mobileSearchRef.current?.contains(target);

            if (!inDesktopSearch && !inMobileSearch) {
                setIsSearchOpen(false);
            }
        };

        if (isSearchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchOpen]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            {/* </header><header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300"> */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Header Row */}
                <div className="flex items-center justify-between h-16">
                    {/* Left side: Mobile menu button + Logo */}
                    <div className="flex items-center">
                        {/* Mobile sidebar toggle button - only visible inside project pages */}
                        {isInsideProject && (
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="xl:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2"
                                aria-label="Toggle sidebar"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        )}

                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={handleLogoClick}
                                className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 cursor-pointer"
                            >
                                <Image
                                    src="/ic_ba_copilot.svg"
                                    alt="BA Copilot Logo"
                                    width={32}
                                    height={32}
                                    className="w-7 h-7 sm:w-8 sm:h-8"
                                />
                                BA Copilot
                            </button>
                        </div>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:block flex-1 max-w-2xl mx-4 lg:mx-8">
                        <div ref={desktopSearchRef} className="relative">
                            <div className="w-full flex items-center px-4 py-2 text-left bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400">
                                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    ref={desktopInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onFocus={() => setIsSearchOpen(true)}
                                    onChange={(event) => {
                                        setSearchQuery(event.target.value);
                                        setIsSearchOpen(true);
                                    }}
                                    placeholder="Search projects, documents, users..."
                                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            desktopInputRef.current?.focus();
                                        }}
                                        className="mr-2 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        aria-label="Clear search"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                                <div className="hidden lg:flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
                                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded">
                                        ⌘
                                    </kbd>
                                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded">
                                        K
                                    </kbd>
                                </div>
                            </div>

                            <Search
                                isOpen={isSearchOpen}
                                setIsOpen={setIsSearchOpen}
                                query={searchQuery}
                                setQuery={setSearchQuery}
                            />
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

                {/* Mobile Search Bar - New Line - Hidden inside projects */}
                {!isInsideProject && (
                    <div ref={mobileSearchRef} className="md:hidden pb-2 relative">
                        <div className="w-full flex items-center px-4 py-2 text-left bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400">
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                ref={mobileInputRef}
                                type="text"
                                value={searchQuery}
                                onFocus={() => setIsSearchOpen(true)}
                                onChange={(event) => {
                                    setSearchQuery(event.target.value);
                                    setIsSearchOpen(true);
                                }}
                                placeholder="Search..."
                                className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        mobileInputRef.current?.focus();
                                    }}
                                    className="ml-2 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    aria-label="Clear search"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <Search
                            isOpen={isSearchOpen}
                            setIsOpen={setIsSearchOpen}
                            query={searchQuery}
                            setQuery={setSearchQuery}
                        />
                    </div>
                )}

            </div>
        </header>
    );
}