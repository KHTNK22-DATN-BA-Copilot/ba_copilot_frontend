import { get } from "http";
import { IFileRepository } from "./IFileRepository ";
import { FileNode } from "./type";
import { getAccessToken } from "@/lib/projects";

export class ApiRepository implements IFileRepository {
    private folders: FileNode[];
    private baseUrl: string;

    constructor() {
        this.folders = [];
        this.baseUrl = `${process.env.BACKEND_DOMAIN}`
    }

    async getTreeStructure(project_id: string): Promise<FileNode[]> {
        const resp = await fetch(`http://localhost:8010/api/v1/projects/${project_id}/tree`, {
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`,
            }
        });
        if (!resp.ok) {
            throw new Error(`Failed to fetch tree: ${resp.status}`);
        }
        const data = await resp.json();
        console.log("Fetched tree data:", data);
        // Expecting shape { project_id, tree: { folders:[], files:[] } }
        const tree = data?.tree ?? { folders: [], files: [] };
        const nodes = this.transformApiTreeToFileNodes(tree);
        this.folders = nodes;
        return nodes;
    }
    async addFolderRecursive(nodes: FileNode[], parentId: number | null, newFolder: FileNode, project_id: string): Promise<FileNode[]> { 
        // Handle root level folder creation (parentId === null)
        if (parentId === null) {
            const body = { name: newFolder.name, parent_id: null };
            const resp = await fetch(`http://localhost:8010/api/v1/projects/${project_id}/folders`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${await getAccessToken()}` },
                body: JSON.stringify(body),
            });
            if (!resp.ok) throw new Error(`Failed to create folder: ${resp.status}`);
            const created = await resp.json();
            const createdNode: FileNode = {
                id: created.id,
                name: created.name,
                type: "folder",
                children: [],
                systemFileType: false,
            };
            return [...nodes, createdNode];
        }

        // Handle nested folder creation
        return Promise.all(
            nodes.map(async (node) => {
                if (String(node.id) === String(parentId) && node.type === "folder") {
                    // call API to create folder
                    const body = { name: newFolder.name, parent_id: parentId };
                    const resp = await fetch(`http://localhost:8010/api/v1/projects/${project_id}/folders`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${await getAccessToken()}` },
                        body: JSON.stringify(body),
                    });
                    if (!resp.ok) throw new Error(`Failed to create folder: ${resp.status}`);
                    const created = await resp.json();
                    const createdNode: FileNode = {
                        id: created.id,
                        name: created.name,
                        type: "folder",
                        children: [],
                        systemFileType: false,
                    };
                    return { ...node, children: [...node.children, createdNode] };
                }

                if (node.type === "folder" && node.children && node.children.length > 0) {
                    const children = await this.addFolderRecursive(node.children, parentId, newFolder, project_id);
                    return { ...node, children };
                }

                return node;
            })
        );
    }

    private transformApiTreeToFileNodes(tree: any): FileNode[] {
        const out: FileNode[] = [];

        (tree.folders || []).forEach((f: any) => {
            out.push({
                id: f.id,
                name: f.name,
                type: "folder",
                children: this.transformApiTreeToFileNodes({ folders: f.folders, files: f.files }),
                systemFileType: false,
            });
        });

        (tree.files || []).forEach((fi: any) => {
            console.log("Processing file from API:", fi.file_metadata?.size);
            const sizeBytes = fi.file_metadata?.size ?? 0;
            const formattedSize = sizeBytes < 1024 * 1024 
                ? `${(sizeBytes / 1024)} KB` 
                : `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`;

            const rawDate = fi.created_at ?? fi.updated_at;
            let formattedDate = "";
            if (rawDate) {
                const d = new Date(rawDate);
                const day = String(d.getDate()).padStart(2, "0");
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const year = d.getFullYear();
                formattedDate = `${day}-${month}-${year}`;
            }

            out.push({
                id: fi.id,
                name: fi.name,
                type: "file",
                size: formattedSize,
                uploadedDate: formattedDate,
                fileType: fi.extension ?? fi.file_type ?? "",
                file: (null as unknown) as File,
            });
        });

        return out;
    }


    async uploadFile(nodes: FileNode[], folderId: number, file: File, project_id: string): Promise<FileNode[]> {
        // Calculate folder path
        const folderPath = this.calculateFolderPath(nodes, folderId);
        
        // Prepare FormData
        const formData = new FormData();
        formData.append('path', folderPath);
        formData.append('files', file);

        // Call API to upload file
        const resp = await fetch(`http://localhost:8010/api/v1/files/upload/${project_id}/${folderId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`,
            },
            body: formData,
        });
        if (!resp.ok) throw new Error(`Failed to upload file: ${resp.status}`);
        
        const uploaded = await resp.json();
        console.log("Uploaded file response:", uploaded);
        
        // Add uploaded file to tree
        return this.addFileToFolder(nodes, folderId, uploaded);
    }

    private calculateFolderPath(nodes: FileNode[], folderId: number, currentPath: string = ""): string {
        for (const node of nodes) {
            if (node.id === folderId && node.type === "folder") {
                return currentPath ? `${currentPath}/${node.name}` : node.name;
            }
            if (node.type === "folder" && node.children) {
                const newPath = currentPath ? `${currentPath}/${node.name}` : node.name;
                const found = this.calculateFolderPath(node.children, folderId, newPath);
                if (found) return found;
            }
        }
        return "";
    }

    private addFileToFolder(nodes: FileNode[], folderId: number, uploadedFileData: any): FileNode[] {
        return nodes.map((node) => {
            if (node.id === folderId && node.type === "folder") {
                // Handle array of uploaded files or single file
                const uploadedFiles = Array.isArray(uploadedFileData) ? uploadedFileData : [uploadedFileData];
                const newFiles: FileNode[] = uploadedFiles.map((fi: any) => ({
                    id: fi.id,
                    name: fi.name,
                    type: "file" as const,
                    size: fi.file_metadata?.size ?? 0,
                    uploadedDate: fi.created_at ?? fi.updated_at ?? "",
                    fileType: fi.extension ?? fi.file_type ?? "",
                    file: (null as unknown) as File,
                }));
                return { ...node, children: [...node.children, ...newFiles] };
            }
            if (node.type === "folder" && node.children) {
                return { ...node, children: this.addFileToFolder(node.children, folderId, uploadedFileData) };
            }
            return node;
        });
    }
    deleteFile(nodes: FileNode[], fileId: number, folderId: number): FileNode[] {
        throw new Error("Method not implemented.");
    }
    
    getAllFiles?(): Promise<FileNode[]> {
        throw new Error("Method not implemented.");
    }
    getTotalFilesCount(nodes: FileNode[]): number {
        return this.folders.length;
    }
    
    async removeFolderRecursive(nodes: FileNode[], targetId: number, project_id: string): Promise<FileNode[]> {
        // Call API to delete folder
        const resp = await fetch(`http://localhost:8010/api/v1/folders/${targetId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`,
            },
        });
        if (!resp.ok) throw new Error(`Failed to delete folder: ${resp.status}`);

        // Remove folder from local tree
        return nodes.reduce<FileNode[]>((acc, n) => {
            if (n.id === targetId) {
                // skip this node -> removed
                return acc;
            }
            if (n.type === "folder") {
                const newChildren = this.removeFolderRecursiveLocal(
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

    async renameFolderRecursive(nodes: FileNode[], targetId: number, newName: string, project_id: string): Promise<FileNode[]> {
        // Call API to rename folder
        const body = { name: newName };
        const resp = await fetch(`http://localhost:8010/api/v1/folders/${targetId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await getAccessToken()}`,
            },
            body: JSON.stringify(body),
        });
        if (!resp.ok) throw new Error(`Failed to rename folder: ${resp.status}`);

        // Update folder name in local tree
        return this.renameFolderRecursiveLocal(nodes, targetId, newName);
    }

    private renameFolderRecursiveLocal(nodes: FileNode[], targetId: number, newName: string): FileNode[] {
        return nodes.map((n) => {
            if (n.id === targetId && n.type === "folder") {
                return { ...n, name: newName };
            }
            if (n.type === "folder" && n.children) {
                return {
                    ...n,
                    children: this.renameFolderRecursiveLocal(n.children, targetId, newName),
                };
            }
            return n;
        });
    }

    private removeFolderRecursiveLocal(nodes: FileNode[], targetId: number): FileNode[] {
        return nodes.reduce<FileNode[]>((acc, n) => {
            if (n.id === targetId) {
                return acc;
            }
            if (n.type === "folder") {
                const newChildren = this.removeFolderRecursiveLocal(
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

    async exportFile(documentId: number): Promise<void> {
        const resp = await fetch(`http://localhost:8010/api/v1/files/export/${documentId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`,
            }
        });
        
        if (!resp.ok) throw new Error(`Failed to export file: ${resp.status}`);
        
        // Get the blob from response
        const blob = await resp.blob();
        
        // Get filename from Content-Disposition header or use default
        const contentDisposition = resp.headers.get('Content-Disposition');
        let filename = 'download';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '');
            }
        }
        
        // Create download link and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}