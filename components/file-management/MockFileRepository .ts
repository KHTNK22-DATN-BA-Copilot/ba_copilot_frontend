import { IFileRepository } from "./IFileRepository ";
import { FolderData, FileItem } from "./type";

const mockData: FolderData[] = [
    {
        id: 1,
        name: "Requirements",
        color: "blue",
        files: [
            {
                id: 1,
                name: "functional-requirements.pdf",
                size: "2.4 MB",
                uploadedDate: "Nov 10, 2025",
                type: "pdf",
            },
            {
                id: 2,
                name: "business-requirements.docx",
                size: "1.8 MB",
                uploadedDate: "Nov 12, 2025",
                type: "docx",
            },
        ],
    },
    {
        id: 2,
        name: "Designs",
        color: "purple",
        files: [
            {
                id: 3,
                name: "ui-mockups.fig",
                size: "5.2 MB",
                uploadedDate: "Nov 8, 2025",
                type: "fig",
            },
        ],
    },
    {
        id: 3,
        name: "Documentation",
        color: "green",
        files: [
            {
                id: 4,
                name: "project-overview.pdf",
                size: "3.1 MB",
                uploadedDate: "Nov 5, 2025",
                type: "pdf",
            },
            {
                id: 5,
                name: "technical-specs.md",
                size: "156 KB",
                uploadedDate: "Nov 13, 2025",
                type: "md",
            },
        ],
    },
    {
        id: 4,
        name: "Research",
        color: "orange",
        files: [],
    },
];

export class MockFileRepository implements IFileRepository {
    private folders: FolderData[]

    constructor() {
        this.folders = mockData;
    }

    async getFolders(): Promise<FolderData[]> {
        return Promise.resolve(this.folders);
    }

    async uploadFile(folderId: number, file: File): Promise<FileItem> {
        const newFile: FileItem = {
            id: Date.now(),
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            uploadedDate: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            type: file.name.split(".").pop() || "file",
        };
        this.folders = this.folders.map((folder) =>
            folder.id === folderId
                ? { ...folder, files: [...folder.files, newFile] }
                : folder
        );
        return newFile;
    }
    async deleteFile(fileId: number, folderId: number): Promise<void> {
        this.folders = this.folders.map((f) =>
            f.id === folderId
                ? { ...f, files: f.files.filter((x) => x.id !== fileId) }
                : f
        );
    }
}
