'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from './_components/PageHeader';
import { CreateNewDiagramSection } from './_components/CreateNewDiagramSection';
import { DiagramDetail } from './_components/DiagramDetail';
import { RecentDiagramsList } from './_components/RecentDiagramsList';
import { useDiagramManager } from './_lib/hooks';

export default function ProjectDiagramsPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const projectId = params.id;
    const isRecentTab = searchParams.get('tabs') === 'recent';

    const {
        diagrams,
        selectedDiagram,
        selectDiagram,
        deselectDiagram,
    } = useDiagramManager();

    return (
        <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <PageHeader projectId={projectId} />

                {/* Tab Navigation - Hidden when diagram is selected */}
                {!selectedDiagram && (
                    <div className="flex w-full flex-col sm:flex-row sm:w-fit p-1 rounded-2xl bg-gray-300 dark:bg-gray-700 justify-between mb-7">
                        <Link
                            href={`/dashboard/project/${projectId}/diagrams`}
                            className={`p-2 rounded-2xl font-semibold text-sm ${!isRecentTab
                                ? 'bg-white dark:bg-gray-800 dark:text-white'
                                : 'dark:text-gray-300'
                                }`}
                        >
                            Create New
                        </Link>
                        <Link
                            href={`/dashboard/project/${projectId}/diagrams?tabs=recent`}
                            className={`p-2 rounded-2xl font-semibold text-sm ${isRecentTab
                                ? 'bg-white dark:bg-gray-800 dark:text-white'
                                : 'dark:text-gray-300'
                                }`}
                        >
                            Recent Diagrams
                        </Link>
                    </div>
                )}

                {/* Content */}
                {selectedDiagram ? (
                    <DiagramDetail
                        diagram={selectedDiagram}
                        onBack={deselectDiagram}
                    />
                ) : isRecentTab ? (
                    <div className="mb-12">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Diagrams</h2>
                        <RecentDiagramsList
                            diagrams={diagrams}
                            onSelectDiagram={selectDiagram}
                        />
                    </div>
                ) : (
                    <CreateNewDiagramSection />
                )}
            </div>
        </main>
    );
}
