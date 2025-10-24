import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function WireframeGeneratorLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="col-span-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center space-x-3">
                            <Link
                                href={`/dashboard/project/${id}`}
                                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 xl:hidden"
                            >
                                <ArrowLeft />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    Wireframe Generator
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Create professional wireframes and mockups
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {children}
            </div>
        </main>
    );
}
