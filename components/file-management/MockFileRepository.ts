import { IFileRepository } from "./IFileRepository";
import { FileNode } from "./type";
import { countFiles, removeNodeById, renameNodeById, addChildToNode } from "./utils";

const mockData: FileNode[] = [
    { id: "folder-001", name: "SRS document", type: "folder", systemFileType: true, children: [] },
    { id: "folder-002", name: "Design Docs", type: "folder", systemFileType: true, children: [] },
    { id: "folder-003", name: "Project_Plan.docx", type: "folder", systemFileType: true, children: [] },
    { id: "folder-004", name: "Meeting_Notes", type: "folder", systemFileType: true, children: [] },
];

export class MockFileRepository implements IFileRepository {
    private folders: FileNode[];

    constructor() {
        this.folders = [...mockData];
    }

    async getTreeStructure(_projectId: string): Promise<FileNode[]> {
        return this.folders;
    }

    async uploadFile(nodes: FileNode[], folderId: number, file: File, _projectId: string): Promise<FileNode[]> {
        const newFile: FileNode = {
            id: Date.now(),
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            uploadedDate: new Date().toLocaleDateString(),
            fileType: file.name.split(".").pop() || "file",
            type: "file",
            file,
        };
        return addChildToNode(nodes, folderId, newFile);
    }

    deleteFile(nodes: FileNode[], fileId: number, folderId: number): FileNode[] {
        return nodes.map((node) => {
            if (node.type !== "folder") return node;
            if (node.id === folderId) {
                return { ...node, children: node.children.filter((c) => c.id !== fileId) };
            }
            return { ...node, children: this.deleteFile(node.children, fileId, folderId) };
        });
    }

    async addFolderRecursive(
        nodes: FileNode[],
        parentId: number | null,
        newFolder: FileNode,
        _projectId: string,
    ): Promise<FileNode[]> {
        return addChildToNode(nodes, parentId, newFolder);
    }

    async removeFolderRecursive(nodes: FileNode[], targetId: number, _projectId: string): Promise<FileNode[]> {
        return removeNodeById(nodes, targetId);
    }

    async renameFolderRecursive(nodes: FileNode[], targetId: number, newName: string, _projectId: string): Promise<FileNode[]> {
        return renameNodeById(nodes, targetId, newName);
    }

    getTotalFilesCount(nodes: FileNode[]): number {
        return countFiles(nodes);
    }

    async exportFile(_documentId: number | string): Promise<void> {
        console.warn("MockFileRepository.exportFile: not implemented");
    }
}
