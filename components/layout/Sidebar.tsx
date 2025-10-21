'use client';

import { useRouter, usePathname, useParams } from 'next/navigation';
import { useState } from 'react';
import { HomeIcon, SRSIcon, WireframeIcon, DiagramIcon, ConversationIcon } from '@/components/icons/project-icons';

interface SidebarProps {
    isDarkMode: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
    projectId?: string;
}

export default function Sidebar({ isDarkMode, isOpen = false, onClose, isMobile = false, projectId }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { id } = useParams()
    const [isCollapsed, setIsCollapsed] = useState(false);

    console.log("params", id)

    // Generate navigation items with dynamic project ID
    const getNavigationItems = () => [
        {
            name: 'Project Overviews',
            href: `/dashboard/project/${id}`,
            icon: <HomeIcon />,
            description: 'Overview & Analytics'
        },
        {
            name: 'AI Conversations',
            href: `/dashboard/project/${id}/aiconversations`,
            icon: <ConversationIcon />,
            description: 'Chat with AI Assistants'
        },
        {
            name: 'Diagrams',
            href: `/dashboard/project/${id}/diagrams`,
            icon: <DiagramIcon />,
            description: 'Create Visual Diagrams'
        },
        {
            name: 'SRS Generator',
            href: `/dashboard/project/${id}/srsgenerator`,
            icon: <SRSIcon />,
            description: 'Generate Requirements'
        },
        {
            name: 'Wireframe Generator',
            href: `/dashboard/project/${id}/wireframegenerator`,
            icon: <WireframeIcon />,
            description: 'Design Wireframes'
        }
    ];

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
                    ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`
                    : 'fixed left-0 top-16 bottom-0 z-40'
                }
                ${isCollapsed ? 'w-16' : 'w-64'} 
                bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
                ${isMobile ? '' : 'transition-all duration-300'} 
                flex flex-col overflow-y-auto
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
                    {getNavigationItems().map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <button
                                key={item.name}
                                onClick={() => handleNavigation(item.href)}
                                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-3'
                                    } py-2.5 rounded-lg text-left transition-all duration-200 group ${isActive
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                            >
                                <div className={`${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                    } transition-colors`}>
                                    {item.icon}
                                </div>

                                {!isCollapsed && (
                                    <div className="ml-3 flex-1">
                                        <div className={`font-medium ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'
                                            }`}>
                                            {item.name}
                                        </div>
                                        <div className={`text-xs ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
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