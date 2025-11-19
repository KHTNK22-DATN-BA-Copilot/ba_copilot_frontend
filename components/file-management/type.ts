export type FileItem = {
    id: number;
    name: string;
    size: string;
    uploadedDate: string;
    type: string;
}

export type FolderData = {
    id: number;
    name: string;
    files: FileItem[];
    color: string;
}