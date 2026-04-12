'use server'

import { FileService, ApiFileRaw, ApiTreeRaw } from "@/services/FileService";
import { FileNode } from "@/components/file-management/type";
import { formatFileSize, formatDate } from "@/components/file-management/utils";
import { withAccessToken } from "@/lib/auth-action";

// ── Helpers: transform raw API shapes → FileNode ───────────────

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
            size: formatFileSize(file.file_size ?? 0),
            uploadedDate: formatDate(file.created_at ?? file.updated_at ?? ""),
            fileType: file.extension ?? file.file_type ?? "",
            file: null as unknown as File,
        });
    }

    return nodes;
}

function buildUploadedFiles(data: ApiFileRaw | ApiFileRaw[]): FileNode[] {
    const items = Array.isArray(data) ? data : [data];
    return items.map((fi) => ({
        id: fi.id,
        name: fi.name,
        type: "file" as const,
        size: formatFileSize(fi.file_size ?? 0),
        uploadedDate: formatDate(fi.created_at ?? fi.updated_at ?? ""),
        fileType: fi.extension ?? fi.file_type ?? "",
        file: null as unknown as File,
    }));
}

// ── Server Actions ─────────────────────────────────────────────

export async function getFileTree(projectId: string): Promise<FileNode[]> {
    return withAccessToken(async (token) => {
        const tree = await FileService.getTreeStructure(token, projectId);
        return transformApiTree(tree);
    });
}

export async function createFolderAction(
    projectId: string,
    name: string,
    parentId: number | null,
): Promise<{ id: number; name: string }> {
    return withAccessToken((token) => FileService.createFolder(token, projectId, name, parentId));
}

export async function deleteFolderAction(folderId: number): Promise<void> {
    await withAccessToken((token) => FileService.deleteFolder(token, folderId));
}

export async function renameFolderAction(
    folderId: number,
    newName: string,
): Promise<void> {
    await withAccessToken((token) => FileService.renameFolder(token, folderId, newName));
}

export async function uploadFileAction(
    projectId: string,
    folderId: number,
    formData: FormData,
): Promise<FileNode[]> {
    return withAccessToken(async (token) => {
        const result = await FileService.uploadFile(token, projectId, folderId, formData);
        return buildUploadedFiles(result);
    });
}

export async function deleteFileAction(fileId: number): Promise<void> {
    await withAccessToken((token) => FileService.deleteFile(token, fileId));
}

export async function fileExists(projectId: string): Promise<boolean> {
    const tree = await getFileTree(projectId);

    // Check if there are any files in the tree (ignoring folders)
    const hasFiles = (nodes: FileNode[]): boolean => {
        for (const node of nodes) {
            if (node.type === "file") {
                return true;
            } else if (node.type === "folder" && hasFiles(node.children)) {
                return true;
            }
        }
        return false;
    };

    return hasFiles(tree);

}
