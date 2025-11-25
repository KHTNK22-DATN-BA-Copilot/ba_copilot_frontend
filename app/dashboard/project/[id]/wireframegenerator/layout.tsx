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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-2 sm:py-8">
                {/* Page Header */}
                <div className="col-span-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-4">
                        <div className="flex items-center space-x-3">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    Wireframe Generator
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
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
