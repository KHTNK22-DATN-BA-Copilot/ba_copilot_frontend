import { IFileRepository } from "./IFileRepository";
import { FileNode } from "./type";
import { getAccessToken } from "@/lib/projects";
import {
    formatFileSize,
    formatDate,
    countFiles,
    removeNodeById,
    renameNodeById,
    addChildToNode,
    calculateFolderPath,
} from "./utils";

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

interface ApiTreeRaw {
    folders?: ApiFolderRaw[];
    files?: ApiFileRaw[];
}

interface ApiFolderRaw {
    id: number;
    name: string;
    folders?: ApiFolderRaw[];
    files?: ApiFileRaw[];
}

interface ApiFileRaw {
    id: number;
    name: string;
    extension?: string;
    file_type?: string;
    file_metadata?: { size?: number };
    created_at?: string;
    updated_at?: string;
}

/** Convert the raw API tree shape into our local `FileNode[]` model. */
function transformApiTree(tree: ApiTreeRaw): FileNode[] {
    const nodes: FileNode[] = [];

    for (const folder of tree.folders ?? []) {
        nodes.push({
            id: folder.id,
            name: folder.name,
            type: "folder",
            children: transformApiTree({ folders: folder.folders, files: folder.files }),
            systemFileType: false,
        });
    }

    for (const file of tree.files ?? []) {
        nodes.push({
            id: file.id,
            name: file.name,
            type: "file",
            size: formatFileSize(file.file_metadata?.size ?? 0),
            uploadedDate: formatDate(file.created_at ?? file.updated_at ?? ""),
            fileType: file.extension ?? file.file_type ?? "",
            file: null as unknown as File,
        });
    }

    return nodes;
}

/** Build a `FileNode` folder from an API-created folder response. */
function buildCreatedFolder(data: { id: number; name: string }): FileNode {
    return {
        id: data.id,
        name: data.name,
        type: "folder",
        children: [],
        systemFileType: false,
    };
}

/** Build `FileNode` file(s) from an API upload response (single or array). */
function buildUploadedFiles(data: ApiFileRaw | ApiFileRaw[]): FileNode[] {
    const items = Array.isArray(data) ? data : [data];
    return items.map((fi) => ({
        id: fi.id,
        name: fi.name,
        type: "file" as const,
        size: formatFileSize(fi.file_metadata?.size ?? 0),
        uploadedDate: formatDate(fi.created_at ?? fi.updated_at ?? ""),
        fileType: fi.extension ?? fi.file_type ?? "",
        file: null as unknown as File,
    }));
}

// ──────────────────────────────────────────────────────────────
// Repository
// ──────────────────────────────────────────────────────────────

export class ApiRepository implements IFileRepository {
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_DOMAIN ?? "http://localhost:8010";
    }

    // ── Auth helper ────────────────────────────────────────────

    private async authHeaders(json = false): Promise<Record<string, string>> {
        const headers: Record<string, string> = {
            Authorization: `Bearer ${await getAccessToken()}`,
        };
        if (json) headers["Content-Type"] = "application/json";
        return headers;
    }

    // ── Tree ───────────────────────────────────────────────────

    async getTreeStructure(projectId: string): Promise<FileNode[]> {
        const resp = await fetch(`${this.baseUrl}/api/v1/projects/${projectId}/tree`, {
            headers: await this.authHeaders(),
        });
        if (!resp.ok) throw new Error(`Failed to fetch tree: ${resp.status}`);

        const data = await resp.json();
        console.log("API tree response:", data);
        const tree: ApiTreeRaw = data?.tree ?? { folders: [], files: [] };
        return transformApiTree(tree);
    }

    // ── Folder CRUD ────────────────────────────────────────────

    async addFolderRecursive(
        nodes: FileNode[],
        parentId: number | null,
        newFolder: FileNode,
        projectId: string,
    ): Promise<FileNode[]> {
        const body = { name: newFolder.name, parent_id: parentId };
        const resp = await fetch(`${this.baseUrl}/api/v1/projects/${projectId}/folders`, {
            method: "POST",
            headers: await this.authHeaders(true),
            body: JSON.stringify(body),
        });
        if (!resp.ok) throw new Error(`Failed to create folder: ${resp.status}`);

        const created = await resp.json();
        return addChildToNode(nodes, parentId, buildCreatedFolder(created));
    }

    async removeFolderRecursive(
        nodes: FileNode[],
        targetId: number,
        projectId: string,
    ): Promise<FileNode[]> {
        const resp = await fetch(`${this.baseUrl}/api/v1/folders/${targetId}`, {
            method: "DELETE",
            headers: await this.authHeaders(),
        });
        if (!resp.ok) throw new Error(`Failed to delete folder: ${resp.status}`);
        return removeNodeById(nodes, targetId);
    }

    async renameFolderRecursive(
        nodes: FileNode[],
        targetId: number,
        newName: string,
        _projectId: string,
    ): Promise<FileNode[]> {
        const resp = await fetch(`${this.baseUrl}/api/v1/folders/${targetId}`, {
            method: "PATCH",
            headers: await this.authHeaders(true),
            body: JSON.stringify({ name: newName }),
        });
        if (!resp.ok) throw new Error(`Failed to rename folder: ${resp.status}`);
        return renameNodeById(nodes, targetId, newName);
    }

    // ── File CRUD ──────────────────────────────────────────────

    async uploadFile(
        nodes: FileNode[],
        folderId: number,
        file: File,
        projectId: string,
    ): Promise<FileNode[]> {
        const folderPath = calculateFolderPath(nodes, folderId);

        const formData = new FormData();
        formData.append("path", folderPath);
        formData.append("files", file);

        const resp = await fetch(
            `${this.baseUrl}/api/v1/files/upload/${projectId}/${folderId}`,
            { method: "POST", headers: await this.authHeaders(), body: formData },
        );
        if (!resp.ok) throw new Error(`Failed to upload file: ${resp.status}`);

        const uploaded = await resp.json();
        const newFiles = buildUploadedFiles(uploaded);

        // Insert new files under the target folder
        return nodes.map((node) => {
            if (node.type === "folder" && node.id === folderId) {
                return { ...node, children: [...node.children, ...newFiles] };
            }
            if (node.type === "folder") {
                return { ...node, children: this.uploadFile(node.children, folderId, file, projectId) as unknown as FileNode[] };
            }
            return node;
        });
    }

    deleteFile(nodes: FileNode[], fileId: number, folderId: number): FileNode[] {
        return nodes.map((node) => {
            if (node.type === "folder" && node.id === folderId) {
                return { ...node, children: node.children.filter((c) => c.id !== fileId) };
            }
            if (node.type === "folder") {
                return { ...node, children: this.deleteFile(node.children, fileId, folderId) };
            }
            return node;
        });
    }

    getTotalFilesCount(nodes: FileNode[]): number {
        return countFiles(nodes);
    }

    // ── Export / Download ──────────────────────────────────────

    async exportFile(documentId: number | string): Promise<void> {
        const resp = await fetch(`${this.baseUrl}/api/v1/files/export/${documentId}`, {
            method: "GET",
            headers: await this.authHeaders(),
            credentials: "include",
        });
        if (!resp.ok) throw new Error(`Failed to export file: ${resp.status}`);

        const blob = await resp.blob();

        // Extract filename from Content-Disposition header
        const disposition = resp.headers.get("Content-Disposition");
        let filename = "download";
        if (disposition) {
            const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (match?.[1]) filename = match[1].replace(/['"]/g, "");
        }

        // Trigger browser download
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(url);
    }
}