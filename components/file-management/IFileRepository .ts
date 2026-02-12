import { FileItem, FolderData, FileNode } from "./type";

export interface IFileRepository {
    //getFolders(): Promise<FolderData[]>;
    uploadFile(nodes: FileNode[], folderId: number, file: File, project_id: string): Promise<FileNode[]>;
    deleteFile(nodes: FileNode[] ,fileId: number, folderId: number): FileNode[];
    getTreeStructure(project_id: string): Promise<FileNode[]>;
    getAllFiles?(): Promise<FileNode[]>;
    getTotalFilesCount(nodes: FileNode[]): number
    addFolderRecursive(nodes: FileNode[], parentId: number | null, newFolder: FileNode, project_id: string): Promise<FileNode[]>
    removeFolderRecursive(nodes: FileNode[], targetId: number, project_id: string): Promise<FileNode[]>
    renameFolderRecursive(nodes: FileNode[], targetId: number, newName: string, project_id: string): Promise<FileNode[]>
    exportFile(documentId: number): Promise<void>
}