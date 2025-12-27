import WorkflowsMain from './_components/WorkflowsMain';
import { getProjectById } from '@/lib/projects';

export default async function WorkflowsPage({ params }: { params: { id: string } }) {
    const {id} = await params;
    const project = await getProjectById(id);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <WorkflowsMain projectId={Number(id)} projectName={project.name} />
            </div>
        </div>
    );
}
