import { FileNode } from "./type";

/**
 * Format raw byte size into human-readable string (KB or MB).
 */
export function formatFileSize(sizeBytes: number): string {
    if (sizeBytes < 1024 * 1024) {
        return `${(sizeBytes / 1024).toFixed(2)} KB`;
    }
    return `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Format a date (or timestamp) into dd-MM-yyyy string.
 */
export function formatDate(raw: string | number | Date): string {
    const d = raw instanceof Date ? raw : new Date(raw);
    if (isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

/**
 * Recursively count all files (leaf nodes) in a tree.
 */
export function countFiles(nodes: FileNode[]): number {
    return nodes.reduce((total, node) => {
        if (node.type === "file") return total + 1;
        return total + countFiles(node.children);
    }, 0);
}

/**
 * Recursively remove a node by id from the tree.
 */
export function removeNodeById(nodes: FileNode[], targetId: string | number): FileNode[] {
    return nodes.reduce<FileNode[]>((acc, node) => {
        if (node.id === targetId) return acc;
        if (node.type === "folder") {
            acc.push({ ...node, children: removeNodeById(node.children, targetId) });
        } else {
            acc.push(node);
        }
        return acc;
    }, []);
}

/**
 * Recursively rename a folder node by id.
 */
export function renameNodeById(nodes: FileNode[], targetId: string | number, newName: string): FileNode[] {
    return nodes.map((node) => {
        if (node.id === targetId && node.type === "folder") {
            return { ...node, name: newName };
        }
        if (node.type === "folder") {
            return { ...node, children: renameNodeById(node.children, targetId, newName) };
        }
        return node;
    });
}

/**
 * Recursively add a child node under a folder with the given parentId.
 * If parentId is null, the child is appended to the root level.
 */
export function addChildToNode(
    nodes: FileNode[],
    parentId: string | number | null,
    child: FileNode,
): FileNode[] {
    if (parentId === null) {
        return [...nodes, child];
    }
    return nodes.map((node) => {
        if (node.type === "folder" && node.id === parentId) {
            return { ...node, children: [...node.children, child] };
        }
        if (node.type === "folder") {
            return { ...node, children: addChildToNode(node.children, parentId, child) };
        }
        return node;
    });
}

/**
 * Calculate the path string to a folder by walking the tree.
 */
export function calculateFolderPath(
    nodes: FileNode[],
    folderId: string | number,
    currentPath: string = "",
): string {
    for (const node of nodes) {
        if (node.id === folderId && node.type === "folder") {
            return currentPath ? `${currentPath}/${node.name}` : node.name;
        }
        if (node.type === "folder") {
            const nextPath = currentPath ? `${currentPath}/${node.name}` : node.name;
            const found = calculateFolderPath(node.children, folderId, nextPath);
            if (found) return found;
        }
    }
    return "";
}
