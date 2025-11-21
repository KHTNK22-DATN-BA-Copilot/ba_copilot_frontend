export default function FileManagementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-8 lg:py-3">
                {/* Page Header */}
                <div className="col-span-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4">
                        <div className="flex items-center space-x-3">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    File Management
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Generate comprehensive SRS documents
                                    automatically
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
