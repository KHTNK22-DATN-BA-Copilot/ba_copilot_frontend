'use client';

import { useRouter, usePathname, useParams } from 'next/navigation';
import { useState } from 'react';
import { SparkleIcon, FolderOpen, Layers, ChevronDown, ChevronRight, Home, Folder, ChevronLeft } from 'lucide-react';

interface SidebarProps {
    isDarkMode?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
    projectId?: string;
}

const cn = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
};

export default function Sidebar({ isDarkMode = false, isOpen = false, onClose, isMobile = false, projectId }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { id } = useParams();
    const [phasesExpanded, setPhasesExpanded] = useState(true);

    // Determine current page based on pathname
    const getCurrentPage = () => {
        if (pathname?.includes('/workflows')) return 'workflow';
        if (pathname?.includes('/files')) return 'files';
        if (pathname?.includes('/phases/planning')) return 'phases-planning';
        if (pathname?.includes('/phases/analysis')) return 'phases-analysis';
        if (pathname?.includes('/phases/design')) return 'phases-design';
        return 'project-details';
    };

    const currentPage = getCurrentPage();

    const menuItems = [
        {
            id: 'project-details',
            label: 'Project Overview',
            description: 'View project details',
            icon: FolderOpen,
            href: `/dashboard/project/${id}`,
        },
        {
            id: 'workflow',
            label: 'Project Workflow',
            description: 'Generate all in one flow',
            icon: SparkleIcon,
            href: `/dashboard/project/${id}/workflows`,
        },
        {
            id: 'files',
            label: 'Files',
            description: 'Manage project files',
            icon: Folder,
            href: `/dashboard/project/${id}/files`,
        },
    ];

    const phaseSubItems = [
        {
            id: 'phases-planning',
            label: 'Planning',
            description: 'Project planning documents',
            href: `/dashboard/project/${id}/phases/planning`,
        },
        {
            id: 'phases-analysis',
            label: 'Analysis',
            description: 'Analysis phase documents',
            href: `/dashboard/project/${id}/phases/analysis`,
        },
        {
            id: 'phases-design',
            label: 'Design',
            description: 'Design phase documents',
            href: `/dashboard/project/${id}/phases/design`,
        },
    ];

    const handleNavigation = (href: string) => {
        router.push(href);
        // Close mobile sidebar when navigating
        if (isMobile && onClose) {
            onClose();
        }
    };

    const handleBackToDashboard = () => {
        router.push('/dashboard');
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
                w-64
                ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
                border-r
                ${isMobile ? '' : 'transition-all duration-300'}
                flex flex-col overflow-y-auto
            `}>
                {/* Sidebar Header */}
                <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                    <button className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </div>

                {/* Back to Dashboard Button */}
                <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                        onClick={handleBackToDashboard}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                            }`}
                    >
                        <Home className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </div>

                {/* Navigation Section */}
                <div className="p-4 flex-1 overflow-y-auto">
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Navigation</div>
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPage === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.href)}
                                    className={cn(
                                        'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors',
                                        isActive
                                            ? isDarkMode
                                                ? 'bg-blue-900/30 text-blue-400'
                                                : 'bg-blue-50 text-blue-600'
                                            : isDarkMode
                                                ? 'hover:bg-gray-800 text-gray-300 hover:text-gray-100'
                                                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                    )}
                                >
                                    <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', isActive ? isDarkMode ? 'text-blue-400' : 'text-blue-600' : isDarkMode ? 'text-gray-500' : 'text-gray-400')} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm">{item.label}</div>
                                        <div className={cn('text-xs', isActive ? isDarkMode ? 'text-blue-400/70' : 'text-blue-600/70' : isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                                            {item.description}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}

                        {/* Phases with Sub-items */}
                        <div>
                            <button
                                onClick={() => setPhasesExpanded(!phasesExpanded)}
                                className={cn(
                                    'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors',
                                    currentPage.startsWith('phases')
                                        ? isDarkMode
                                            ? 'bg-blue-900/30 text-blue-400'
                                            : 'bg-blue-50 text-blue-600'
                                        : isDarkMode
                                            ? 'hover:bg-gray-800 text-gray-300 hover:text-gray-100'
                                            : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                )}
                            >
                                <Layers className={cn('w-5 h-5 mt-0.5 flex-shrink-0', currentPage.startsWith('phases') ? isDarkMode ? 'text-blue-400' : 'text-blue-600' : isDarkMode ? 'text-gray-500' : 'text-gray-400')} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm">Phases</div>
                                    <div className={cn('text-xs', currentPage.startsWith('phases') ? isDarkMode ? 'text-blue-400/70' : 'text-blue-600/70' : isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                                        Generate phase documents
                                    </div>
                                </div>
                                {phasesExpanded ? (
                                    <ChevronDown className="w-4 h-4 mt-1 flex-shrink-0" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 mt-1 flex-shrink-0" />
                                )}
                            </button>

                            {phasesExpanded && (
                                <div className="ml-8 mt-1 space-y-1">
                                    {phaseSubItems.map((subItem) => {
                                        const isActive = currentPage === subItem.id;
                                        return (
                                            <button
                                                key={subItem.id}
                                                onClick={() => handleNavigation(subItem.href)}
                                                className={cn(
                                                    'w-full flex items-start gap-2 p-2 rounded-lg text-left transition-colors',
                                                    isActive
                                                        ? isDarkMode
                                                            ? 'bg-blue-900/30 text-blue-400'
                                                            : 'bg-blue-50 text-blue-600'
                                                        : isDarkMode
                                                            ? 'hover:bg-gray-800 text-gray-300 hover:text-gray-100'
                                                            : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                                )}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm">{subItem.label}</div>
                                                    <div className={cn('text-xs', isActive ? isDarkMode ? 'text-blue-400/70' : 'text-blue-600/70' : isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                                                        {subItem.description}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </nav>
                </div>

                {/* Footer */}
                <div className={`mt-auto p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>BA Copilot Platform</div>
                </div>
            </aside>
        </>
    );
}