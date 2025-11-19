import { FileItem, FolderData, FileNode } from "./type";

export interface IFileRepository {
    //getFolders(): Promise<FolderData[]>;
    uploadFile(folderId: number, file: File): Promise<FileNode>;
    deleteFile(fileId: number, folderId: number): Promise<void>;
    getTreeStructure(): Promise<FileNode[]>;
    getAllFiles?(): Promise<FileNode[]>;
    getTotalFilesCount(): number
}