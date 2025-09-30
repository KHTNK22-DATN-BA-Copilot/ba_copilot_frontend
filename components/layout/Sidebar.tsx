'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
    isDarkMode: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
}

const navigationItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2v0z" />
            </svg>
        ),
        description: 'Overview & Analytics'
    },
    {
        name: 'AI Conversations',
        href: '/dashboard/aiconversations',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
        description: 'Chat with AI Assistants'
    },
    {
        name: 'Diagrams',

        href: '/dashboard/diagrams',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        description: 'Create Visual Diagrams'
    },
    {
        name: 'SRS Generator',
        href: '/srsgenerator',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        description: 'Generate Requirements'
    },
    {
        name: 'Wireframe Generator',
        href: '/wireframegenerator',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
        ),
        description: 'Design Wireframes'
    }
];

export default function Sidebar({ isDarkMode, isOpen = false, onClose, isMobile = false }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    const handleNavigation = (href: string) => {
        router.push(href);
        // Close mobile sidebar when navigating
        if (isMobile && onClose) {
            onClose();
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isMobile && isOpen && (
                <div 
                    className="fixed inset-0 backdrop-brightness-50 z-40 xl:hidden"
                    onClick={onClose}
                />
            )}
            
            {/* Sidebar */}
            <aside className={`
                ${isMobile 
                    ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
                        isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`
                    : 'relative'
                }
                ${isCollapsed ? 'w-16' : 'w-64'} 
                bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
                ${isMobile ? '' : 'transition-all duration-300'} 
                flex flex-col h-full
            `}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                {!isCollapsed && (
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Navigation
                    </h2>
                )}
                
                <div className="flex items-center space-x-1">
                    {/* Mobile close button */}
                    {isMobile && (
                        <button
                            onClick={onClose}
                            className="xl:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Close sidebar"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    
                    {/* Desktop collapse button */}
                    {!isMobile && (
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-2">
                {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <button
                            key={item.name}
                            onClick={() => handleNavigation(item.href)}
                            className={`w-full flex items-center ${
                                isCollapsed ? 'justify-center px-3' : 'px-3'
                            } py-2.5 rounded-lg text-left transition-all duration-200 group ${
                                isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                        >
                            <div className={`${
                                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                            } transition-colors`}>
                                {item.icon}
                            </div>
                            
                            {!isCollapsed && (
                                <div className="ml-3 flex-1">
                                    <div className={`font-medium ${
                                        isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'
                                    }`}>
                                        {item.name}
                                    </div>
                                    <div className={`text-xs ${
                                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                                    } mt-0.5`}>
                                        {item.description}
                                    </div>
                                </div>
                            )}

                            {isActive && (
                                <div className="w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-full ml-auto"></div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Sidebar Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                {!isCollapsed && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        BA Copilot Platform
                    </div>
                )}
            </div>
        </aside>
        </>
    );
}

