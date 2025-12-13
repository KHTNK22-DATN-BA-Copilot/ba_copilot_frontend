'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCallback, useEffect, useRef, useState } from "react";

import { IFileRepository } from "./IFileRepository ";
import { MockFileRepository } from "./MockFileRepository ";
import { FileItem, FileNode, FolderData } from "./type";
import { FolderComposite } from "./FolderComposite";
import { Button } from "../ui/button";
import {ApiRepository} from "./ApiRepository";

const fileRepository: IFileRepository = new ApiRepository();

export default function FileManagement({projectId}: {projectId: string}) {
    const [fileNode, setFileNode] = useState<FileNode[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(
        new Set()
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
        fileRepository
            .getTreeStructure(projectId)
            .then((data) => {
                if (!mounted) return;
                setFileNode(data);
                // expand non-empty folders by default
                const initial = new Set<number>();
                data.forEach((f) => {
                    if (f.type === "folder" && f.children.length > 0)
                        initial.add(f.id as number);
                });
                setExpandedFolders(initial);
            })
            .catch(console.error);
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
        fileInput.multiple = false; // Set to true if you want to allow multiple files
        fileInput.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];

            if (file) {
                const tempId = Date.now();
                const tempFileNode: FileNode = {
                    id: tempId,
                    name: file.name,
                    type: "file",
                    size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                    uploadedDate: new Date().toISOString(),
                    fileType: file.name.split('.').pop() || "",
                    file: file,
                };

                // Optimistic update: thêm file vào UI ngay lập tức
                const addFileToFolder = (nodes: FileNode[]): FileNode[] => {
                    return nodes.map((node) => {
                        if (node.id === folderId && node.type === "folder") {
                            return { ...node, children: [...node.children, tempFileNode] };
                        }
                        if (node.type === "folder" && node.children) {
                            return { ...node, children: addFileToFolder(node.children) };
                        }
                        return node;
                    });
                };

                const previousState = fileNode;
                setFileNode(addFileToFolder(fileNode));

                // Expand folder
                setExpandedFolders((prev) => {
                    const next = new Set(prev);
                    next.add(folderId);
                    return next;
                });

                // Gọi API trong background
                try {
                    const updated = await fileRepository.uploadFile(
                        fileNode,
                        folderId,
                        file,
                        projectId
                    );
                } catch (err) {
                    console.error("Failed to upload file:", err);
                    // Rollback nếu API fail
                    setFileNode(previousState);
                    alert("Failed to upload file. Please try again.");
                }
            }
        };
        fileInput.click();
    };

    const handleDeleteFile = async (folderId: number, fileId: number) => {
        setFileNode((prevNodes) =>
            fileRepository.deleteFile(prevNodes, fileId, folderId)
        );
    };

    const handleCreateFolder = useCallback(
        async (parentId: number | null, name: string) => {
            const newFolder: FileNode = {
                id: Date.now(),
                name,
                type: "folder",
                systemFileType: false,
                children: [],
            } as FileNode;

            try {
                const updated = await fileRepository.addFolderRecursive(
                    fileNode,
                    parentId,
                    newFolder,
                    projectId
                );
                console.log("Updated file node after adding folder:", updated);
                setFileNode(updated);

                // expand parent folder after creation
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
        [fileNode, projectId]
    );

    const handleRemoveFolder = async (folderId: number) => {
        try {
            const updated = await fileRepository.removeFolderRecursive(
                fileNode,
                folderId,
                projectId
            );
            setFileNode(updated);

            // also remove from expanded set
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
                const updated = await fileRepository.renameFolderRecursive(
                    fileNode,
                    folderId,
                    newName,
                    projectId
                );
                setFileNode(updated);
            } catch (err) {
                console.error("Failed to rename folder:", err);
            }
        },
        [fileNode, projectId]
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
        if(file.type !== "file") return;
        // implement download logic, e.g., create a link and trigger click
        const url = URL.createObjectURL(file.file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="mt-6 w-ful">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2>File Management</h2>
                        <Badge variant="secondary">
                            {fileRepository.getTotalFilesCount(fileNode)} Files
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
                                        folder.id as number
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
