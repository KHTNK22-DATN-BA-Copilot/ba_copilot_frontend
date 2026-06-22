import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
    title: string;
    description: string;
    backHref?: string;
}

export default function PageHeader({
    title,
    description,
    backHref = "/dashboard",
}: PageHeaderProps) {
    return (
        <div className="col-span-1 md:col-span-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
                <div className="flex items-start sm:items-center space-x-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {title}
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
