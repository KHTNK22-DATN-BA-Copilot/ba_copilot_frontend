import { id } from "zod/v4/locales";
import { IFileRepository } from "./IFileRepository ";
import { FileNode, FileItem, FolderData } from "./type";

const mockData: FileNode[] = [
    {
        id: "folder-001",
        name: "SRS document",
        type: "folder",
        children: [
            {
                id: 1,
                name: "functional-requirements.pdf",
                size: "2.4 MB",
                uploadedDate: "Nov 10, 2025",
                fileType: "pdf",
                type: "file",
            },
            {
                id: 2,
                name: "business-requirements.docx",
                size: "1.8 MB",
                uploadedDate: "Nov 12, 2025",
                type: "file",
                fileType: "docx",
            },
        ],
    },
    {
        id: "folder-002",
        name: "Design Docs",
        type: "folder",
        children: [],
    },
    {
        id: "folder-003",
        name: "Project_Plan.docx",
        type: "folder",
        children: [
            {
                id: 4,
                name: "project-overview.pdf",
                size: "3.1 MB",
                uploadedDate: "Nov 5, 2025",
                type: "file",
                fileType: "pdf",
            },
            {
                id: 123,
                name: "Architect",
                type: "folder",
                children: [
                    {
                        id: 10,
                        name: "project-overview.pdf",
                        size: "3.1 MB",
                        uploadedDate: "Nov 5, 2025",
                        type: "file",
                        fileType: "pdf",
                    },
                ],
            },
        ],
    },
    {
        id: "folder-004",
        name: "Meeting_Notes",
        type: "folder",
        children: [
            {
                id: 5,
                name: "kickoff-meeting.txt",
                size: "15 KB",
                uploadedDate: "Nov 15, 2025",
                type: "file",
                fileType: "txt",
            },
        ],
    },
];

export class MockFileRepository implements IFileRepository {
    private folders: FileNode[];

    constructor() {
        this.folders = mockData;
    }
    deleteFile(fileId: number, folderId: number): Promise<void> {
        this.folders.forEach((folder) => {
            if (folder.id === folderId && folder.type === "folder") {
                folder.children = folder.children.filter(
                    (file) => file.id !== fileId
                );
            }
        });
        return Promise.resolve();
    }

    // async getFolders(): Promise<FolderData[]> {
    //     return Promise.resolve(this.folders);
    // }

    async uploadFile(folderId: number, file: File): Promise<FileNode> {
        const newFile: FileNode = {
            id: Date.now(),
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            uploadedDate: new Date().toLocaleDateString(),
            fileType: file.name.split(".").pop() || "file",
            type: "file",
        };
        // this.folders.forEach((folder) => {
        //     if (folder.id === folderId && folder.type === "folder") {
        //         folder.children.push(newFile);
        //     }
        // })

        return Promise.resolve(newFile);
    }
    getTreeStructure(): Promise<FileNode[]> {
        return Promise.resolve(this.folders);
    }
    getTotalFilesCount(): number {
        let count = 0;
        this.folders.forEach((folder) => {
            if (folder.type === "folder") {
                count += folder.children.length;
            }
        });
        return count;
    }
}
