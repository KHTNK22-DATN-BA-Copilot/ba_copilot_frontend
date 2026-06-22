"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { FileNode } from "./type";
import { FolderComposite } from "./FolderComposite";
import { Button } from "../ui/button";
import {
    formatFileSize,
    formatDate,
    addChildToNode,
    removeNodeById,
    renameNodeById,
    calculateFolderPath,
    countFiles,
    exportFileFromClient,
} from "./utils";
import {
    getFileTree,
    createFolderAction,
    deleteFolderAction,
    renameFolderAction,
    uploadFileAction,
    deleteFileAction
} from "@/actions/file.action";
import { getAccessToken } from "@/lib/projects";
import { Analytics } from "@/lib/analytics";
import { useProjectMembership } from "@/context/ProjectMembershipContext";
import { toast } from "sonner";

function getErrorStatus(err: unknown): number | null {
    if (!err || typeof err !== "object") {
        return null;
    }

    const typedErr = err as {
        status?: unknown;
        statusCode?: unknown;
        message?: unknown;
    };

    if (typeof typedErr.status === "number") {
        return typedErr.status;
    }

    if (typeof typedErr.statusCode === "number") {
        return typedErr.statusCode;
    }

    if (typeof typedErr.message === "string") {
        const match = typedErr.message.match(/\b(4\d\d|5\d\d)\b/);
        if (match) {
            return Number(match[1]);
        }
    }

    return null;
}

export default function FileManagement({ projectId }: { projectId: string }) {
    const router = useRouter();
    const { hasPermission } = useProjectMembership();
    const canWriteFolder = hasPermission("folder", "write");
    const [fileNode, setFileNode] = useState<FileNode[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(
        new Set(),
    );
    const [creating, setCreating] = useState(false);
    const [creatingParent, setCreatingParent] = useState<number | null>(null);
    const [newName, setNewName] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loadingFiles, setLoadingFiles] = useState<Set<string | number>>(new Set());

    const showPermissionNotice = useCallback(() => {
        const message = "Your role in this project may have changed to Viewer. You no longer have permission for this action.";
        toast.error(message);
    }, []);


    useEffect(() => {
        if (creating) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [creating]);

    useEffect(() => {
        let mounted = true;
        getFileTree(projectId)
            .then((data) => {
                if (!mounted) return;
                setFileNode(data);
                const initial = new Set<number>();
                data.forEach((f) => {
                    if (f.type === "folder" && f.children.length > 0)
                        initial.add(f.id as number);
                });
                setExpandedFolders(initial);
            })
            .catch((err: any) => {
                if (!mounted) return;

                console.error("Failed to load project structure:", err);

                if (err.status === 404) {
                    toast.error("Project structure data not found.");
                    router.push("/dashboard");
                } else if (err.status === 422) {
                    toast.error("Invalid request. Please check the project ID.");
                    router.push("/dashboard");
                } else {
                    toast.error("An error occurred while loading the folder structure.");
                }
            });
        return () => { mounted = false; };
    }, [projectId, router]);

    const toggleFolder = useCallback((folderId: number) => {
        setExpandedFolders((prev) => {
            const next = new Set(prev);
            if (next.has(folderId)) next.delete(folderId);
            else next.add(folderId);
            return next;
        });
    }, []);

    const handleFileUpload = async (folderId: number) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.multiple = true;
        fileInput.accept = ".pdf, .md, .txt, .docx, .doc"
        fileInput.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const files = target.files ? Array.from(target.files) : [];
            if (files.length === 0) return;

            const tempFileNodes: FileNode[] = files.map((file, index) => ({
                id: `${Date.now()}-${index}`,
                name: file.name,
                type: "file",
                size: formatFileSize(file.size),
                uploadedDate: formatDate(Date.now()),
                fileType: file.name.split(".").pop() || "",
                file,
            }));

            // Optimistic update
            const previousState = fileNode;
            let optimisticState = fileNode;
            for (const tempFileNode of tempFileNodes) {
                optimisticState = addChildToNode(optimisticState, folderId, tempFileNode);
            }
            setFileNode(optimisticState);
            setExpandedFolders((prev) => new Set(prev).add(folderId));

            try {
                const folderPath = calculateFolderPath(fileNode, folderId);
                const formData = new FormData();
                formData.append("path", folderPath);
                for (const file of files) {
                    formData.append("files", file);
                }

                setLoadingFiles((prev) => {
                    const next = new Set(prev);
                    for (const tempFileNode of tempFileNodes) {
                        next.add(tempFileNode.id);
                    }
                    return next;
                });
                const response = await uploadFileAction(projectId, folderId, formData);
                if (!response.success || !response.data) {
                    setFileNode(previousState);
                    if (response.statusCode === 403) {
                        showPermissionNotice();
                    } else if (response.statusCode === 404) {
                        toast.error("Action failed. Invalid file or project.");
                    } else {
                        toast.error(response.message || "Failed to upload file. Please try again.");
                    }
                    return;
                }
                const uploadedFiles = response.data;
                Analytics.uploadFile(projectId, files.length);

                window.dispatchEvent(new Event("file-uploaded"));

                // Replace optimistic temp node with real server data
                setFileNode((prev) => {
                    let updated = prev;
                    for (const tempFileNode of tempFileNodes) {
                        updated = removeNodeById(updated, tempFileNode.id);
                    }
                    for (const f of uploadedFiles) {
                        updated = addChildToNode(updated, folderId, f);
                    }
                    return updated;
                });

                // Fetch fresh tree contents on success
                const freshTree = await getFileTree(projectId);
                setFileNode(freshTree);
                toast.success("File uploaded successfully.");
            } catch (err: any) {
                console.error("Failed to upload file:", err);
                setFileNode(previousState);
                const status = getErrorStatus(err);
                if (status === 403) {
                    showPermissionNotice();
                } else if (status === 404) {
                    toast.error("Action failed. Invalid file or project.");
                } else {
                    toast.error("Failed to upload file. Please try again.");
                }
            } finally {
                setLoadingFiles((prev) => {
                    const next = new Set(prev);
                    for (const tempFileNode of tempFileNodes) {
                        next.delete(tempFileNode.id);
                    }
                    return next;
                });
            }
        };
        fileInput.click();
    };

    const handleDeleteFile = async (_folderId: number, fileId: string | number) => {
        const previousState = fileNode;
        setFileNode((prev) => removeNodeById(prev, fileId));

        try {
            const response = await deleteFileAction(projectId, fileId);
            if (!response.success) {
                setFileNode(previousState);

                if (response.statusCode === 403) {
                    showPermissionNotice();
                } else if (response.statusCode === 404) {
                    toast.error("Action failed. Invalid file or project.");
                } else {
                    toast.error("Failed to delete file. Please try again.");
                }

                return;
            }

            Analytics.deleteFile(fileId);
            // Fetch fresh tree contents on success
            const data = await getFileTree(projectId);
            setFileNode(data);
            toast.success("File deleted successfully.");
        } catch (err: any) {
            console.error("Failed to delete file:", err);
            setFileNode(previousState);
            const status = getErrorStatus(err);
            if (status === 403) {
                showPermissionNotice();
            } else if (status === 404) {
                toast.error("Action failed. Invalid file or project.");
            } else {
                toast.error("Failed to delete file. Please try again.");
            }
        }
    };

    const handleCreateFolder = useCallback(
        async (parentId: number | null, name: string) => {
            try {
                const response = await createFolderAction(projectId, name, parentId);
                if (!response.success || !response.data) {
                    if (response.statusCode === 403) {
                        showPermissionNotice();
                    } else {
                        toast.error(response.message || "Failed to create folder");
                    }
                    return;
                }
                const created = response.data;
                const newFolder: FileNode = {
                    id: created.id,
                    name: created.name,
                    type: "folder",
                    systemFileType: false,
                    children: [],
                };
                Analytics.createFolder(projectId, name);
                setFileNode((prev) => addChildToNode(prev, parentId, newFolder));

                setExpandedFolders((prev) => {
                    const next = new Set(prev);
                    if (parentId !== null) {
                        next.add(parentId);
                    }
                    return next;
                });
            } catch (err: any) {
                console.error("Failed to create folder:", err);
                const status = getErrorStatus(err);
                if (status === 403) {
                    showPermissionNotice();
                } else {
                    toast.error("Failed to create folder. Please try again.");
                }
            }
        },
        [projectId, showPermissionNotice],
    );

    const handleRemoveFolder = async (folderId: number) => {
        try {
            const response = await deleteFolderAction(projectId, folderId);
            if (!response.success) {
                if (response.statusCode === 403) {
                    showPermissionNotice();
                } else {
                    toast.error(response.message || "Failed to remove folder");
                }
                return;
            }
            Analytics.deleteFolder(folderId);
            setFileNode((prev) => removeNodeById(prev, folderId));

            setExpandedFolders((prev) => {
                const next = new Set(prev);
                next.delete(folderId);
                return next;
            });
        } catch (err: any) {
            console.error("Failed to remove folder:", err);
            const status = getErrorStatus(err);
            if (status === 403) {
                showPermissionNotice();
            } else {
                toast.error("Failed to remove folder. Please try again.");
            }
        }
    };

    const handleRenameFolder = useCallback(
        async (folderId: number, newName: string) => {
            try {
                const response = await renameFolderAction(projectId, folderId, newName);
                if (!response.success) {
                    if (response.statusCode === 403) {
                        showPermissionNotice();
                    } else {
                        toast.error(response.message || "Failed to rename folder");
                    }
                    return;
                }
                Analytics.renameFolder(folderId);
                setFileNode((prev) => renameNodeById(prev, folderId, newName));
            } catch (err: any) {
                console.error("Failed to rename folder:", err);
                const status = getErrorStatus(err);
                if (status === 403) {
                    showPermissionNotice();
                } else {
                    toast.error("Failed to rename folder. Please try again.");
                }
            }
        },
        [projectId, showPermissionNotice],
    );

    const handleCreateConfirm = () => {
        const name = (newName ?? "").trim();
        if (!name) {
            setCreating(false);
            setCreatingParent(null);
            setNewName("");
            return;
        }
        // call create then clear UI
        handleCreateFolder(creatingParent, name);
        setCreating(false);
        setCreatingParent(null);
        setNewName("");
        window.dispatchEvent(new Event("folder-created"));
    };

    const handleCreateCancel = () => {
        setCreating(false);
        setCreatingParent(null);
        setNewName("");
    };

    const handleDownload = async (file: FileNode) => {
        if (file.type !== "file" || !file.id) return;

        try {
            const token = await getAccessToken();
            await exportFileFromClient(projectId, file.id as number | string, token ?? "");
            Analytics.downloadFile(file.id as string | number);
        } catch (err: any) {
            console.error("Failed to download file:", err);
            const status = getErrorStatus(err);
            if (status === 403) {
                showPermissionNotice();
            } else if (status === 404) {
                toast.error("Action failed. Invalid file or project.");
            } else {
                toast.error("Failed to download file. Please try again.");
            }
        }
    };

    return (
        <div className="mt-6 w-full">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2>File Management</h2>
                        <Badge variant="secondary">
                            {countFiles(fileNode)} Files
                        </Badge>
                        <Button
                            data-tour="create-folder"
                            disabled={!canWriteFolder}
                            onClick={() => {
                                // show inline input at root
                                setCreating(true);
                                setCreatingParent(null);
                            }}
                        >
                            Create folder
                        </Button>
                    </div>

                    <div className="w-full">
                        <div className="col-span-1 space-y-4">
                            {creating && creatingParent === null && (
                                <div className="p-2 rounded border bg-muted/5">
                                    <input
                                        data-tour="folder-input"
                                        ref={inputRef}
                                        value={newName}
                                        onChange={(e) =>
                                            setNewName(e.target.value)
                                        }
                                        onBlur={() => handleCreateConfirm()}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleCreateConfirm();
                                            } else if (e.key === "Escape") {
                                                handleCreateCancel();
                                            }
                                        }}
                                        placeholder="New folder name"
                                        className="w-full px-2 py-1 rounded border"
                                    />
                                </div>
                            )}
                            {fileNode.map((folder, index) => (
                                <FolderComposite
                                    key={`${folder.id}-${index}`}
                                    folder={folder}
                                    expanded={expandedFolders.has(
                                        folder.id as number,
                                    )}
                                    isUploading={loadingFiles}
                                    toggle={toggleFolder}
                                    onUpload={handleFileUpload}
                                    onDelete={handleDeleteFile}
                                    expandedFolders={expandedFolders}
                                    onCreateFolder={handleCreateFolder}
                                    onRemoveFolder={handleRemoveFolder}
                                    onRenameFolder={handleRenameFolder}
                                    onDownload={handleDownload}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
