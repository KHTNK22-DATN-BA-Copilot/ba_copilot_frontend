'use client";';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Folder,
    FolderOpen,
    Upload,
    Download,
    Trash2,
    File,
    FileIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { IFileRepository } from "./IFileRepository ";
import { MockFileRepository } from "./MockFileRepository ";
import { FileItem, FileNode, FolderData } from "./type";
import { fi } from "zod/v4/locales";

const FileLeaf: React.FC<{
    file: FileNode;
    onDelete: (fileId: number) => void;
    onDownload?: (file: FileItem) => void;
    onSelect?: (file: FileItem) => void;
}> = ({ file, onDelete, onDownload, onSelect }) => {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 bg-muted rounded">
                    <FileIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <button
                        className="text-left w-full truncate"
                        onClick={() => onSelect?.(file)}
                    >
                        {file.name}
                    </button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{file.type == "file" && file.size}</span>
                        <span>•</span>
                        <span>{file.type == "file" && file.uploadedDate}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload?.(file)}
                    aria-label={`Download ${file.name}`}
                >
                    <Download className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(file.id as number)}
                    aria-label={`Delete ${file.name}`}
                >
                    <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
            </div>
        </div>
    );
};

const FolderComposite: React.FC<{
    folder: FileNode;
    expanded?: boolean;
    expandedFolders: Set<number>;
    toggle: (id: number) => void;
    onUpload: (folderId: number) => void;
    onDelete: (folderId: number, fileId: number) => void;
    onDownload?: (file: FileItem) => void;
    onSelect?: (file: FileItem) => void;
}> = ({
    folder,
    expanded,
    expandedFolders,
    toggle,
    onUpload,
    onDelete,
    onDownload,
    onSelect,
}) => {
    
    


    return (
        <div className="border rounded-lg w-full">
            <div
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b`}
                onClick={() => toggle(folder.id as number)}
            >
                <div className="flex items-center gap-3">
                    {expanded ? (
                        <FolderOpen className={`w-5 h-5 text-blue-500`} />
                    ) : (
                        <Folder className={`w-5 h-5 text-blue-500`} />
                    )}
                    <div>
                        <p>{folder.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {folder.type == "folder" && folder.children.length}{" "}
                            {folder.type == "folder" &&
                            folder.children.length === 1
                                ? "file"
                                : "files"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpload(folder.id as number);
                        }}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                    </Button>
                </div>
            </div>

            {expanded && (
                <div className="p-4">
                    {folder.type == "folder" && folder.children.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No files in this folder</p>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => onUpload(folder.id as number)}
                                className="mt-2"
                            >
                                Upload your first file
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {folder.type == "folder" &&
                                folder.children.map((file, index) =>
                                    file.type === "file" ? (
                                        <FileLeaf
                                            key={file.id}
                                            file={file}
                                            onDelete={(fileId) =>
                                                onDelete(
                                                    folder.id as number,
                                                    fileId
                                                )
                                            }
                                            onDownload={onDownload}
                                            onSelect={onSelect}
                                        />
                                    ) : (
                                        <FolderComposite
                                            key={index}
                                            folder={file}
                                            toggle={toggle}
                                            onUpload={onUpload}
                                            expanded={expandedFolders.has(file.id as number)}
                                            expandedFolders={expandedFolders}
                                            onDelete={onDelete}
                                            onDownload={onDownload}
                                            onSelect={onSelect}
                                        />
                                    )
                                )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const fileRepository: IFileRepository = new MockFileRepository();
export default function FileManagement() {
    const [fileNode, setFileNode] = useState<FileNode[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

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
                    if (f.type === "folder" && f.children.length > 0) initial.add(f.id as number);
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
                const newFile: FileNode = await fileRepository.uploadFile(
                    folderId,
                    file
                );
                setFileNode((prevNodes) =>
                    prevNodes.map((folder) =>
                        folder.id === folderId && folder.type === "folder"
                            ? {
                                  ...folder,
                                  children: [...folder.children, newFile],
                              }
                            : folder
                    )
                );
            }
        };
        fileInput.click();
    };

    const handleDeleteFile = async (folderId: number, fileId: number) => {
        await fileRepository.deleteFile(fileId, folderId);
        setFileNode(
            fileNode.map((folder) =>
                folder.id === folderId && folder.type === "folder"
                    ? {
                          ...folder,
                          children: folder.children.filter(
                              (file) => file.id !== fileId
                          ),
                      }
                    : folder
            )
        );
    };

    return (
        <div className="mt-6 w-ful">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2>File Management</h2>
                        <Badge variant="secondary">
                            {fileRepository.getTotalFilesCount()} Files
                        </Badge>
                    </div>

                    <div className="w-full">
                        <div className="col-span-1 space-y-4">
                            {fileNode.map((folder) => (
                                <FolderComposite
                                    key={folder.id}
                                    folder={folder}
                                    expanded={expandedFolders.has(folder.id as number)}
                                    toggle={toggleFolder}
                                    onUpload={handleFileUpload}
                                    onDelete={handleDeleteFile}
                                    expandedFolders={expandedFolders}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
