import { ReactNode } from "react";

interface SettingSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

export default function SettingSection({
    title,
    description,
    children,
    className = "",
}: SettingSectionProps) {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-300 ${className}`}
        >
            <div className="mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                </h3>
                {description && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {description}
                    </p>
                )}
            </div>
            {children}
        </div>
    );
}
