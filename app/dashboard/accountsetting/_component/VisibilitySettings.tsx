"use client";

import { useState } from "react";
import { ChevronDown, Globe, Lock, Users, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type VisibilityOption = "public" | "private" | "team";

interface VisibilityOptionItem {
  value: VisibilityOption;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const visibilityOptions: VisibilityOptionItem[] = [
  {
    value: "public",
    label: "Public",
    description: "Anyone can see this information",
    icon: <Globe className="h-4 w-4" />
  },
  {
    value: "private",
    label: "Private",
    description: "Only you can see this information",
    icon: <Lock className="h-4 w-4" />
  },
  {
    value: "team",
    label: "Team only",
    description: "Only team members can see this information",
    icon: <Users className="h-4 w-4" />
  }
];

export default function VisibilitySettings() {
  const [selectedVisibility, setSelectedVisibility] = useState<VisibilityOption>("private");
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Mock profile URL - replace with actual user profile URL
  const profileUrl = "https://ba-copilot.com/profile/john-doe-123";

  const selectedOption = visibilityOptions.find(option => option.value === selectedVisibility);

  const handleSelect = (value: VisibilityOption) => {
    setSelectedVisibility(value);
    setIsOpen(false);
    // Here you can add API call to save the setting
    console.log("Visibility changed to:", value);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = profileUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      {/* Profile URL - Responsive Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap sm:min-w-[100px]">
          Profile URL:
        </span>
        <div className="flex-1 flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 min-w-0">
          <input
            type="text"
            value={profileUrl}
            readOnly
            className="flex-1 text-sm text-gray-900 dark:text-gray-100 bg-transparent outline-none font-mono min-w-0 truncate"
          />
          <button
            onClick={handleCopyUrl}
            className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors duration-200 flex-shrink-0"
            title="Copy profile URL"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="text-gray-500 dark:text-gray-400">
              {selectedOption?.icon}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {selectedOption?.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {selectedOption?.description}
              </div>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
            {visibilityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${selectedVisibility === option.value
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500'
                  : ''
                  }`}
              >
                <div className={`${selectedVisibility === option.value
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
                  }`}>
                  {option.icon}
                </div>
                <div>
                  <div className={`text-sm font-medium ${selectedVisibility === option.value
                    ? 'text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 dark:text-gray-100'
                    }`}>
                    {option.label}
                  </div>
                  <div className={`text-xs ${selectedVisibility === option.value
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {option.description}
                  </div>
                </div>
                {selectedVisibility === option.value && (
                  <div className="ml-auto">
                    <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Optional: Add save button if you want explicit save action */}
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            // Add API call to save visibility settings
            console.log("Saving visibility settings...");
          }}
          className="cursor-pointer"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}