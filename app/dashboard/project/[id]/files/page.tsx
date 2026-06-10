import FileManagement from "@/components/file-management/FileManagement";
import NotFound from "@/app/dashboard/project/[id]/_components/NotFound";
import { getProjectById } from "@/actions/project.action";

export default async function FileManagementPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const project = await getProjectById(id);
    
    if (!project) {
        return <NotFound />;
    }
    return (
        <>
            <FileManagement projectId={id} />
        </>
    );
}