'use client';

import { useParams } from 'next/navigation';
import WorkflowsMain from './_components/WorkflowsMain';

export default function WorkflowsPage() {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <WorkflowsMain projectId={id as string} />
            </div>
        </div>
    );
}
