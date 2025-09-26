'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SearchProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

interface SearchResult {
    id: string;
    title: string;
    type: 'project' | 'user' | 'document' | 'page';
    description?: string;
    lastModified?: string;
    route?: string;
}

// Mock data for demonstration - In real app, this would come from API/context
const mockSearchData: SearchResult[] = [
    // BA Copilot Pages
    {
        id: 'page-dashboard',
        title: 'Dashboard',
        type: 'page',
        description: 'Main dashboard with project overview and analytics',
        lastModified: 'Always available',
        route: '/dashboard'
    },
    {
        id: 'page-ai-conversations',
        title: 'AI Conversations',
        type: 'page',
        description: 'Chat with AI assistants for business analysis tasks',
        lastModified: 'Ready to use',
        route: '/aiconversations'
    },
    {
        id: 'page-diagrams',
        title: 'Diagrams',
        type: 'page',
        description: 'Create flowcharts, process diagrams, and system architecture',
        lastModified: 'Design tools',
        route: '/diagrams'
    },
    {
        id: 'page-srs-generator',
        title: 'SRS Generator',
        type: 'page',
        description: 'Generate comprehensive Software Requirements Specification documents',
        lastModified: 'AI-powered',
        route: '/srsgenerator'
    },
    {
        id: 'page-wireframe-generator',
        title: 'Wireframe Generator',
        type: 'page',
        description: 'Create professional wireframes and mockups with AI assistance',
        lastModified: 'Design tools',
        route: '/wireframegenerator'
    },
    // Sample Projects
    {
        id: '1',
        title: 'BA Copilot Dashboard',
        type: 'project',
        description: 'Main dashboard for BA Copilot application',
        lastModified: '2 hours ago'
    },
    {
        id: '2',
        title: 'Authentication System',
        type: 'project',
        description: 'User login and registration system',
        lastModified: '1 day ago'
    },
    {
        id: '3',
        title: 'Project Management Tool',
        type: 'project',
        description: 'Project tracking and management tools',
        lastModified: '3 days ago'
    },
    {
        id: '4',
        title: 'E-commerce Platform',
        type: 'project',
        description: 'Online shopping and payment system',
        lastModified: '5 days ago'
    },
    {
        id: '5',
        title: 'Mobile Banking App',
        type: 'project',
        description: 'Secure mobile banking application',
        lastModified: '1 week ago'
    },
    // Sample Documents
    {
        id: '6',
        title: 'User Settings',
        type: 'document',
        description: 'Configuration and preferences',
        lastModified: '1 week ago'
    },
    {
        id: '7',
        title: 'API Documentation',
        type: 'document',
        description: 'Backend API endpoints and usage',
        lastModified: '2 weeks ago'
    },
    {
        id: '8',
        title: 'Design System Guide',
        type: 'document',
        description: 'UI components and design guidelines',
        lastModified: '3 weeks ago'
    },
    // Sample Users
    {
        id: '9',
        title: 'Admin User',
        type: 'user',
        description: 'System administrator account',
        lastModified: 'Online now'
    },
    {
        id: '10',
        title: 'Project Manager',
        type: 'user',
        description: 'Project management team lead',
        lastModified: '5 minutes ago'
    }
];

export default function Search({ isOpen, setIsOpen }: SearchProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [recentSearches, setRecentSearches] = useState<string[]>(['Dashboard', 'AI Conversations', 'Diagrams']);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Focus input when search opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Handle click outside to close search
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, setIsOpen]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;

            switch (event.key) {
                case 'Escape':
                    setIsOpen(false);
                    setQuery('');
                    setResults([]);
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    setSelectedIndex(prev => prev < results.length - 1 ? prev + 1 : prev);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (selectedIndex >= 0 && results[selectedIndex]) {
                        handleResultClick(results[selectedIndex]);
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, setIsOpen]);

    // Search function with debounce
    useEffect(() => {
        const searchTimeout = setTimeout(() => {
            if (query.trim()) {
                setIsLoading(true);
                // Simulate API call delay
                setTimeout(() => {
                    const filteredResults = mockSearchData.filter(item =>
                        item.title.toLowerCase().includes(query.toLowerCase()) ||
                        item.description?.toLowerCase().includes(query.toLowerCase())
                    );
                    setResults(filteredResults);
                    setSelectedIndex(-1);
                    setIsLoading(false);
                }, 300);
            } else {
                setResults([]);
                setSelectedIndex(-1);
            }
        }, 200);

        return () => clearTimeout(searchTimeout);
    }, [query]);

    const handleResultClick = (result: SearchResult) => {
        console.log('Selected result:', result);

        // Add to recent searches
        const updatedRecent = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 3);
        setRecentSearches(updatedRecent);

        // Navigate to the page if it has a route
        if (result.route) {
            router.push(result.route);
        } else {
            // For projects, documents, users without specific routes
            console.log('Navigate to result:', result);
            // You can implement specific navigation logic here
            // For example: router.push(`/dashboard/project/${result.id}`);
        }

        // Close search and reset state
        setIsOpen(false);
        setQuery('');
        setResults([]);
    };

    const getResultIcon = (type: SearchResult['type']) => {
        switch (type) {
            case 'page':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
            case 'project':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                );
            case 'user':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            case 'document':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getTypeColor = (type: SearchResult['type']) => {
        switch (type) {
            case 'page':
                return 'text-indigo-600 dark:text-indigo-400';
            case 'project':
                return 'text-blue-600 dark:text-blue-400';
            case 'user':
                return 'text-green-600 dark:text-green-400';
            case 'document':
                return 'text-purple-600 dark:text-purple-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    // Only show modal when open
    if (!isOpen) return null;

    return (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-none flex items-start justify-center pt-16 sm:pt-20 px-4">
                <div
                    ref={searchContainerRef}
                    className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
                >
                    {/* Enhanced Search Input */}
                    <div className="flex items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search projects, documents, users..."
                            className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none text-lg font-medium"
                        />
                        {query && (
                            <button
                                onClick={() => {
                                    setQuery('');
                                    setResults([]);
                                    searchInputRef.current?.focus();
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Search Results */}
                    <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
                                <span className="ml-3 text-gray-600 dark:text-gray-400 font-medium">Searching...</span>
                            </div>
                        ) : query && results.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No results found for "{query}"</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">Try adjusting your search terms or check spelling</p>
                            </div>
                        ) : !query && recentSearches.length > 0 ? (
                            <div className="py-2">
                                <div className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                                    Recent Searches
                                </div>
                                {recentSearches.map((search, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setQuery(search);
                                            searchInputRef.current?.focus();
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">{search}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : results.length > 0 ? (
                            <div className="py-2">
                                {results.map((result, index) => (
                                    <button
                                        key={result.id}
                                        onClick={() => handleResultClick(result)}
                                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group ${
                                            index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
                                        }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`flex-shrink-0 mt-0.5 p-1.5 rounded-md ${getTypeColor(result.type)} ${index === selectedIndex ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                                {getResultIcon(result.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <p className={`text-sm font-medium truncate ${
                                                        index === selectedIndex ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                                                    }`}>
                                                        {result.title}
                                                    </p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                        getTypeColor(result.type)
                                                    } bg-opacity-20 dark:bg-opacity-30 uppercase tracking-wide`}>
                                                        {result.type}
                                                    </span>
                                                </div>
                                                {result.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                                                        {result.description}
                                                    </p>
                                                )}
                                                {result.lastModified && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                                        {result.lastModified}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Start typing to search</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">Find projects, documents, and users across your workspace</p>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Search Tips */}
                    <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center space-x-1">
                                    <span>↑↓</span>
                                    <span>Navigate</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <span>↵</span>
                                    <span>Select</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <span>Esc</span>
                                    <span>Close</span>
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <kbd className="px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                                    ⌘
                                </kbd>
                                <span className="text-gray-400">+</span>
                                <kbd className="px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                                    K
                                </kbd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}