'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchEntities } from '@/actions/search.action';

interface SearchProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    query: string;
    setQuery: (value: string) => void;
}

interface SearchResult {
    entity_id: string;
    entity_type: string;
    project_id: number | null;
    title: string;
    rank: number;
}

export default function Search({ isOpen, setIsOpen, query, setQuery }: SearchProps) {
    const router = useRouter();
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [recentSearches, setRecentSearches] = useState<string[]>(['Dashboard', 'AI Conversations', 'Diagrams']);
    const requestIdRef = useRef(0);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;

            switch (event.key) {
                case 'Escape':
                    setIsOpen(false);
                    setResults([]);
                    setSearchError(null);
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
            const keyword = query.trim();

            if (!keyword) {
                setResults([]);
                setSelectedIndex(-1);
                setSearchError(null);
                setIsLoading(false);
                return;
            }

            const currentRequestId = ++requestIdRef.current;
            setIsLoading(true);
            setSearchError(null);

            void (async () => {
                try {
                    const response = await searchEntities(keyword, 1, 20);

                    if (currentRequestId !== requestIdRef.current) return;

                    if (response.success && response.data) {
                        setResults(response.data.results);
                    } else {
                        setResults([]);
                        setSearchError(response.message || 'Failed to search');
                    }
                } catch (error) {
                    if (currentRequestId !== requestIdRef.current) return;
                    console.error('Search error:', error);
                    setResults([]);
                    setSearchError('An unexpected error occurred while searching');
                } finally {
                    if (currentRequestId === requestIdRef.current) {
                        setIsLoading(false);
                        setSelectedIndex(-1);
                    }
                }
            })();
        }, 200);

        return () => clearTimeout(searchTimeout);
    }, [query]);

    const pageRouteByEntityId: Record<string, string> = {
        'page-dashboard': '/dashboard',
        'page-ai-conversations': '/aiconversations',
        'page-diagrams': '/diagrams',
        'page-srs-generator': '/srsgenerator',
        'page-wireframe-generator': '/wireframegenerator',
    };

    const pageRouteByTitle: Record<string, string> = {
        dashboard: '/dashboard',
        'ai conversations': '/aiconversations',
        diagrams: '/diagrams',
        'srs generator': '/srsgenerator',
        'wireframe generator': '/wireframegenerator',
    };

    const resolveRoute = (result: SearchResult): string | null => {
        const type = result.entity_type.toLowerCase();

        if (type === 'project' && result.project_id) {
            return `/dashboard/project/${result.project_id}`;
        }

        if (type === 'page') {
            const byEntityId = pageRouteByEntityId[result.entity_id.toLowerCase()];
            if (byEntityId) return byEntityId;

            const byTitle = pageRouteByTitle[result.title.toLowerCase()];
            if (byTitle) return byTitle;
        }

        return null;
    };

    const handleResultClick = (result: SearchResult) => {
        console.log('Selected result:', result);

        // Add to recent searches
        const updatedRecent = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 3);
        setRecentSearches(updatedRecent);

        const route = resolveRoute(result);

        if (route) {
            router.push(route);
        } else {
            console.log('Navigate to result:', result);
        }

        // Close search and reset state
        setIsOpen(false);
        setQuery('');
        setResults([]);
        setSearchError(null);
    };

    const getResultIcon = (type: string) => {
        switch (type.toLowerCase()) {
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

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
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
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
            <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
                            <span className="ml-3 text-gray-600 dark:text-gray-400 font-medium">Searching...</span>
                        </div>
                    ) : searchError ? (
                        <div className="text-center py-12 px-4">
                            <svg className="w-16 h-16 text-red-300 dark:text-red-500/70 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 4h.01M5.071 19h13.858c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-red-700 dark:text-red-300 font-medium mb-1">Search failed</p>
                            <p className="text-sm text-red-600 dark:text-red-400">{searchError}</p>
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
                                        setIsOpen(true);
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
                                    key={`${result.entity_type}-${result.entity_id}-${index}`}
                                    onClick={() => handleResultClick(result)}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group ${index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
                                        }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className={`flex-shrink-0 mt-0.5 p-1.5 rounded-md ${getTypeColor(result.entity_type)} ${index === selectedIndex ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                            {getResultIcon(result.entity_type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <p className={`text-sm font-medium truncate ${index === selectedIndex ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                                                    }`}>
                                                    {result.title}
                                                </p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(result.entity_type)
                                                    } bg-opacity-20 dark:bg-opacity-30 uppercase tracking-wide`}>
                                                    {result.entity_type}
                                                </span>
                                            </div>
                                            {/* <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                                                Entity ID: {result.entity_id}
                                                {typeof result.project_id === 'number' ? ` • Project: ${result.project_id}` : ''}
                                            </p> */}
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                Rank: {result.rank}
                                            </p>
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