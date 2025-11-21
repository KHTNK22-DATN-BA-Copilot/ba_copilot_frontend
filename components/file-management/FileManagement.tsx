'use client";';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCallback, useEffect, useRef, useState } from "react";

import { IFileRepository } from "./IFileRepository ";
import { MockFileRepository } from "./MockFileRepository ";
import { FileItem, FileNode, FolderData } from "./type";
import { FolderComposite } from "./FolderComposite";
import { Button } from "../ui/button";

const fileRepository: IFileRepository = new MockFileRepository();

export default function FileManagement() {
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
            .getTreeStructure()
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
    }, []);

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
        fileInput.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];

            if (file) {
                setFileNode((prevNodes) =>
                    fileRepository.uploadFile(prevNodes, folderId, file)
                );
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
        (parentId: number | null, name: string) => {
            const newFolder: FileNode = {
                id: Date.now(), // simple unique id
                name,
                type: "folder",
                systemFileType: false,
                children: [],
            } as FileNode;

            setFileNode((prev) => {
                // duplicate check at target level
                const alreadyExists = (function find(
                    nodes: FileNode[],
                    pid: number | null
                ) {
                    if (pid === null) {
                        return nodes.some(
                            (n) => n.type === "folder" && n.name === name
                        );
                    }
                    for (const n of nodes) {
                        if (n.id === pid && n.type === "folder") {
                            return n.children.some(
                                (c) => c.type === "folder" && c.name === name
                            );
                        }
                        if (n.type === "folder" && n.children) {
                            const found = find(n.children, pid);
                            if (found) return true;
                        }
                    }
                    return false;
                })(prev, parentId);

                if (alreadyExists) return prev;

                if (parentId === null) {
                    // add at root
                    return [...prev, newFolder];
                } else {
                    // delegate to repository helper if available, otherwise do recursive insert here
                    if (
                        typeof (fileRepository as any).addFolderRecursive ===
                        "function"
                    ) {
                        try {
                            return (fileRepository as any).addFolderRecursive(
                                prev,
                                parentId,
                                newFolder
                            );
                        } catch {
                            // fallthrough to manual recursion
                        }
                    }
                    // manual recursion insert
                    const addRec = (nodes: FileNode[]): FileNode[] =>
                        nodes.map((n) => {
                            if (n.id === parentId && n.type === "folder") {
                                return {
                                    ...n,
                                    children: [
                                        ...(n.children ?? []),
                                        newFolder,
                                    ],
                                };
                            }
                            if (n.type === "folder" && n.children) {
                                return { ...n, children: addRec(n.children) };
                            }
                            return n;
                        });
                    return addRec(prev);
                }
            });

            // persist via repository only if parentId !== null and createFolder exists
            if (
                parentId !== null &&
                typeof (fileRepository as any).createFolder === "function"
            ) {
                try {
                    (fileRepository as any).createFolder(parentId, name);
                } catch (err) {
                    console.error("persist createFolder failed", err);
                }
            }

            // ensure parent expanded (for root just expand the new folder)
            setExpandedFolders((prev) => {
                const next = new Set(prev);
                if (parentId === null) {
                    next.add(newFolder.id as number);
                } else {
                    next.add(parentId);
                }
                return next;
            });
        },
        []
    );

    const handleRemoveFolder = async (folderId: number) => {
        // optional: check if folder exists and has children to decide confirm (UI already asked)
        setFileNode((prev) =>
            fileRepository.removeFolderRecursive(prev, folderId)
        );

        // persist via repository if available
        if (typeof (fileRepository as any).deleteFolder === "function") {
            try {
                await (fileRepository as any).deleteFolder(folderId);
            } catch (err) {
                console.error("persist deleteFolder failed", err);
            }
        }

        // also remove from expanded set
        setExpandedFolders((prev) => {
            const next = new Set(prev);
            next.delete(folderId);
            return next;
        });
    };

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
                            {fileNode.map((folder) => (
                                <FolderComposite
                                    key={folder.id}
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
