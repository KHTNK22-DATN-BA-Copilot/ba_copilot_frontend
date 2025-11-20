import { id } from "zod/v4/locales";
import { IFileRepository } from "./IFileRepository ";
import { FileNode, FileItem, FolderData } from "./type";

const mockData: FileNode[] = [
    {
        id: "folder-001",
        name: "SRS document",
        type: "folder",
        systemFileType: true,
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
        systemFileType: false,
        children: [],
    },
    {
        id: "folder-003",
        name: "Project_Plan.docx",
        type: "folder",
        systemFileType: true,
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
                systemFileType: false,
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
        systemFileType: true,
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
    deleteFile(
        nodes: FileNode[],
        fileId: number,
        folderId: number
    ): FileNode[] {
        return nodes.map((node, index) => {
            if (node.type === "folder") {
                if (node.id === folderId) {
                    node.children = node.children.filter(
                        (child) => child.id !== fileId
                    );
                } else {
                    node.children = this.deleteFile(
                        node.children,
                        fileId,
                        folderId
                    );
                }
            }

            return node;
        });
    }

    addFolderRecursive(
        nodes: FileNode[],
        parentId: number,
        newFolder: FileNode
    ): FileNode[] {
        return nodes.map((node) => {
            if (node.id === parentId && node.type === "folder") {
                return { ...node, children: [...node.children, newFolder] };
            }
            if (
                node.type === "folder" &&
                node.children &&
                node.children.length > 0
            ) {
                return {
                    ...node,
                    children: this.addFolderRecursive(
                        node.children,
                        parentId,
                        newFolder
                    ),
                };
            }
            return node;
        });
    }

    uploadFile(nodes: FileNode[], folderId: number, file: File): FileNode[] {
        const newFile: FileNode = {
            id: Date.now(),
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            uploadedDate: new Date().toLocaleDateString(),
            fileType: file.name.split(".").pop() || "file",
            type: "file",
        };

        return nodes.map((node) => {
            if (node.type === "folder") {
                if (node.id === folderId) {
                    return {
                        ...node,
                        children: [...node.children, newFile],
                    };
                }

                return {
                    ...node,
                    children: this.uploadFile(
                        node.children,
                        folderId,
                        file
                    ) as unknown as FileNode[],
                };
            }

            return node;
        });
    }
    getTreeStructure(): Promise<FileNode[]> {
        return Promise.resolve(this.folders);
    }
    getTotalFilesCount(nodes: FileNode[]): number {
        let count = 0;
        nodes.forEach((folder) => {
            if (folder.type === "folder") {
                count += this.getTotalFilesCount(folder.children);
            } else {
                count += 1;
            }
        });
        return count;
    }

    removeFolderRecursive(nodes: FileNode[], targetId: number): FileNode[] {
        return nodes.reduce<FileNode[]>((acc, n) => {
            if (n.id === targetId) {
                // skip this node -> removed
                return acc;
            }
            if (n.type === "folder") {
                const newChildren = this.removeFolderRecursive(
                    n.children ?? [],
                    targetId
                );
                acc.push({ ...n, children: newChildren });
            } else {
                acc.push(n);
            }
            return acc;
        }, []);
    }
}
