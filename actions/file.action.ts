'use server'

import { FileService, ApiFileRaw, ApiTreeRaw, ApiFolderRaw } from "@/services/FileService";
import { FileNode } from "@/components/file-management/type";
import { formatFileSize, formatDate } from "@/components/file-management/utils";
import { withAccessToken } from "@/lib/auth-action";
import { HttpError } from "@/lib/auth-session";
import { ActionResponse } from "@/type/types";

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
            status: file.status ?? "ok",
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
        status: fi.status ?? "ok",
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
): Promise<ActionResponse<{ id: number; name: string }>> {
    try {
        const data = await withAccessToken((token) => FileService.createFolder(token, projectId, name, parentId));
        return {
            success: true,
            message: "Folder created successfully",
            statusCode: 201,
            data,
        };
    } catch (error) {
        if (error instanceof HttpError) {
            return {
                success: false,
                message: "Failed to create folder",
                statusCode: error.statusCode,
            };
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred while creating folder",
            statusCode: 500,
        };
    }
}

export async function getFolderContentsAction(
    projectId: string,
    folderId: number,
): Promise<{ folders: ApiFolderRaw[]; files: ApiFileRaw[] }> {
    return withAccessToken((token) => FileService.getFolderContents(token, projectId, folderId));
}

export async function deleteFolderAction(projectId: string, folderId: number): Promise<ActionResponse> {
    try {
        await withAccessToken((token) => FileService.deleteFolder(token, projectId, folderId));
        return {
            success: true,
            message: "Folder deleted successfully",
            statusCode: 200,
        };
    } catch (error) {
        if (error instanceof HttpError) {
            return {
                success: false,
                message: "Failed to delete folder",
                statusCode: error.statusCode,
            };
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred while deleting folder",
            statusCode: 500,
        };
    }
}

export async function renameFolderAction(
    projectId: string,
    folderId: number,
    newName: string,
): Promise<ActionResponse> {
    try {
        await withAccessToken((token) => FileService.renameFolder(token, projectId, folderId, newName));
        return {
            success: true,
            message: "Folder renamed successfully",
            statusCode: 200,
        };
    } catch (error) {
        if (error instanceof HttpError) {
            return {
                success: false,
                message: "Failed to rename folder",
                statusCode: error.statusCode,
            };
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred while renaming folder",
            statusCode: 500,
        };
    }
}

export async function uploadFileAction(
    projectId: string,
    folderId: number,
    formData: FormData,
): Promise<ActionResponse<FileNode[]>> {
    try {
        const data = await withAccessToken(async (token) => {
            const result = await FileService.uploadFile(token, projectId, folderId, formData);
            return buildUploadedFiles(result);
        });
        return {
            success: true,
            message: "Files uploaded successfully",
            statusCode: 200,
            data,
        };
    } catch (error) {
        if (error instanceof HttpError) {
            return {
                success: false,
                message: "Failed to upload file",
                statusCode: error.statusCode,
            };
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred while uploading file",
            statusCode: 500,
        };
    }
}

export async function deleteFileAction(
    projectId: string,
    fileId: string | number,
): Promise<ActionResponse> {
    try {
        await withAccessToken((token) => FileService.deleteFile(token, projectId, fileId));

        return {
            success: true,
            message: "File deleted successfully",
            statusCode: 200,
        };
    } catch (error) {
        if (error instanceof HttpError) {
            return {
                success: false,
                message: "Failed to delete file",
                statusCode: error.statusCode,
            };
        }

        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred while deleting file",
            statusCode: 500,
        };
    }
}

export async function exportFileAction(projectId: string, fileId: string | number): Promise<string> {
    const blob = await withAccessToken((token) => FileService.exportFile(token, projectId, fileId));
    const buffer = Buffer.from(await blob.arrayBuffer());
    return buffer.toString("base64");
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
