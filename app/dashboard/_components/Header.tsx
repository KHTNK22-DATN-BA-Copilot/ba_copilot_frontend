'use client';

import NavBar from './NavBar';
import UserActions from './UserActions';
import MobileMenu from './MobileMenu';

interface HeaderProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export default function Header({ isMenuOpen, setIsMenuOpen, isDarkMode, toggleDarkMode }: HeaderProps) {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-12 items-center h-16">
                    {/* Logo */}
                    <div className="col-span-6 lg:col-span-2">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            🤖 BA Copilot
                        </div>
                    </div>

                    {/* Nav */}
                    <div className="hidden lg:block lg:col-span-8">
                        <NavBar />
                    </div>

                    {/* User actions */}
                    <div className="col-span-6 lg:col-span-2 flex justify-end">
                        <UserActions
                            isDarkMode={isDarkMode}
                            toggleDarkMode={toggleDarkMode}
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                        />
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && <MobileMenu />}
            </div>
        </header>
    );
}
