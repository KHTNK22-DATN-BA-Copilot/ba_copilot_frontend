"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCallback, useEffect, useRef, useState } from "react";

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
} from "@/actions/file.action";
import { getAccessToken } from "@/lib/projects";

export default function FileManagement({ projectId }: { projectId: string }) {
    const [fileNode, setFileNode] = useState<FileNode[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(
        new Set(),
    );
    const [creating, setCreating] = useState(false);
    const [creatingParent, setCreatingParent] = useState<number | null>(null);
    const [newName, setNewName] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

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
            .catch(console.error);
        return () => { mounted = false; };
    }, [projectId]);

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
        fileInput.multiple = false;
        fileInput.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return;

            const tempFileNode: FileNode = {
                id: Date.now(),
                name: file.name,
                type: "file",
                size: formatFileSize(file.size),
                uploadedDate: formatDate(Date.now()),
                fileType: file.name.split(".").pop() || "",
                file,
            };

            // Optimistic update
            const previousState = fileNode;
            setFileNode(addChildToNode(fileNode, folderId, tempFileNode));
            setExpandedFolders((prev) => new Set(prev).add(folderId));

            try {
                const folderPath = calculateFolderPath(fileNode, folderId);
                const formData = new FormData();
                formData.append("path", folderPath);
                formData.append("files", file);

                const uploadedFiles = await uploadFileAction(projectId, folderId, formData);

                // Replace optimistic temp node with real server data
                setFileNode((prev) => {
                    const withoutTemp = removeNodeById(prev, tempFileNode.id);
                    let updated = withoutTemp;
                    for (const f of uploadedFiles) {
                        updated = addChildToNode(updated, folderId, f);
                    }
                    return updated;
                });
            } catch (err) {
                console.error("Failed to upload file:", err);
                setFileNode(previousState);
                alert("Failed to upload file. Please try again.");
            }
        };
        fileInput.click();
    };

    const handleDeleteFile = (folderId: number, fileId: number) => {
        setFileNode((prev) => removeNodeById(prev, fileId));
    };

    const handleCreateFolder = useCallback(
        async (parentId: number | null, name: string) => {
            try {
                const created = await createFolderAction(projectId, name, parentId);
                const newFolder: FileNode = {
                    id: created.id,
                    name: created.name,
                    type: "folder",
                    systemFileType: false,
                    children: [],
                };
                setFileNode((prev) => addChildToNode(prev, parentId, newFolder));

                setExpandedFolders((prev) => {
                    const next = new Set(prev);
                    if (parentId !== null) {
                        next.add(parentId);
                    }
                    return next;
                });
            } catch (err) {
                console.error("Failed to create folder:", err);
            }
        },
        [projectId],
    );

    const handleRemoveFolder = async (folderId: number) => {
        try {
            await deleteFolderAction(folderId);
            setFileNode((prev) => removeNodeById(prev, folderId));

            setExpandedFolders((prev) => {
                const next = new Set(prev);
                next.delete(folderId);
                return next;
            });
        } catch (err) {
            console.error("Failed to remove folder:", err);
        }
    };

    const handleRenameFolder = useCallback(
        async (folderId: number, newName: string) => {
            try {
                await renameFolderAction(folderId, newName);
                setFileNode((prev) => renameNodeById(prev, folderId, newName));
            } catch (err) {
                console.error("Failed to rename folder:", err);
            }
        },
        [],
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
            await exportFileFromClient(file.id as number | string, token ?? "");
        } catch (err) {
            console.error("Failed to download file:", err);
            alert("Failed to download file. Please try again.");
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
