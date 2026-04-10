import WorkflowsMain from "./_components/WorkflowsMain";

export default async function WorkflowsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
                <WorkflowsMain projectId={id as string} />
            </div>
        </div>
    );
}
