import { FileNode } from "./type";

export interface IFileRepository {
    getTreeStructure(projectId: string): Promise<FileNode[]>;
    uploadFile(nodes: FileNode[], folderId: number, file: File, projectId: string): Promise<FileNode[]>;
    deleteFile(nodes: FileNode[], fileId: number, folderId: number): FileNode[];
    getTotalFilesCount(nodes: FileNode[]): number;
    addFolderRecursive(nodes: FileNode[], parentId: number | null, newFolder: FileNode, projectId: string): Promise<FileNode[]>;
    removeFolderRecursive(nodes: FileNode[], targetId: number, projectId: string): Promise<FileNode[]>;
    renameFolderRecursive(nodes: FileNode[], targetId: number, newName: string, projectId: string): Promise<FileNode[]>;
    exportFile(documentId: number | string): Promise<void>;
}