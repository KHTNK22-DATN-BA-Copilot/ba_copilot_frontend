import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserActionsProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export default function UserActions({ isDarkMode, toggleDarkMode, isMenuOpen, setIsMenuOpen}: UserActionsProps) {
  const router = useRouter();
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      
      if (token) {
        // Call backend logout API
        await fetch('http://localhost:8000/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear all authentication data from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
      localStorage.removeItem('theme'); // Clear theme preference
      
      // Clear sessionStorage as well
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('theme'); // Clear theme preference
      
      // Reset theme to light mode
      document.documentElement.classList.remove('dark');
      
      // Close dropdown
      setIsAvatarDropdownOpen(false);
      
      // Navigate to login page
      router.push('/login');
    }
  };

  return (
    <div className="flex items-center space-x-1">

      {/* Dark mode toggle */}
      <button onClick={toggleDarkMode} className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
        {isDarkMode ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Add */}
      <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Avatar with Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
          className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          🦀
        </button>
        
        {/* Dropdown Menu */}
        {isAvatarDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
            <div className="py-1">
              <button
                onClick={() => {
                  setIsAvatarDropdownOpen(false);
                  router.push('/accountsetting');
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account Settings
              </button>
              
              <hr className="border-gray-200 dark:border-gray-700" />
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
        
        {/* Click outside to close dropdown */}
        {isAvatarDropdownOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsAvatarDropdownOpen(false)}
          ></div>
        )}
      </div>

      {/* Mobile menu button */}
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-400 hover:text-gray-600">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}