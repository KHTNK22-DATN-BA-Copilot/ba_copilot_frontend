import { FileItem, FolderData, FileNode } from "./type";

export interface IFileRepository {
    //getFolders(): Promise<FolderData[]>;
    uploadFile(nodes: FileNode[], folderId: number, file: File): FileNode[];
    deleteFile(nodes: FileNode[] ,fileId: number, folderId: number): FileNode[];
    getTreeStructure(): Promise<FileNode[]>;
    getAllFiles?(): Promise<FileNode[]>;
    getTotalFilesCount(nodes: FileNode[]): number
    addFolderRecursive(nodes: FileNode[], parentId: number, newFolder: FileNode): FileNode[]
    removeFolderRecursive(nodes: FileNode[], targetId: number): FileNode[]
}