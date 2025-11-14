import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

import { DIAGRAM_TYPES } from "../../_lib/constants";



export default function RecentDiagramsFilter() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Most Recent");

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleSelect = (filter: string) => {
        setSelectedFilter(filter);
        setIsOpen(false);
        // You can call a parent function here, e.g. onFilterChange(filter)
    };

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-4 relative">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Recent Diagrams
                </h2>

                {/* Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center justify-between w-auto px-4 py-2 text-sm font-medium
                        text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm
                        hover:bg-gray-100 hover:text-gray-900
                        dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700
                        dark:hover:bg-gray-700 dark:hover:text-white
                        transition-colors duration-200"
                    >
                        {selectedFilter}
                        {isOpen ? (
                            <ChevronUp className="w-4 h-4 ml-2" />
                        ) : (
                            <ChevronDown className="w-4 h-4 ml-2" />
                        )}
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10
                            dark:bg-gray-800 dark:border-gray-700">
                            {DIAGRAM_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleSelect(type.name)}
                                    className="flex items-center w-full text-left px-4 py-2 text-sm
                                    text-gray-900 hover:bg-gray-100 hover:text-gray-900
                                    dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    <type.icon className="w-4 h-4 mr-2" />
                                    {type.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
