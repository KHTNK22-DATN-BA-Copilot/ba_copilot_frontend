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
} from "lucide-react";
import { useEffect, useState } from "react";

import { IFileRepository } from "./IFileRepository ";
import { MockFileRepository } from "./MockFileRepository ";
import { FileItem, FolderData } from "./type";

export default function FileManagement() {
    const [folders, setFolders] = useState<FolderData[]>([]);

    const repository: IFileRepository = new MockFileRepository();
    useEffect(() => {
        repository.getFolders()
            .then(data => {
                setFolders(data);
                setExpandedFolders(data.filter(f => f.files.length > 0).map(f => f.id));
            })
            .catch(console.error)
    }, []);


    const [expandedFolders, setExpandedFolders] = useState<number[]>([1, 2, 3]);

    const handleFileUpload = (folderId: number) => {
        // Simulate file upload
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                const newFile = await repository.uploadFile(folderId, file);
                setFolders(
                    folders.map((folder) =>
                        folder.id === folderId
                            ? { ...folder, files: [...folder.files, newFile] }
                            : folder
                    )
                );
            }
        };
        fileInput.click();
    };

    const handleRemoveFile = async (folderId: number, fileId: number) => {
        await repository.deleteFile(fileId, folderId);

        setFolders(
            folders.map((folder) =>
                folder.id === folderId
                    ? {
                          ...folder,
                          files: folder.files.filter((f) => f.id !== fileId),
                      }
                    : folder
            )
        );
    };

    const toggleFolder = (folderId: number) => {
        setExpandedFolders((prev) =>
            prev.includes(folderId)
                ? prev.filter((id) => id !== folderId)
                : [...prev, folderId]
        );
    };

    return (
        <div className="mt-6">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2>File Management</h2>
                        <Badge variant="secondary">
                            {folders.reduce(
                                (acc, f) => acc + f.files.length,
                                0
                            )}{" "}
                            Files
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        {folders.map((folder) => {
                            const isExpanded = expandedFolders.includes(
                                folder.id
                            );

                            return (
                                <div
                                    key={folder.id}
                                    className="border rounded-lg"
                                >
                                    {/* Folder Header */}
                                    <div
                                        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b`}
                                        onClick={() => toggleFolder(folder.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {isExpanded ? (
                                                <FolderOpen
                                                    className={`w-5 h-5 text-blue-500`}
                                                />
                                            ) : (
                                                <Folder
                                                    className={`w-5 h-5 text-blue-500`}
                                                />
                                            )}
                                            <div>
                                                <p
                                                >
                                                    {folder.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {folder.files.length}{" "}
                                                    {folder.files.length === 1
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
                                                    handleFileUpload(folder.id);
                                                }}
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                Upload
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Folder Content */}
                                    {isExpanded && (
                                        <div className="p-4">
                                            {folder.files.length === 0 ? (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                    <p>
                                                        No files in this folder
                                                    </p>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleFileUpload(
                                                                folder.id
                                                            )
                                                        }
                                                        className="mt-2"
                                                    >
                                                        Upload your first file
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {folder.files.map(
                                                        (file) => (
                                                            <div
                                                                key={file.id}
                                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border"
                                                            >
                                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                    <div className="p-2 bg-muted rounded">
                                                                        <File className="w-4 h-4" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="truncate">
                                                                            {
                                                                                file.name
                                                                            }
                                                                        </p>
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <span>
                                                                                {
                                                                                    file.size
                                                                                }
                                                                            </span>
                                                                            <span>
                                                                                •
                                                                            </span>
                                                                            <span>
                                                                                {
                                                                                    file.uploadedDate
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            /* Download file */
                                                                        }}
                                                                    >
                                                                        <Download className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleRemoveFile(
                                                                                folder.id,
                                                                                file.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
