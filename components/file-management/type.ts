/** A file leaf node in the tree. */
export interface FileNodeFile {
    id: string | number;
    name: string;
    type: "file";
    size: number | string;
    uploadedDate: string;
    fileType: string;
    file: File;
}

/** A folder node containing children (files or sub-folders). */
export interface FileNodeFolder {
    id: string | number;
    name: string;
    type: "folder";
    children: FileNode[];
    /** When true, this folder is system-generated and cannot be renamed/deleted. */
    systemFileType: boolean;
}

/** Discriminated union representing either a file or a folder in the tree. */
export type FileNode = FileNodeFile | FileNodeFolder;
