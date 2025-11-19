import { FileItem, FolderData } from "./type";

export interface IFileRepository {
    getFolders(): Promise<FolderData[]>;
    uploadFile(folderId: number, file: File): Promise<FileItem>;
    deleteFile(fileId: number, folderId: number): Promise<void>;
}