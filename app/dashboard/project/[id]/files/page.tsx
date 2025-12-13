import FileManagement from "@/components/file-management/FileManagement";

export default async function FileManagementPage({params}: {params: {id: string}}) {
    const {id} = await params;
    return (
        <>
            <FileManagement projectId={id} />
        </>
    );
}